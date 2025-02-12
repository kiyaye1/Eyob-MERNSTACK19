import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { SignOutUser } from "../State/User/UserActions";
import NotificationComponent from "../ApplicationComponents/User/NotificationComponent";
import CurrentTime from "../ApplicationComponents/User/CurrTimeComponent";

let Header = (props) => {
  const navigate = useNavigate();
  let user = props.user; // Reading from mapStateToProps
  const isLoggedIn = user && user.email;
  const email = user?.email || "";
  const name = user?.name || "";

  let student = props.student; // Reading from mapStateToProps
  const stdName = student?.studentName || "";

  return (
    <div style={{ width: "100%", padding: "10px 0", borderBottom: "1px solid #ccc" }}>
      {/* Title Section - Centered */}
      <div style={{ textAlign: "center"}}>
        {email !== "" ? (
          <h2>Hi {name}, Welcome to Shopping Cart sponsored by Tech Team SIT</h2>
        ) : stdName !== "" ? (
          <h2>Hi {stdName}, Welcome to the Student Portal of Shopping Cart</h2>
        ) : (
          <h2>
            Welcome to Shopping Cart sponsored by Tech Team SIT
            <h3>Please click on SignIn/Up to proceed</h3>
          </h2>
        )}
      </div>

      <div style={{ textAlign: "left", marginBottom: "10px", padding: "0 20px" }}> 
        <CurrentTime />
      </div>

      {/* Navigation and Controls Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        {/* Left: Navigation Links */}
        <div style={{ display: "flex", gap: "15px" }}>
          <NavLink to="/home" className="button" activeclassname="true">
            Home
          </NavLink>
          {!isLoggedIn && (
            <NavLink to="/login" className="button" activeclassname="true">
              SignIn/Up
            </NavLink>
          )}

          {isLoggedIn && (
            <>
              <NavLink to="/product" className="button" activeclassname="true">
                Product
              </NavLink>
              <NavLink to="/cart" className="button" activeclassname="true">
                Cart
              </NavLink>
              <NavLink to="/recent-orders" className="button" activeclassname="true">
                Recent Orders
              </NavLink>
            </>
          )}
          <NavLink to="/about" className="button" activeclassname="true">
            About
          </NavLink>
        </div>

        {/* Right: Notification & Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {isLoggedIn && <NotificationComponent />}
          {isLoggedIn && (
            <button
              onClick={() => {
                props.signOutUser();
                navigate("/login");
              }}
              style={{
                padding: "8px 12px",
                fontSize: "16px",
                color: "white",
                backgroundColor: "#b22222",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

let mapStateToProps = (store) => {
  return {
    user: store.userReducer.user,
    student: store.studentReducer.student,
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    signOutUser: async () => {
      await dispatch(SignOutUser()); // Ensure it completes first
      localStorage.removeItem("token"); // Remove token AFTER sign-out
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
