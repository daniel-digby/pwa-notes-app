import { IUser, INewUser } from "../../interfaces/user";
import { setUser, updateUser } from "../../config/redux/userSlice";
import { setNotes } from "../../config/redux/noteSlice";
import { RESET_STATE as RESET_OFFLINE } from "@redux-offline/redux-offline/lib/constants";
import {
    store,
    RootStateWithOffline,
    RESET_BASE,
} from "../../config/redux/store";
import { LOG_IN, LOG_OUT, NOTES, REGISTER } from "../../interfaces/endpoints";
import axios from "axios";

// post username password to backend then load notes and populate redux
// reject with unauthorized error when credentials are incorrect
export interface Credentials {
    email: string;
    password: string;
}

export const logInAPI = async (credentials: Credentials): Promise<void> => {
    const authRes = await axios.post(LOG_IN, credentials, {
        withCredentials: true,
    });
    const user = authRes.data;

    if (user) {
        store.dispatch(setUser(user));

        // load notes
        const notesRes = await axios.get(NOTES, { withCredentials: true });
        const notes = notesRes.data;
        if (notes) store.dispatch(setNotes(notes));
        else throw new Error(notesRes.statusText);
    } else throw new Error(authRes.statusText);
};

// post log out to server
// clear redux store and redux offline
// rejects with Non Empty Outbox if there are unsaved http requests
// rejects with Unauthorized when no user jwt
export const logOutAPI = async (): Promise<void> => {
    const outbox = (store.getState() as RootStateWithOffline).offline.outbox;
    if (outbox.length !== 0) throw new Error("Non Empty Outbox");

    const res = await axios.get(LOG_OUT, { withCredentials: true });

    if (res.status == 200) {
        store.dispatch({ type: RESET_OFFLINE });
        store.dispatch({ type: RESET_BASE });
    } else throw new Error(res.statusText);
};

// post new user to backend
// and set returned user in redux
// rejects with Password error on non matching passwords

export const registerAPI = async (newUser: INewUser): Promise<void> => {
    const res = await axios.post(REGISTER, newUser, {
        withCredentials: true,
    });
    const user = res.data;
    if (user) {
        store.dispatch(setUser(user));
    } else throw new Error(res.statusText);
};

export const updateUserAPI = (user: IUser): void => {
    store.dispatch(updateUser(user));
};
