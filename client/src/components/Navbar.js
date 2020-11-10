import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {NavLink} from 'react-router-dom';

const navbar = (props) => {
    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Navbar.Toggle data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation" />
            <Navbar.Brand href="/index.html">
                Office Queue
            </Navbar.Brand>

            <Nav className="mr-auto">
                {/* {context.userType === 'student' && <></>}
                {context.userType === 'professor' && <></>}
                {context.userType === 'supportManager' && <></>} */}
                <Nav.Link as={NavLink} to="/lessonsList">Book a lesson!</Nav.Link> 
                <Nav.Link as={NavLink} to="/myBookedLessonslist"> My booked lessons</Nav.Link> 
            </Nav>

            {/* <Nav className="ml-md-auto">
                {context.sessionUser && 
                    <>
                        <Navbar.Brand className="d-md-none align-middle">
                            Welcome {context.sessionUser.name ? context.sessionUser.name : context.sessionUser.email}!  
                            <span>   </span>
                            <img src="./drawable/user_icon.png" width="50" height="50" alt="" />
                        </Navbar.Brand> 
                        <Nav.Link onClick = {() => {
                            context.logoutUser();
                        }}>Logout</Nav.Link>
                    </>}
                {!context.sessionUser && <Nav.Link as = {NavLink} to = "/login">Login</Nav.Link>}
            </Nav> */}
        </Navbar>
    );
}

export default navbar;