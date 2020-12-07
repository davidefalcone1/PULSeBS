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
                        PULSeBS Project
                    </Navbar.Brand>

                    <Nav className="mr-auto">
                        {context.isStudent && <>
                            <Nav.Link as={NavLink} to="/myBookableLessonsList"> Book a lesson!</Nav.Link> 
                            <Nav.Link as={NavLink} to="/myBookedLessonslist"> My booked lessons</Nav.Link>
                        </>}
                        {context.isTeacher && <>
                            <Nav.Link as={NavLink} to="/myCoursesLessonslist"> My courses details</Nav.Link>
                        </>}
                        {context.isBookingManager && <>
                            <Nav.Link as={NavLink} to="/monitorUsage"> Monitor usage of the system</Nav.Link>
                        </>}
                        {context.isSupportOfficer && <>
                            <Nav.Link as={NavLink} to="/configureStudentsList"> Students</Nav.Link>
                            <Nav.Link as={NavLink} to="/configureCoursesList"> Courses</Nav.Link>
                            <Nav.Link as={NavLink} to="/configureTeachersList"> Teachers</Nav.Link>
                            <Nav.Link as={NavLink} to="/configureLessonsList"> Lessons</Nav.Link>
                            <Nav.Link as={NavLink} to="/configureClassesList"> Classes</Nav.Link>
                        </>}
                    </Nav>

                    <Nav className="ml-md-auto">
                        {context.user &&
                            <>
                                <Navbar.Brand>
                                    Welcome {context.user.fullname ? context.user.fullname : context.user.name}!
                                </Navbar.Brand> 
                                <Nav.Link onClick = {() => {
                                    context.logoutUser();
                                }}>Logout</Nav.Link>
                            </>}
                        {!context.user && <Nav.Link as = {NavLink} to = "/login">Login</Nav.Link>}
                    </Nav>
                </Navbar>
            )}
        </AuthContext.Consumer>
    );
}

export default navbar;