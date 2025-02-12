//defines the initial state to be used in student component as props and reducers to update the user data
import * as actionTypes from "../ActionTypes";

let initialState = {
    student : {
        studentName : "",
        password : "",
        street : "",
        mobile : 0
    }
}

//this will be used by store to map the action type and then update/create new user state
let StudentReducer = (state=initialState, action)=>{

    switch (action.type) {
        case actionTypes.ADD_STUDENT_TO_STORE:
            return {...state, student : action.payload}    

            break;
    
        default:
            return state;
            break;
    }
}

export default StudentReducer;