import express from "express";
import { resetBruteForce } from "../../helpers/security/bruteforce";
import { generateJwt } from "../../helpers/security";
import { IRequestWithUser } from "../../interfaces/expressInterfaces";

const postLogin = async (req: IRequestWithUser, res: express.Response) => {
    resetBruteForce(req.ip, req.user.email);
    const jwt = generateJwt(req.user);

    return res
        .status(200)
        .cookie("jwt", jwt, { httpOnly: true })
        .send(req.user);
};

const getLogout = async (req: IRequestWithUser, res: express.Response) => {
    // TODO (Daniel) blacklist jwt on logout

    return res
        .status(200)
        .cookie("jwt", "null", {
            // expire after 5 seconds
            expires: new Date(Date.now() + 5 * 1000),
        })
        .send();
};

module.exports = {
    postLogin,
    getLogout,
};
