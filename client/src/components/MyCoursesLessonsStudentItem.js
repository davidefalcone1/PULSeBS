import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

function myCoursesLessonsStudentItem (props) {
    return (
        <ListGroup.Item id = {"student-" + props.student.personId}>
            <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
                <PersonIdField id = {props.student.personId}/>
                <FullNameField id = {props.student.personId} fullName = {props.student.fullName}/>
                <EmailField id = {props.student.personId} email = {props.student.email}/>
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
        <div className="col-sm-5">
            <p id={"fullNameOfStudent_" + props.id}>
                {props.fullName}
            </p>
        </div>
    );
}

function EmailField(props){
    return(
        <div className="col-sm-5">
            <p id={"emailOfStudent" + props.id}>
                {props.email}
            </p>
        </div>
    );
}

export default myCoursesLessonsStudentItem;