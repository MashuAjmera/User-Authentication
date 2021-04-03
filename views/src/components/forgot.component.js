import React, { Component } from "react";

export default class Forgot extends Component {
  state = {
    email: undefined,
    notif: undefined,
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  forgotPassword = (e) => {
    e.preventDefault();
    this.setState({ notif: "Loading..." });
    if (this.state.email) {
      fetch("/api/auth/forgot/" + this.state.email, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          this.setState({ notif: result });
          let button = document.getElementById("forgot-password-button");
          button.disabled = true;
          button.innerHTML = "Didn't receive email, resend?";
          setTimeout(function () {
            button.disabled = false;
          }, 12000);
        })
        .catch((error) => console.error(error));
    } else this.setState({ notif: "Enter your email" });
  };

  render() {
    return (
      <form onSubmit={(e) => this.forgotPassword(e)}>
        <h3>We'll get you right back on</h3>

        <p className="genric-btn default circle mb-3 mr-4">
          {this.state.notif}
        </p>

        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            required
            onChange={(event) => this.onChange(event)}
            className="form-control"
            placeholder="Enter your registered email ID"
          />
        </div>

        <button
          type="submit"
          id="forgot-password-button"
          className="btn btn-primary btn-block"
        >
          Submit
        </button>
        <p className="forgot-password text-right">
          Don't have an account? <a href="/sign-up">Sign Up</a>.
        </p>
      </form>
    );
  }
}
