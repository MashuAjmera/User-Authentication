import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class SignUp extends Component {
  state = {
    email: undefined,
    password: undefined,
    fname: undefined,
    lname: undefined,
    notif: undefined,
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSignup = (e) => {
    e.preventDefault();
    this.setState({ notif: "Loading..." });
    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state),
    })
      .then((response) => response.json())
      .then((result) => {
        if (typeof result == "string") this.setState({ notif: result });
      })
      .catch((error) => console.error(error));
  };

  render() {
    if (this.props.login) {
      if (this.props.location.state)
        return <Redirect to={this.props.location.state.from} />;
      else return <Redirect to="/account" />;
    }
    return (
      <form onSubmit={(e) => this.onSignup(e)}>
        <h3>Sign Up</h3>

        <p className="genric-btn default circle mb-3 mr-4">
          {this.state.notif}
        </p>

        <div className="form-group">
          <label>First name</label>
          <input
            type="text"
            name="fname"
            required
            onChange={(event) => this.onChange(event)}
            className="form-control"
            placeholder="Enter your given name"
          />
        </div>

        <div className="form-group">
          <label>Last name</label>
          <input
            type="text"
            className="form-control"
            name="lname"
            required
            onChange={(event) => this.onChange(event)}
            placeholder="Enter your family name"
          />
        </div>

        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            required
            className="form-control"
            onChange={(event) => this.onChange(event)}
            placeholder="Enter your email ID"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            required
            onChange={(event) => this.onChange(event)}
            className="form-control"
            placeholder="Enter a secure password"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Register
        </button>
        <p className="forgot-password text-right">
          Already registered? <a href="/sign-in">Sign in</a>.
        </p>
      </form>
    );
  }
}
