import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../common/PrivateRoute";
import NotFound from "../common/notfound";
import Login from "../App/Auth/Login/Login";
import Dashboard from "../App/Dashboard/Dashboard";
import { menuItem } from "../../linkMenu";

const Routes = (
  <div>
    <Switch>
      <Route path="/login" exact strict component={Login} />
      <PrivateRoute path={"/"} exact strict component={Dashboard} />
      {menuItem.map((val, key) => {
        return (
          <PrivateRoute
            key={key}
            path={val.link}
            exact
            strict
            component={val.component}
          />
        );
      })}
      <Route component={NotFound} />
    </Switch>
  </div>
);

export default Routes;
