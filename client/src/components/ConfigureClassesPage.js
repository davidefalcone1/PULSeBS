import React from 'react';
import ConfigureClassItem from './ConfigureClassItem';
import ListGroup from 'react-bootstrap/ListGroup';

const configureClassesPage = (props) => {
  return(
    <AuthContext.Consumer>
      {(context) => (
        <>        
          {context.user && props.classesList && 
          <ListGroup as="ul" variant="flush">
              <ListHeader />
              {props.classesList.map((c) => 
                  <ConfigureClassItem key = {c.classId} class = {c} editClass={props.editClass}/>)}
          </ListGroup>}
          {!context.user && <Redirect to="/login"/>}
        </>
      )}
    </AuthContext.Consumer>
  );
}

function ListHeader() {
  return(
    <ListGroup.Item id = {"classesList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-5">
              <h4>Class Name</h4>
          </div>
          <div className="col-sm-5">
              <h4>Max Available Seats</h4>
          </div>
          <div className="col-sm-2">
              <h4>{' '}</h4>
          </div>
        </div>
    </ListGroup.Item>
  );
}

export default configureClassesPage;
