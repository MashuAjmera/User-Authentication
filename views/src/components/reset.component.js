import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class Reset extends Component {
  state = {
    password: undefined,
    confirm: undefined,
    notif: undefined,
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onReset = (e) => {
    e.preventDefault();
    if (this.state.password === this.state.confirm) {
      this.setState({ notif: "Loading..." });
      fetch("/api/auth/reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.props.match.params.token,
        },
        body: JSON.stringify(this.state),
      })
        .then((response) => {
          if (response.status === 200)
            setTimeout(function () {
              window.location.assign("/sign-in");
            }, 5000);
          return response.json();
        })
        .then((result) => {
          this.setState({ notif: result });
        })
        .catch((error) => console.error(error));
    } else this.setState({ notif: "Passwords do not match" });
  };

  render() {
    return (
      <form onSubmit={(e) => this.onReset(e)}>
        <h3>Welcome!</h3>

        <p className="badge badge-secondary mt-3">{this.state.notif}</p>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            required
            name="password"
            onChange={(event) => this.onChange(event)}
            placeholder="Enter your new password"
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm"
            className="form-control"
            required
            onChange={(event) => this.onChange(event)}
            placeholder="Enter the same password as above to confirm"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Reset
        </button>
      </form>

      // <section className=" single-post-area section_padding">
      //   <div className="container">
      //     <div className="row justify-content-md-center">
      //       <div className="col-lg-4">
      //         <div className="blog_right_sidebar">
      //           <aside className="single_sidebar_widget newsletter_widget">
      //             <h4 className="widget_title">New password</h4>
      //             <a className="genric-btn default circle d-block mb-3">
      //               {this.state.notif}
      //             </a>
      //             <form onSubmit={(e) => this.onReset(e)}>
      //               <div className="form-group">
      //                 <input
      //                   type="password"
      //                   name="password"
      //                   className="form-control"
      //                   onChange={(event) => this.onChange(event)}
      //                   placeholder="Enter your new password"
      //                   required
      //                 />
      //               </div>
      //               <div className="form-group">
      //                 <input
      //                   type="password"
      //                   className="form-control"
      //                   onChange={(event) => this.onChange(event)}
      //                   name="confirm"
      //                   placeholder="Enter the same password as above to confirm"
      //                   required
      //                 />
      //               </div>
      //               <button
      //                 className="button rounded-0 primary-bg text-white w-100 btn_1"
      //                 type="submit"
      //               >
      //                 Reset
      //               </button>
      //             </form>
      //           </aside>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </section>
    );
  }
}
