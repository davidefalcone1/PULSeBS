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
        </Navbar>
    );
}

export default navbar;