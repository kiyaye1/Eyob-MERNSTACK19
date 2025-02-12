import React, { Component } from "react";
import { connect } from "react-redux";//helps react component to connect with store
import { AddStudentToStore, SaveStudentToDBUsingAxios, SaveStudentToDBUsingFetch } from "../../State/Student/StudentActions";

class StudentComponent extends Component{

    constructor(props){
        super(props);

        this.state = {
            studentName : props.student.studentName, // we need to read from store using props through container
            password : props.student.password,
            street : props.student.street,
            mobile : props.student.mobile
        }
    }

    onTextChange = (evt)=>{
        let target = evt.target;
        let classList = target.classList;//reading the class name of html when change event happens
        let value = target.value;
    
        if(classList.contains("username")){
            this.setState({ studentName : value })
        }else if (classList.contains("pass")) {
            this.setState({ password : value })
        } else if (classList.contains("street")) {
            this.setState({ street : value })
        } else {
            this.setState({ mobile : value })
        }    

        evt.preventDefault();
    }

    loginStudent = (evt)=>{        
        let newStudent = this.state;
        alert("Logged Innn -"+JSON.stringify(newStudent))

        //upon student action to login we send student to store
        //this.props.addStudent(newStudent);

        //this.props.saveStudentToDBUsingFetch(newStudent);

        this.props.saveStudentToDBUsingAxios(newStudent);
        
        //this.props.loginStudent(newStudent) //will go to studentcontainer => studentaction => server(db) => store => studentreducer

        evt.preventDefault();
    }


    render(){
        return(
            <>
                <h1>Student Login Page</h1>
                <section className={"componentClass"}>
                    <div className="form col-md-8">
                        <div className="col-md-12">
                            <b>Student Name</b>
                            <input type="text" className="form-control col-md-6 username" 
                                    value={this.state.studentName} 
                                placeholder="Student Name" onChange={this.onTextChange} maxLength={40}/>
            
                            </div>
                            <div className="col-md-12">
                                    <b>Password</b>
                                    <input type="password" className="form-control col-md-6 pass" value={this.state.password} 
                                    placeholder="Password" onChange={this.onTextChange} maxLength={40}/>
                            </div>
                            <div className="col-md-12">
                            <b>Street </b>
                                <input type="text" className="form-control col-md-6 street" value={this.state.street} 
                                        placeholder="Street Name" onChange={this.onTextChange} />
                            </div>
                        
                            <div className="col-md-12">
                                <b>Mobile </b>
                                <input type="number" className="form-control col-md-6 mobile" value={this.state.mobile} 
                                placeholder="Mobile" maxLength="11"
                                onChange={this.onTextChange} />
                            </div>

                            <input type="button" className={"btn btn-primary col-md-2 saveUser"} 
                                    value={"SignIn-Up"} 
                                    onClick={this.loginStudent}/>
                                    
                        </div>
                </section>
            </>
        )
    }
}

//mapstatetoprops -- allows component to become subscriber
let mapStateToProps = (store) => { //store is the redux states
    return {
        student : store.studentReducer.student
    //student - will be accessed as props.student in component
    }
}

//mapDispatchToProps -- allows us to send data back to store to update in reducer
//dispatch - this dispatcher we get from connect to send action to store
let mapDispatchToProps = (dispatch)=>{
    return {
        addStudent : (student)=>{ //action creator
            dispatch(AddStudentToStore(student))
        },
        saveStudentToDBUsingFetch : (student)=>{
            dispatch(SaveStudentToDBUsingFetch(student))
        },
        saveStudentToDBUsingAxios : (student)=>{
            dispatch(SaveStudentToDBUsingAxios(student))
        }
    }
}

//connect accepts - mapStateToProps - for subscribing and mapDispatchToProps - for publishing
export default connect(mapStateToProps, mapDispatchToProps)(StudentComponent)