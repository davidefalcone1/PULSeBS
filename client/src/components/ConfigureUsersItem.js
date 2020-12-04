import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

const configureUserItem = (props) => {

  return (
    <ListGroup.Item id = {"user-" + props.user.person}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
            <IdField id = {props.user.personId}/>
            <NameField id = {props.user.personId} name = {props.user.fullName}/>
            <EmailField id = {props.user.personId} email = {props.user.email}/>
            <ButtonField id = {props.user.personId} editUser = {props.editUser}/>
        </div>
    </ListGroup.Item>
  );
}

function IdField(props){
    return(
        <div className="col-sm-3">
            <h6 id={"idOfuser_" + props.id}>
                {props.id}
            </h6>
        </div>
    );
}

function NameField(props){
    return(
        <div className="col-sm-3">
            <h6 id={"nameOfuser_" + props.id}>
                {props.name}
            </h6>
        </div>
    );
}

function EmailField(props){
    return(
        <div className="col-sm-4">
            <h6 id={"emailOfuser_" + props.id}>
                {props.email}
            </h6>
        </div>
    );
}


function ButtonField(props){
    return(
        <div className="col-sm-2">
            <Button variant="primary" onClick={(event) => {
                event.preventDefault();
                props.editUser(); //TODO SEND PARAMETERS
            }} id={"buttonFieldOfuser" + props.id}>
                Edit
            </Button>
        </div>
    );
}

export default configureUserItem;