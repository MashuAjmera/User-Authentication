import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";

export default class Login extends Component {
  state = {
    email: undefined,
    password: undefined,
    notif: undefined,
    rememberMe: false,
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  rememberMe = () => {
    this.setState({ rememberMe: !this.state.rememberMe });
  };

  onLogin = (e) => {
    e.preventDefault();
    this.setState({ notif: "Loading..." });
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state),
    })
      .then((response) => response.json())
      .then((result) => {
        if (typeof result == "string") {
          this.setState({ notif: result });
        } else {
          localStorage.setItem("x-auth-token", result.token);
          this.props.userdata();
        }
      })
      .catch((error) => console.error(error));
  };

  responseGoogle = (res) => {
    this.setState({ notifSignUp: "Loading..." });
    fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: res.accessToken }),
    })
      .then((response) => response.json())
      .then((result) => {
        localStorage.setItem("x-auth-token", result.token);
        this.props.userdata();
      })
      .catch((error) => console.error(error));
  };

  render() {
    if (this.props.login) {
      if (this.props.location.state)
        return <Redirect to={this.props.location.state.from} />;
      else return <Redirect to="/" />;
    }
    return (
      <form onSubmit={(e) => this.onLogin(e)}>
        <h3>Welcome!</h3>

        <p className="genric-btn default circle mb-3 mr-4">
          {this.state.notif}
        </p>

        <GoogleLogin
          clientId="916794588129-s4c5hm3udi95r1t8vktquq2ccecc1jij.apps.googleusercontent.com"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
        />

        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            required
            name="email"
            onChange={(event) => this.onChange(event)}
            placeholder="Enter your registered email ID"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            required
            onChange={(event) => this.onChange(event)}
            placeholder="Enter the password"
          />
        </div>

        <div className="form-group">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              name="rememberMe"
              onClick={this.rememberMe}
              className="custom-control-input"
              id="customCheck1"
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Sign In
        </button>
        <p className="forgot-password text-right">
          <a href="/forgot">Forgot password?</a>
        </p>
        <p className="forgot-password text-right">
          Don't have an account? <a href="/sign-up">Sign Up</a>.
        </p>
      </form>
    );
  }
}
