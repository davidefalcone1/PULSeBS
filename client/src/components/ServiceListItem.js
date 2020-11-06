import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

const serviceListItem = (props) => {

  return (
    <ListGroup.Item id = {"service-" + props.service.id}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
                <CodeField id = {props.service.SERVICE_ID}/>
                <DescriptionField id = {props.service.SERVICE_ID} description = {props.service.NAME}/>
                <SelectField id = {props.service.SERVICE_ID} selectServiceFunction = {props.selectServiceFunction}
                    updateSelectionMessage = {props.updateSelectionMessage}
                    updateServiceSelectedState = {props.updateServiceSelectedState}
                    updateTicketList = {props.updateTicketList}
                />
        </div>
    </ListGroup.Item>
  );
}

function CodeField(props){
    return(
        <div className="col-sm-3">
            <p id={"codeOFService_" + props.id}>
                {props.id}
            </p>
        </div>
    );
}

function DescriptionField(props){
    return(
        <div className="col-sm-6">
            <p id={"descriptionOfService_" + props.id}>
                {props.description}
            </p>
        </div>
    );
}

function SelectField(props){
    return(
        <div className="col-sm-3">
            <Button onClick={(event) => {
                event.preventDefault();
                props.selectServiceFunction(props.id).then((resultString) => {
                    props.updateSelectionMessage(resultString);
                    props.updateTicketList();
                });               
                props.updateServiceSelectedState(true);
            }} variant="success" id={"selectFieldOfService" + props.id}>
                SELECT
            </Button>
        </div>
    );
}

export default serviceListItem;