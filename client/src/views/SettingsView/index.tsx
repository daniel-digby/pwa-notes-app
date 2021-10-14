import React, { useState, useEffect, useRef } from "react";
import { capitalize, cloneDeep } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../config/redux/store";
import styles from "./SettingsView.module.css";
import { logOutAPI } from "../../helpers/api/users";
import Profile from "../../components/Profile";
import { useHistory } from "react-router-dom";
// Semantic UI button
import globalStyles from "../../App.module.css";
import { updateUserAPI } from "../../helpers/api/users";
import { Segment, Icon, Image, Input, Ref } from "semantic-ui-react";

import ColourBlocks from "./ColourBlocks";

import { checkAuthAPI } from "../../helpers/api/users";

const SettingsView = (): JSX.Element => {
    const history = useHistory();
    const back = () => history.goBack();
    const logOut = async () => await logOutAPI(history);

    checkAuthAPI(history);

    // api call
    return (
        <div className={globalStyles.light}>
            <div className={styles.container}>
                <div className={styles.leftBanner}>
                    <div>
                        <Profile />
                        <div className={styles.signOut} onClick={logOut}>
                            <Icon name="sign out" size="big" color="grey" />
                            Sign out
                        </div>
                    </div>
                    <div className={styles.backButton}>
                        <Icon
                            name="arrow left"
                            size="big"
                            color="grey"
                            onClick={back}
                        />
                    </div>
                </div>
                {/* Top block of settings */}
                <div className={styles.main}>
                    <Segment raised className={styles.block}>
                        <div className={styles.heading}>
                            <h3>Personal details</h3>
                        </div>
                        {/* All the different forms to enter, split 30% for forms 70% for profile pic */}
                        <div className={styles.personal}>
                            <div className={styles.forms}>
                                <UserDetails />
                            </div>
                            <ProfilePic />
                        </div>
                    </Segment>
                    {/* Bottom block of settings */}
                    {/* TOGGLE OFF FALSE TO REENABLE FEATURE WHEN READY TO WORK ON COLOURSCHEMES */}
                    {false && (
                        <Segment raised className={styles.block}>
                            <div className={styles.heading}>
                                <h3>color schemes</h3>
                            </div>
                            <ColourBlocks />
                        </Segment>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsView;

const UserDetails = (): JSX.Element => {
    const user = useSelector((state: RootState) => state.user.account);
    const firstName = capitalize(user.firstName);
    const lastName = capitalize(user.lastName);
    const email = user.email;
    const password = "*********";

    const [editing, setEditing] = useState("");
    const [input, setInput] = useState("");
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const firstNameId = "First name";
    const lastNameId = "Last name";
    const emailId = "Email";

    const inputRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        document.addEventListener("mousedown", (event) => {
            if (!inputRef.current?.contains(event.target as Node))
                setEditing("");
        });
    });

    const fieldConfirmClick = () => {
        const temp = cloneDeep(user);
        switch (editing) {
            case firstNameId:
                if (input == firstNameId) break;
                temp.firstName = input;
                updateUserAPI(temp);
                break;
            case lastNameId:
                if (input == lastNameId) break;
                temp.lastName = input;
                updateUserAPI(temp);
                break;
            case emailId:
                if (input == emailId) break;
                temp.email = input;
                updateUserAPI(temp);
                break;
        }
        setInput("");
        setEditing("");
    };
    const fieldEditClick = (name: string) => {
        setInput(name);
        setEditing(name);
    };

    return (
        <div>
            <div className={styles.formheading}>
                <div className={styles.formtitle}>
                    {editing == firstNameId ? (
                        <Ref innerRef={inputRef}>
                            <Input
                                action={{
                                    icon: "check",
                                    onClick: fieldConfirmClick,
                                }}
                                style={{
                                    fontSize: "15px",
                                    marginBottom: "23px",
                                    marginTop: "-10px",
                                    width: "92%",
                                }}
                                placeholder={input}
                                onChange={handleInput}
                            />
                        </Ref>
                    ) : (
                        <div className={styles.field}>
                            {firstName}
                            <Icon
                                size="small"
                                name="pencil alternate"
                                color="grey"
                                onClick={() => fieldEditClick(firstNameId)}
                            />
                        </div>
                    )}
                    {editing == lastNameId ? (
                        <Ref innerRef={inputRef}>
                            <Input
                                action={{
                                    icon: "check",
                                    onClick: fieldConfirmClick,
                                }}
                                style={{
                                    fontSize: "15px",
                                    marginBottom: "23px",
                                    marginTop: "-10px",
                                    width: "92%",
                                }}
                                placeholder={input}
                                onChange={handleInput}
                            />
                        </Ref>
                    ) : (
                        <div className={styles.field}>
                            {lastName}
                            <Icon
                                size="small"
                                name="pencil alternate"
                                color="grey"
                                onClick={() => fieldEditClick(lastNameId)}
                            />
                        </div>
                    )}
                    {editing == emailId ? (
                        <Ref innerRef={inputRef}>
                            <Input
                                action={{
                                    icon: "check",
                                    onClick: fieldConfirmClick,
                                }}
                                style={{
                                    fontSize: "15px",
                                    marginBottom: "23px",
                                    marginTop: "-10px",
                                    width: "92%",
                                }}
                                placeholder={input}
                                onChange={handleInput}
                            />
                        </Ref>
                    ) : (
                        <div className={styles.field}>
                            {email}
                            <Icon
                                size="small"
                                name="pencil alternate"
                                color="grey"
                                onClick={() => fieldEditClick(emailId)}
                            />
                        </div>
                    )}
                    <div className={styles.field}>
                        {password}
                        <Icon
                            size="small"
                            name="pencil alternate"
                            color="grey"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfilePic = (): JSX.Element => {
    return (
        <div className={styles.profilePic}>
            <div className={styles.profileTitle}>
                Profile image
                <Icon
                    size="small"
                    name="pencil alternate"
                    color="grey"
                    style={{ marginLeft: "60px" }}
                />{" "}
            </div>

            <div className={styles.image}>
                <Image
                    src="https://react.semantic-ui.com/images/wireframe/square-image.png"
                    size="medium"
                    rounded
                />
            </div>
        </div>
    );
};
