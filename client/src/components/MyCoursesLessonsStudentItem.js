import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'

function myCoursesLessonsStudentItem (props) {
    return (
        <ListGroup.Item id = {"student-" + props.student.personId}>
            <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
                <PersonIdField id = {props.student.personId}/>
                <FullNameField id = {props.student.personId} fullName = {props.student.fullName}/>
                <EmailField id = {props.student.personId} email = {props.student.email}/>
                <SelectField id = {props.student.personId} 
                    booking = {props.booking} setStudentAsPresent = {props.setStudentAsPresent}/>
            </div>
        </ListGroup.Item>
    );
}

function PersonIdField(props){
    return(
        <div className="col-sm-2">
            <p id={"idOfStudent_" + props.id}>
                {props.id}
            </p>
        </div>
    );
}

function FullNameField(props){
    return(
        <div className="col-sm-3">
            <p id={"fullNameOfStudent_" + props.id}>
                {props.fullName}
            </p>
        </div>
    );
}

function EmailField(props){
    return(
        <div className="col-sm-4">
            <p id={"emailOfStudent" + props.id}>
                {props.email}
            </p>
        </div>
    );
}

function SelectField(props){
    return(
        <div className="col-sm-3">
            {!props.booking.attended &&  
                <Button variant="success" onClick={(event) => {
                    event.preventDefault();
                    props.setStudentAsPresent(props.booking.scheduleId, props.booking.studentId);
                }} id={"selectFieldOfLesson" + props.booking.scheduleId + " - " + props.booking.studentId}>
                    Set as Present
                </Button>
            }
        </div>
    );
}

export default myCoursesLessonsStudentItem;