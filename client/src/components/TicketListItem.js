import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

function ticketListItem (props) {
    return (
        <ListGroup.Item id = {"ticket-" + props.ticket.TICKET_ID}>
            <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
                <CodeField id = {props.ticket.TICKET_ID} code = {props.ticket.TICKET_NUMBER}/>
                <ServiceDescriptionField id = {props.ticket.id} description = {props.ticket.SERVICE_DESCRIPTION}/>
            </div>
        </ListGroup.Item>
    );
}

function CodeField(props){
    return(
        <div className="col-sm-3">
            <p id={"codeOfTicket_" + props.id}>
                {props.code}
            </p>
        </div>
    );
}

function ServiceDescriptionField(props){
    return(
        <div className="col-sm-6">
            <p id={"descriptionOfTicketService_" + props.id}>
                {props.description}
            </p>
        </div>
    );
}
export default ticketListItem;