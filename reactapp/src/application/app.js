import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./app.css";
import Footer from "./CommonComponents/FooterComponent";
import Header from "./CommonComponents/HeaderComponent";
import { AppCopy } from "./CommonComponents/AppCopy";
//import Home from "./CommonComponents/HomeComponent";
import Home from './CommonComponents/HomeTrainerComponent'
import About from "./CommonComponents/AboutComponent";
import NotFound from "./CommonComponents/NotFoundComponent";
//import UserComponent from "./ApplicationComponents/User/UserComponent.jsx"; //instead of component we are loading container
//import UserContainer from "./ApplicationComponents/User/UserContainer";
//import UserComponent from "./ApplicationComponents/User/UserComponent";
import StudentComponent from "./ApplicationComponents/User/StudentComponent";
import ProductComponent from "./ApplicationComponents/User/ProductComponent";
import CartComponent from "./ApplicationComponents/User/CartComponent";
import CheckoutComponent from "./ApplicationComponents/User/CheckoutComponent";
import RecentOrders from "./ApplicationComponents/User/RecentOrders";
//import CouponComponent from "./ApplicationComponents/User/CouponComponent";
//import UserHooksComponent from "./ApplicationComponents/User/UserHooksComponent";
import UserHooksComponentRef from "./ApplicationComponents/User/UserHooksComponentRef";
import CurrentTime from "./CommonComponents/JanAssessment/CurrTimeComponent";
import ATMDispencer from "./CommonComponents/JanAssessment/ATMDispencer";

export default class ApplicationComponent extends React.Component {
    constructor(props) {
        super(props); //is used to passback data <props -here> so that its udpated in base object for react framework

        this.state = {
            user: {
                userName: "John Doe",
                address: "123 User Street",
                session: "Online"
            },
            student: {
                studentName: "Jane Smith",
                password: "password123",
                street: "456 Student Avenue",
                mobile: "1234567890"
            }
        };    
    }

    //render - method is responsible to create virtual dom for every change of state or props
    render(){
        //console.log("Render is called!! ", this.state.userName)
        //switch - case works for router
        return(
            <Router>
                <Header/>
                    <Routes>
                        <Route path="/" element={<Home user={this.state.user} />}/>
                        <Route path="home" element={<Home />}/>
                        {/* <Route path="login" element={<UserContainer />}/> */}
                        {/* <Route path="login" element={<UserComponent user={this.state.user} />}/> */}
                        {/* <Route path="login" element={<UserHooksComponent />}/> */}
                        <Route path="login" element={<UserHooksComponentRef />}/> 
                        <Route path="student-login" element={<StudentComponent student={this.state.student} />}/>
                        <Route path="product" element={<ProductComponent />}/>
                        <Route path="cart" element={<CartComponent />}/>
                        <Route path="checkout" element={<CheckoutComponent />} />
                        <Route path="recent-orders" element={<RecentOrders />} /> 
                        <Route path="app" element={<AppCopy />} />
                        <Route path="about" element={<About />} />
                        <Route path="time" element={<CurrentTime />} />
                        <Route path="atm-dispencer" element={<ATMDispencer />} />
                        <Route path="about/:id" element={<About />} />
                        <Route path="*" element={<NotFound />}/>
                    </Routes>
                <Footer/>
            </Router>
        )
    }
}