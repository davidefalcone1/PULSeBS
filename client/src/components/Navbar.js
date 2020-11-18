import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {NavLink} from 'react-router-dom';
import { AuthContext } from '../_services/AuthContext'

const navbar = (props) => {
    return (
        <AuthContext.Consumer>
            {(context) => (
                <Navbar bg="dark" variant="dark" expand="md">
                    <Navbar.Toggle data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation" />
                    <Navbar.Brand>
                        PUL Project
                    </Navbar.Brand>

                    <Nav className="mr-auto">
                        {context.isStudent && <>
                            <Nav.Link as={NavLink} to="/lessonsList">Book a lesson!</Nav.Link> 
                            <Nav.Link as={NavLink} to="/myBookedLessonslist"> My booked lessons</Nav.Link>
                        </>}
                        {context.isTeacher && <>
                            <Nav.Link as={NavLink} to="/myCoursesLessonslist"> My courses details</Nav.Link>
                        </>}
                        {/* {context.user.accessLevel === 3 && <></>} */}
                    </Nav>

                    <Nav className="ml-md-auto">
                        {context.user &&
                            <>
                                <Navbar.Brand>
                                    Welcome {context.user.fullname ? context.user.fullname : context.user.name}!
                                </Navbar.Brand> 
                                {/* <Nav.Link onClick = {() => {
                                    context.logoutUser();
                                }}>Logout</Nav.Link> */}
                            </>}
                        {!context.user && <Nav.Link as = {NavLink} to = "/login">Login</Nav.Link>}
                    </Nav>
                </Navbar>
            )}
        </AuthContext.Consumer>
    );
}

export default navbar;