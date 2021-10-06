import express from "express";
import { IUser } from "../../modules/user/userModel";
import { AppError } from "../../helpers/errors";
import { redisClient } from "../../config/redis";
import { RateLimiterRedis } from "rate-limiter-flexible";

const BLACKLISTKEY = "tokenBlacklist";

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;

const limiterSlowBruteByIP = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "login_fail_ip_per_day",
    points: maxWrongAttemptsByIPperDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "login_fail_consecutive_username_and_ip",
    points: maxConsecutiveFailsByUsernameAndIP,
    duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
    blockDuration: 60 * 60, // Block for 1 hour
});

const getUsernameIPkey = (username: string, ip: string) => `${username}_${ip}`;

export const watchBruteforce = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const ip = req.ip;

    const usernameIPkey = getUsernameIPkey(req.body.email, ip);

    const [resUsernameAndIP, resSlowByIP] = await Promise.all([
        limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
        limiterSlowBruteByIP.get(ip),
    ]);

    let retrySecs = 0;

    // Check if IP or Username + IP is already blocked
    if (
        resSlowByIP !== null &&
        resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
    ) {
        retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    } else if (
        resUsernameAndIP !== null &&
        resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP
    ) {
        retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    }

    if (retrySecs > 0) {
        res.set("Retry-After", String(retrySecs));
        res.status(429).send("Too Many Requests");
    } else {
        next();
    }
};

export const resetBruteForce = async (ip: string, email: string) => {
    const usernameIPkey = getUsernameIPkey(email, ip);

    const resUsernameAndIP = await limiterConsecutiveFailsByUsernameAndIP.get(
        usernameIPkey
    );

    if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
        // Reset login limit successful authorisation
        await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
    }
};

export const countBruteForce = async (
    user: IUser,
    email: string,
    ip: string
) => {
    const usernameIPkey = getUsernameIPkey(email, ip);

    try {
        const promises = [limiterSlowBruteByIP.consume(ip)];
        if (user) {
            // Count failed attempts by Username + IP only for registered users
            promises.push(
                limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey)
            );
        }

        await Promise.all(promises);

        throw new AppError(
            "Unauthorized",
            400,
            "incorrect email or password",
            true
        );
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        } else {
            throw new AppError(
                "Too many requests",
                400,
                "Retry-After" +
                    String(Math.round((err as any).msBeforeNext / 1000) || 1),
                true
            );
        }
    }
};
