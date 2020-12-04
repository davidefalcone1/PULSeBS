import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'

const configureClassItem = (props) => {

  return (
    <ListGroup.Item id = {"class-" + props.class.classId}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
            <NameField id = {props.class.classId} name = {props.class.className}/>
            <SeatsField id = {props.class.classId} seats = {props.class.maxSeats}/>
        </div>
    </ListGroup.Item>
  );
}

function NameField(props){
    return(
        <div className="col-sm-6">
            <h6 id={"nameOfClass_" + props.id}>
                {props.name}
            </h6>
        </div>
    );
}

function SeatsField(props){
    return(
        <div className="col-sm-6">
            <h6 id={"seatsOfClass_" + props.id}>
                {props.seats}
            </h6>
        </div>
    );
}

export default configureClassItem;