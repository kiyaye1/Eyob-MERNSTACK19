import { connect } from "react-redux";//helps react component to connect with store
import { AddUserToStore } from "../../State/User/UserActions";
import UserComponent from "./UserComponent.jsx";//we are importing component to be used to access
import StudentComponent from "./StudentComponent.js";

//mapstatetoprops -- allows component to become subscriber
let mapStateToProps = (store) => { //store is the redux states
    return {
        user : store.userReducer.user,
        //user - will be accessed as props.user in component
        
        student : store.studentReducer.student
    }
}

//mapDispatchToProps -- allows us to send data back to store to update in reducer
//dispatch - this dispatcher we get from connect to send action to store
let mapDispatchToProps = (dispatch)=>{
    return {
        addUser : (user)=>{ //action creator
            dispatch(AddUserToStore(user))
        },

        addStudent : (student)=>{ //action creator
            dispatch(AddStudentToStore(student))
        }
    }
}


//connect accepts - mapStateToProps - for subscribing and mapDispatchToProps - for publishing
export default connect(mapStateToProps, mapDispatchToProps)(UserComponent, StudentComponent)