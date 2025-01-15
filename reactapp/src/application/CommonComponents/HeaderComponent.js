import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

let Header = (props) => {
    
    let user = props.user;//reading from mapStateToProps which reads from userReducer.user
    
    const usrName = user && user.userName ? user.userName : "";
    
    let student = props.student;//reading from mapStateToProps which reads from studentReducer.student
    
    const stdName = student && student.studentName ? student.studentName : "";
    return(
        <>
            {usrName !== "" ? (
                <h2>
                    Hi {usrName}, Welcome to Shopping Cart sponsored by Tech Team SIT
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
                <NavLink to="/student-login"  className="button" activeclassname="true"> Student </NavLink>
                <NavLink to="/product"  className="button" activeclassname="true"> Product </NavLink>
                <NavLink to="/cart"  className="button" activeclassname="true"> Cart </NavLink>
                {/* <NavLink to="/coupon"  className="button" activeclassname="true"> Coupon </NavLink> */}
                <NavLink to="/app"  className="button" activeclassname="true"> AppCopy </NavLink>
                <NavLink to="/about"  className="button" activeclassname="true"> About </NavLink>
                <NavLink to="/about/2500"  className="button" activeclassname="true"> About with Param</NavLink>
            </div>
            <hr/>
        </>
    )
}

let mapStateToProps = (store)=>{
    return{
        user : store.userReducer.user,
        student : store.studentReducer.student,
        product : store.productReducer.product
    }
}

export default connect(mapStateToProps, null)(Header);