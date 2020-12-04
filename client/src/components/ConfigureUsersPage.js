import React from 'react';
import ConfigureUsersItem from './ConfigureUsersItem';
import ListGroup from 'react-bootstrap/ListGroup';

const configureUserPage = (props) => {
  return(
    <AuthContext.Consumer>
      {(context) => (
        <>        
          {context.user && props.usersList && 
          <ListGroup as="ul" variant="flush">
            <ListHeader />
              {props.usersList.map((user) => 
                <ConfigureUsersItem key = {user.personId} user = {user} editUser={props.editUser}/>)
              }
          </ListGroup>}
          {!context.user && <Redirect to="/login"/>}
        </>
      )}
    </AuthContext.Consumer>
  );
}

function ListHeader() {
  return(
    <ListGroup.Item id = {"usersList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-3">
            <h4>User Id</h4>
          </div>
          <div className="col-sm-3">
            <h4>Full Name</h4>
          </div>
          <div className="col-sm-4">
            <h4>Email (Username)</h4>
          </div>
          <div className="col-sm-2">
            <h4>{' '}</h4>
          </div>
        </div>
    </ListGroup.Item>
  );
}

export default configureUserPage;
