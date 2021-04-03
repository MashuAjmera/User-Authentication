import React, { Component } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Account from "./components/account.component";
import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Forgot from "./components/forgot.component";
import Reset from "./components/reset.component";

export default class App extends Component {
  state = {
    account: {},
    login: false,
  };

  componentDidMount() {
    this.userdata();
  }

  userdata = () => {
    var token = localStorage.getItem("x-auth-token");
    if (token) {
      fetch("http://localhost:5000/api/users/", {
        headers: {
          "x-auth-token": token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (typeof data !== "string") {
            this.setState({ account: data, login: true });
          }
        })
        .catch((error) => console.error(error));
    } else this.setState({ account: {}, login: false });
  };
  render() {
    return (
      <Router>
        <div className="App">
          <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className="container">
              <Link className="navbar-brand" to={"/"}>
                User Dashboard
              </Link>
              <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo02"
              >
                <ul className="navbar-nav ml-auto">
                  {!this.state.login ? (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to={"/sign-in"}>
                          Login
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to={"/sign-up"}>
                          Sign up
                        </Link>
                      </li>
                    </>
                  ) : (
                    <></>
                  )}
                </ul>
              </div>
            </div>
          </nav>

          <div className="auth-wrapper">
            <div className="auth-inner">
              <Switch>
                <Route
                  path="/"
                  exact
                  render={(props) => (
                    <Account
                      {...props}
                      login={this.state.login}
                      account={this.state.account}
                      userdata={this.userdata}
                    />
                  )}
                />
                <Route
                  path="/sign-in"
                  exact
                  render={(props) => (
                    <Login
                      {...props}
                      login={this.state.login}
                      account={this.state.account}
                      userdata={this.userdata}
                    />
                  )}
                />
                <Route
                  path="/sign-up"
                  exact
                  render={(props) => (
                    <SignUp
                      {...props}
                      login={this.state.login}
                      account={this.state.account}
                      userdata={this.userdata}
                    />
                  )}
                />
                <Route path="/forgot" component={Forgot} />
                <Route path="/reset/:token" component={Reset} />
                <Route component={Account} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
