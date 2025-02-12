import * as actionTypes from "../ActionTypes";
import { clearNotificationsOnLogout } from "../../State/Notification/NotificationActions";
import axiosInstance from "../../axiosConfig";

export const AddUserToStore = (userData) => {
    return {
        type: actionTypes.ADD_USER_TO_STORE,
        payload: userData, 
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

// Save user data using Axios
export const SaveUserToDBUsingAxios = (userObj) => {
    return async (dispatch) => {
        try {
            // API call to authenticate or register the user
            const response = await axiosInstance.post("/user/signinup", userObj);

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
            const response = await axiosInstance.post("/user/getUser", { userName });
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

    dispatch(clearNotificationsOnLogout());
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
        const response = await axiosInstance.get(`/user/hobbies?userName=${userName}`);
        dispatch(fetchUserHobbiesSuccess(response.data));
    } catch (error) {
        dispatch(fetchUserHobbiesFailure(error.message));
    }
};

export const addHobbyToDB = (userName, hobby) => async (dispatch) => {
    try {
        const response = await axiosInstance.post("/user/addHobby", { userName, hobby });
        dispatch(addHobbySuccess(response.data));
    } catch (error) {
        dispatch(addHobbyFailure(error.message));
    }
}