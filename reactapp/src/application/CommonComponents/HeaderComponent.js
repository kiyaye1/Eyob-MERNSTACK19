import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { SignOutUser } from '../State/User/UserActions'

let Header = (props) => {
    const navigate = useNavigate()
    let user = props.user; // reading from mapStateToProps which reads from userReducer.user
    const isLoggedIn = user && user.userName;
    
    const usrName = user && user.userName ? user.userName : "";
    
    let student = props.student;//reading from mapStateToProps which reads from studentReducer.student
    
    const stdName = student && student.studentName ? student.studentName : "";

    return(
        <>
            {usrName !== "" ? (
                <h2>
                    Hi {usrName}, Welcome to Shopping Cart sponsored by Tech Team SIT
                    <button className="button"
                        onClick={() => {
                            props.signOutUser()
                            navigate('/home')
                        }}
                        style={{
                            padding: "10px 15px", 
                            fontSize: "18px",     
                            color: "white",       
                            border: "none",       
                            borderRadius: "5px",  
                            cursor: "pointer",
                            marginLeft: "20px",   
                        }}
                    >
                        Logout
                    </button>
                </h2>
            ) : stdName !== "" ? (
                <h2>
                    Hi {stdName}, Welcome to the Student Portal of Shopping Cart
                </h2>
            ) : (
                <h2>
                    Welcome to Shopping Cart sponsored by Tech Team SIT,
                    <h3>Please click on login button to proceed to login.</h3>
                </h2>
            )}  
            <div>
                <NavLink to="/home"  className="button" activeclassname="true"> Home </NavLink>
                <NavLink to="/login"  className="button" activeclassname="true"> User </NavLink>
                {/* <NavLink to="/student-login"  className="button" activeclassname="true"> Student </NavLink> */}
                {isLoggedIn && (
                    <>
                        <NavLink to="/product"  className="button" activeclassname="true"> Product </NavLink>
                        <NavLink to="/cart"  className="button" activeclassname="true"> Cart </NavLink>
                        <NavLink to="/recent-orders"  className="button" activeclassname="true"> Recent Orders </NavLink>
                    </>
                )}
                <NavLink to="/about"  className="button" activeclassname="true"> About </NavLink>
                <NavLink to="/time"  className="button" activeclassname="true"> Time </NavLink>
                <NavLink to="/atm-dispencer"  className="button" activeclassname="true"> ATM Dispencer </NavLink>
            </div>
        </>
    );
};

/*const mapStateToProps = (store) => ({
    user: store.userReducer.user,
    student : store.studentReducer.student,
    product : store.productReducer.product
});

export default connect(mapStateToProps)(Header);*/

let mapStateToProps = (store) => {
    return {
      user: store.userReducer.user,
      student: store.studentReducer.student,
    }
  }
  
  let mapDispatchToProps = (dispatch) => {
    return {
      signOutUser: () => {
        dispatch(SignOutUser())
      },
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Header)