import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SaveUserToDBUsingAxios, fetchUserHobbiesFromDB, addHobbyToDB } from "../../State/User/UserActions";

const UserHooksComponentRef = () => {
    // Access Redux state and dispatcher
    const user = useSelector((store) => store.userReducer.user);
    const userHobbies = useSelector((store) => store.userReducer.user.hobbies || []);
    const dispatcher = useDispatch();

    // useRef for uncontrolled components
    const userNameRef = useRef(null);
    const passwordRef = useRef(null);
    const streetRef = useRef(null);
    const mobileRef = useRef(null);

    // State for hobbies
    const [hobby, setHobby] = useState("");
    const [selectedHobby, setSelectedHobby] = useState("");

    // Clear form fields if user changes 
    useEffect(() => {
        if (!user) { 
            userNameRef.current.value = "";
            passwordRef.current.value = "";
            streetRef.current.value = "";
            mobileRef.current.value = "";
        }
    }, [user]);

    // Fetch hobbies when the user logs in
    useEffect(() => {
        if (user.userName) {
            dispatcher(fetchUserHobbiesFromDB(user.userName));
        }
    }, [dispatcher, user.userName]);

    // Handle form submission
    const loginUser = async (evt) => {
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

        try {
            // Dispatch the action to log in or sign up the user
            await dispatcher(SaveUserToDBUsingAxios(userObj));

            // Clear the form fields after successful action
            userNameRef.current.value = "";
            passwordRef.current.value = "";
            streetRef.current.value = "";
            mobileRef.current.value = "";
        } catch (error) {
            console.error("Login/Signup failed:", error);
        }
    };

    // Add a new hobby
    const addHobby = () => {
        if (hobby.trim()) {
            dispatcher(addHobbyToDB(user.userName, hobby));
            setHobby("");
        } else {
            alert("Please enter a hobby.");
        }
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
                            ref={userNameRef} 
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

            <h2>Hobby Management</h2>
            <section>
                <div>
                    <div>
                        <b>Add a Hobby</b>
                        <input
                            type="text"                            
                            placeholder="Enter a hobby"
                            value={hobby}
                            onChange={(e) => setHobby(e.target.value)}
                        />
                        <button onClick={addHobby} >
                            Add Hobby
                        </button>
                    </div>
                    <div>
                        <b>Your Hobbies</b>
                        <select
                            value={selectedHobby}
                            onChange={(e) => setSelectedHobby(e.target.value)}
                        >
                            <option value="" disabled>
                                Select a hobby
                            </option>
                            {userHobbies.map((h, index) => (
                                <option key={index} value={h}>
                                    {h}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>
        </>
    );
};

export default UserHooksComponentRef;
