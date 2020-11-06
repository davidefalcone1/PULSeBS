import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';

const navbar = (props) => {
    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Navbar.Toggle data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation" />
            <Navbar.Brand href="/index.html">
                Office Queue
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Button variant="light" onClick={() => props.setMode('serviceList')}>Service List</Button>
                <Button variant="light" onClick={() => props.setMode('ticketList')}>Tickets Info</Button>
            </Nav>
        </Navbar>
    );
}

export default navbar;