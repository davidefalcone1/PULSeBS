import React from 'react';
import TicketListItem from './TicketListItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

const ticketDetails = (props) => {
  return(
    <TicketListPageRender differentCounterIds={props.differentCounterIds}
        tickets={props.tickets} callNextCustomerFunction={props.callNextCustomerFunction}
        updateTicketList={props.updateTicketList}/>
  );
}

class TicketListPageRender extends React.Component {

  constructor(props) {
      super(props);
      this.props = props;
      this.state = {nextCustomerSelected: false, nextSelectionMessage: ""}
  }

  updateNextCustomerSelectedState = (status) => {
    this.setState({nextCustomerSelected: status});
  }
  updateNextSelectionMessage = (msg) => {
    this.setState({nextSelectionMessage: msg});
  }

  render(){
    return(
      <>        
        {this.props.differentCounterIds && this.props.tickets &&
          <ListGroup as="ul" variant="flush">
            {this.props.differentCounterIds.map((counter) =>
              <ListGroup.Item key = {counter.COUNTER_ID} id = {"counter-" + counter.COUNTER_ID}>
                <ListHeader counterId={counter.COUNTER_ID}
                    updateNextSelectionMessage = {this.updateNextSelectionMessage}
                    updateNextCustomerSelectedState = {this.updateNextCustomerSelectedState}
                    callNextCustomerFunction = {this.props.callNextCustomerFunction}
                    updateTicketList={this.props.updateTicketList}/>
                <TicketHeader/>
                <ListGroup as="ul" variant="flush">
                  {this.props.tickets.map((ticket) =>
                    (ticket.COUNTER_ID === counter.COUNTER_ID) &&
                    (ticket.STATUS === 1) && //status === 2 --> ticket terminated, no need to show it
                    <TicketListItem key = {ticket.TICKET_ID} ticket = {ticket}/> 
                    )
                  }
                </ListGroup>
              </ListGroup.Item>)}
          </ListGroup>
        }

        {!this.props.tickets && !this.props.differentCounterIds &&
          <NoItemsImage/>
        }

        {this.state.nextCustomerSelected && 
          <Modal show={this.state.nextCustomerSelected} animation={false}>
            <Modal.Header>
              <Modal.Title>Next Customer Selection</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row-md-6">
                {this.state.nextSelectionMessage}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" type="button" 
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({nextCustomerSelected: false});
                }}>Close</Button>
            </Modal.Footer>
          </Modal>
        }
      </>
    )
  }
}

function ListHeader(props) {
  return(
    <ListGroup.Item id = {"counter-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-8">
            <h4>Counter {props.counterId}</h4>
          </div>
          <div className="col-sm-4">
            <Button onClick={(event) => {
                event.preventDefault();
                props.callNextCustomerFunction(props.counterId).then((result) => {
                  props.updateNextSelectionMessage(result);
                  props.updateTicketList();
                });
                props.updateNextCustomerSelectedState(true);
              }} variant="primary" id={"nextCustomerButtonOfCounter" + props.counterId}>
                    NEXT CUSTOMER
                </Button>
          </div>
        </div>
    </ListGroup.Item>
  );
}

function TicketHeader(props) {
  
  return(
    <ListGroup.Item id = {"ticketList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-3">
            <h6>Ticket Number</h6>
          </div>
          <div className="col-sm-6">
            <h6>Service Description</h6>
          </div>
        </div>
    </ListGroup.Item>
  );
}

function NoItemsImage(props){
    return(
        <div className="col-sm-12 pt-3">
            <img width="800" height="600" className="img-button" src='./images/no_data_image.png' alt=""/>
        </div>
    );
}

export default ticketDetails;
