// defines user actions which contains action type and payload for each action creator to dispatch to store
import * as actionTypes from "../ActionTypes";
import axios from "axios";

// action accepts payload value/object to be used in user reducer switch
export const AddUserToStore = (userData) => {
    return {
        type: actionTypes.ADD_USER_TO_STORE,
        payload: userData, // Updated to accommodate both user and token
    };
};

// Action Creator to store user data on success
export const fetchUserSuccess = (userData) => ({
    type: actionTypes.FETCH_USER_SUCCESS,
    payload: userData,
});

// Action creator to handle errors
export const fetchUserFailure = (error) => ({
    type: actionTypes.FETCH_USER_FAILURE,
    payload: error,
});

// Save user data using Fetch API
/*export const SaveUserToDBUsingFetch = (userObj) => {
    console.log("SaveUserToDBUsingFetch called");
    return (dispatch) => {
        window
            .fetch("http://localhost:9000/user/signinup", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userObj), // JSON object needs to be converted to string
            })
            .then((response) => response.json())
            .then((userData) => {
                console.log(userData);
                // Dispatch or send saved/signin user to reducer
                dispatch(AddUserToStore(userData));
            })
            .catch((error) => console.log(error));
    };
};*/

// Save user data using Axios
export const SaveUserToDBUsingAxios = (userObj) => {
    return async (dispatch) => {
        try {
            // API call to authenticate or register the user
            const response = await axios.post("http://localhost:9000/user/signinup", userObj);

            // Destructure user and token from response
            const { user, token } = response.data;
            console.log("Logged User:", user);
            console.log("Token:", token);

            // Dispatch user and token to Redux store
            dispatch(AddUserToStore({ user, token }));
        } catch (error) {
            console.error("Error in SaveUserToDBUsingAxios:", error.response?.data || error.message);

            // Display an error message if login/signup fails
            alert(error.response?.data?.message || "Login/Signup failed. Please check your credentials.");
        }
    };
};

// Fetch user data based on username
export const fetchUserData = (userName) => {
    return async (dispatch) => {
        try {
            const response = await axios.post("http://localhost:9000/user/getUser", { userName });
            dispatch(fetchUserSuccess(response.data));
        } catch (error) {
            dispatch(fetchUserFailure(error.message));
        }
    };
};

export const SignOutUser = () => {
    return (dispatch) => {
      dispatch({
        type: actionTypes.SIGN_OUT_USER,
      })
  
      /*//clear the cart when user signout
      dispatch(EMPTY_CART())
      //clear the coupon when user signout
      dispatch(EMPTY_COUPON())
      //clear the order when user signout
      dispatch(EMPTY_ORDER())*/
    }
}


export const fetchUserHobbiesSuccess = (hobbies) => ({
    type: actionTypes.FETCH_USER_HOBBIES_SUCCESS,
    payload: hobbies,
});

export const fetchUserHobbiesFailure = (error) => ({
    type: actionTypes.FETCH_USER_HOBBIES_FAILURE,
    payload: error,
});

export const addHobbySuccess = (hobby) => ({
    type: actionTypes.ADD_HOBBY_SUCCESS,
    payload: hobby,
});


export const addHobbyFailure = (error) => ({
    type: actionTypes.ADD_HOBBY_FAILURE,
    payload: error,
});


export const fetchUserHobbiesFromDB = (userName) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:9000/user/hobbies?userName=${userName}`);
        dispatch(fetchUserHobbiesSuccess(response.data));
    } catch (error) {
        dispatch(fetchUserHobbiesFailure(error.message));
    }
};


export const addHobbyToDB = (userName, hobby) => async (dispatch) => {
    try {
        const response = await axios.post("http://localhost:9000/user/addHobby", { userName, hobby });
        dispatch(addHobbySuccess(response.data));
    } catch (error) {
        dispatch(addHobbyFailure(error.message));
    }
}



