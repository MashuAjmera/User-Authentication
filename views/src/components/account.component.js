import React, { Component } from "react";
import { Redirect } from "react-router-dom";

// import window;
export default class Account extends Component {
  state = {
    notif: undefined,
    fname: this.props.account.fname,
    lname: this.props.account.lname,
  };

  profileView = (view) => {
    var show = document.getElementById("show-profile");
    var edit = document.getElementById("edit-profile");
    if (view == "show-profile") {
      show.style.display = "none";
      edit.style.display = "block";
    } else if (view == "edit-profile") {
      show.style.display = "block";
      edit.style.display = "none";
    }
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  editProfile = (e) => {
    this.setState({ notif: "Loading..." });
    var token = localStorage.getItem("x-auth-token");
    if (token) {
      fetch("/api/users/update", {
        method: "POST",
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname: this.state.fname,
          lname: this.state.lname,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (typeof result == "string") this.setState({ notif: result });
        })
        .catch((error) => console.error(error));
    }
  };

  logOut = (e) => {
    e.preventDefault();
    this.setState({ notif: "Loading..." });
    localStorage.removeItem("x-auth-token");
    this.setState({ reviews: [] });
    this.props.userdata();
  };

  render() {
    if (!this.props.login) return <Redirect to="/sign-in" />;
    return (
      <form onSubmit={(e) => this.logOut(e)}>
        <h3>Welcome!</h3>

        <p className="genric-btn default circle mb-3 mr-4">
          {this.state.notif}
        </p>

        <div className="form-group">
          <label>Your Email address</label>
          <input
            type="email"
            className="form-control"
            required
            name="email"
            onChange={(event) => this.onChange(event)}
            value={this.props.account.email}
          />
        </div>

        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            required
            onChange={(event) => this.onChange(event)}
            value={this.state.fname + " " + this.state.lname}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          LogOut
        </button>
      </form>

      // <section className=" section_padding">
      //   <div className="container">
      //     <div className="right-contents">
      //       <div className="sidebar_top">
      //         <a className="genric-btn default circle d-block mb-3">
      //           {this.state.notif}
      //         </a>
      //         <ul id="show-profile">
      //           <li>
      //             <a className="justify-content-between d-flex">
      //               <p>First Name</p>
      //               <span className="color">{this.props.account.fname}</span>
      //             </a>
      //           </li>
      //           <li>
      //             <a className="justify-content-between d-flex">
      //               <p>Last Name</p>
      //               <span className="color">{this.props.account.lname}</span>
      //             </a>
      //           </li>
      //           <li>
      //             <a className="justify-content-between d-flex">
      //               <p>Email ID </p>
      //               <span>{this.props.account.email}</span>
      //             </a>
      //           </li>
      //           <li className="profile-btns">
      //             <button
      //               className="btn_2"
      //               onClick={() => {
      //                 this.profileView("show-profile");
      //               }}
      //             >
      //               Edit
      //             </button>
      //             <button className="btn_1" onClick={(e) => this.logOut(e)}>
      //               Logout
      //             </button>
      //           </li>
      //         </ul>
      //         <form id="edit-profile" onSubmit={this.editProfile}>
      //           <div className="my-3">
      //             <input
      //               type="text"
      //               value={this.state.fname}
      //               name="fname"
      //               placeholder="Enter Your First Name"
      //               required
      //               className="single-input"
      //               onChange={this.onChange}
      //             />
      //           </div>
      //           <div className="my-3">
      //             <input
      //               type="text"
      //               value={this.state.lname}
      //               name="lname"
      //               placeholder="Enter Your Last Name"
      //               required
      //               className="single-input"
      //               onChange={this.onChange}
      //             />
      //           </div>
      //           <div className="my-3">
      //             <input
      //               type="email"
      //               value={this.props.account.email}
      //               placeholder="Your Email Address"
      //               disabled
      //               className="single-input"
      //             />
      //           </div>
      //           <div className="profile-btns">
      //             <button
      //               type="button"
      //               className="btn_2"
      //               onClick={() => {
      //                 this.profileView("edit-profile");
      //               }}
      //             >
      //               Back
      //             </button>
      //             <button type="submit" className="btn_1">
      //               Save
      //             </button>
      //           </div>
      //         </form>
      //       </div>
      //     </div>
      //   </div>
      // </section>
    );
  }
}
