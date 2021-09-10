import React from "react";
import { Route, Switch } from "react-router-dom";

import styles from "./App.module.css";

// import our views
import NotesView from "./views/NotesView";
import HomeView from "./views/HomeView";
import LogInView from "./views/LogInView";
import RegisterView from "./views/RegisterView";
import DashboardView from "./views/DashboardView";
import SettingsView from "./views/SettingsView";

const App = (): JSX.Element => {
    return (
        <div className={styles.pageContainer}>
            <Switch>
                {/* add more routes here, path is the url you want on the frontend component is the view to be rendered */}
                <Route exact path="/" component={HomeView} />
                <Route path="/login" component={LogInView} />
                <Route path="/register" component={RegisterView} />

                <Route path="/dashboard" component={DashboardView} />
                <Route path="/settings" component={SettingsView} />
                <Route path="/notes" component={NotesView} />
            </Switch>
        </div>
    );
};

export default App;
