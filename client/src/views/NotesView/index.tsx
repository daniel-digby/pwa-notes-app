import React from "react";
import styles from "./NotesView.module.css";
import appStyles from "../../App.module.css";
// Semantic UI button
import { Menu } from "semantic-ui-react";

const NotesView = (): JSX.Element => {
    // api call
    return (
        <div>
            <div className={appStyles.sideMenu}>
                <Menu secondary vertical>
                    <Menu.Item name="Pinned" />
                    <Menu.Item name="Events" />
                    <Menu.Item name="Contacts" />
                </Menu>
            </div>
        </div>
    );
};
export default NotesView;
