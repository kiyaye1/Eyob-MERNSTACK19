import React, {Suspense, lazy} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./app.css";
let Footer = lazy(()=> import("./CommonComponents/FooterComponent"));
let Header = lazy(()=> import("./CommonComponents/HeaderComponent"));
let Home = lazy(()=> import('./CommonComponents/HomeTrainerComponent'));
let About = lazy(()=> import("./CommonComponents/AboutComponent"));
let NotFound = lazy(()=> import("./CommonComponents/NotFoundComponent"));
let StudentComponent = lazy(()=> import("./ApplicationComponents/User/StudentComponent"));
let ProductComponent = lazy(()=> import("./ApplicationComponents/User/ProductComponent"));
let CartComponent = lazy(()=> import("./ApplicationComponents/User/CartComponent"));
let CheckoutComponent = lazy(()=> import("./ApplicationComponents/User/CheckoutComponent"));
let RecentOrders = lazy(()=> import("./ApplicationComponents/User/RecentOrders"));
let UserHooksComponentRef = lazy(()=> import("./ApplicationComponents/User/UserHooksComponentRef"));
let CurrentTime = lazy(()=> import("./ApplicationComponents/User/CurrTimeComponent"));
let ATMDispencer = lazy(()=> import("./ApplicationComponents/User/ATMDispencer"));

export default class ApplicationComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                email: "john@gmail.com",
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
        return(
            <Router>
                <div className="topdiv">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Header/>
                            <Routes>
                                <Route path="/" element={<Home user={this.state.user} />}/>
                                <Route path="home" element={<Home />}/>
                                <Route path="login" element={<UserHooksComponentRef />}/> 
                                <Route path="student-login" element={<StudentComponent student={this.state.student} />}/>
                                <Route path="product" element={<ProductComponent />}/>
                                <Route path="cart" element={<CartComponent />}/>
                                <Route path="checkout" element={<CheckoutComponent />} />
                                <Route path="recent-orders" element={<RecentOrders />} /> 
                                <Route path="about" element={<About />} />
                                <Route path="time" element={<CurrentTime />} />
                                <Route path="atm-dispencer" element={<ATMDispencer />} />
                                <Route path="about/:id" element={<About />} />
                                <Route path="*" element={<NotFound />}/>
                            </Routes>
                        <Footer/>
                    </Suspense>
                </div>
            </Router>
        )
    }
}