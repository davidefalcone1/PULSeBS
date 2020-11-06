import React from 'react';
import ServiceListItem from './ServiceListItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

const serviceList = (props) => {
  return(
    <ServiceListPageRender serviceList={props.serviceList}
        selectServiceFunction={props.selectServiceFunction}
        updateTicketList={props.updateTicketList}/>
  );
}

class ServiceListPageRender extends React.Component {

  constructor(props) {
      super(props);
      this.props = props;
      this.state = {serviceSelected: false, selectionMessage: ""}
  }

  updateServiceSelectedState = (status) => {
    this.setState({serviceSelected: status});
  }
  updateSelectionMessage = (msg) => {
    this.setState({selectionMessage: msg});
  }

  render(){
    return(
      <>        
        {this.props.serviceList && 
          <ListGroup as="ul" variant="flush">
              <ListHeader />
              {this.props.serviceList.map((service) => 
                  <ServiceListItem key = {service.SERVICE_ID} service = {service}
                    updateSelectionMessage = {this.updateSelectionMessage}
                    updateServiceSelectedState = {this.updateServiceSelectedState}
                    selectServiceFunction = {this.props.selectServiceFunction}
                    updateTicketList = {this.props.updateTicketList}/>)
              }
          </ListGroup>
        }

        {!this.props.serviceList &&
          <NoItemsImage/>
        }

        {this.state.serviceSelected && 
          <Modal show={this.state.serviceSelected} animation={false}>
            <Modal.Header>
              <Modal.Title>Service Selection</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row-md-6">
                {this.state.selectionMessage}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" type="button" 
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({serviceSelected: false});
                }}>Close</Button>
            </Modal.Footer>
          </Modal>
        }
      </>
    )
  }
}

function ListHeader() {
  return(
    <ListGroup.Item id = {"serviceList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-3">
              <h4>Code</h4>
          </div>
          <div className="col-sm-6">
              <h4>Description</h4>
          </div>
          <div className="col-sm-3">
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

export default serviceList;
