import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SaveUserToDBUsingAxios } from "../../State/User/UserActions";

const UserHooksComponentRef = (props) => {
    // Access Redux state and dispatcher
    const user = useSelector((store) => store.userReducer.user);
    const dispatcher = useDispatch();

    // useRef for uncontrolled components
    const userNameRef = useRef(null);
    const passwordRef = useRef(null);
    const streetRef = useRef(null);
    const mobileRef = useRef(null);

    // useEffect to pre-fill input fields with user data when available
    useEffect(() => {
        if (user) {
            userNameRef.current.value = user.userName || "";
            passwordRef.current.value = ""; 
            streetRef.current.value = user.street || "";
            mobileRef.current.value = user.mobile || "";
        }
    }, [user]);

    // Handle form submission
    const loginUser = (evt) => {
        evt.preventDefault();

        // Get input values
        const userName = userNameRef.current.value.trim();
        const password = passwordRef.current.value.trim();
        const street = streetRef.current.value.trim();
        const mobile = mobileRef.current.value.trim();

        // Basic validation
        if (!userName || !password) {
            alert("Username and password are required!");
            return;
        }

        // Create user object
        const userObj = { userName, password, street, mobile };

        // Dispatch the action to log in or sign up the user
        dispatcher(SaveUserToDBUsingAxios(userObj));
    };

    return (
        <>
            <h1>User Login or Sign-Up Page</h1>
            <section className={"componentClass"}>
                <div className="form col-md-8">
                    <div className="col-md-12">
                        <b>User Name</b>
                        <input
                            type="text"
                            className="form-control col-md-6 username"
                            placeholder="User Name"
                            ref={userNameRef} // Using ref for uncontrolled input
                            maxLength={40}
                        />
                    </div>
                    <div className="col-md-12">
                        <b>Password</b>
                        <input
                            type="password"
                            className="form-control col-md-6 pass"
                            placeholder="Password"
                            ref={passwordRef}
                            maxLength={20}
                        />
                    </div>
                    <div className="col-md-12">
                        <b>Street</b>
                        <input
                            type="text"
                            className="form-control col-md-6 street"
                            placeholder="Street Name"
                            ref={streetRef}
                        />
                    </div>
                    <div className="col-md-12">
                        <b>Mobile</b>
                        <input
                            type="number"
                            className="form-control col-md-6 mobile"
                            placeholder="Mobile"
                            ref={mobileRef}
                            maxLength={11}
                        />
                    </div>
                    <div className="col-md-12">
                        <input
                            type="button"
                            className={"btn btn-primary col-md-2 saveUser"}
                            value={"Sign In / Sign Up"}
                            onClick={loginUser}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default UserHooksComponentRef;
