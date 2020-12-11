import React from 'react';
import ConfigureUsersItem from './ConfigureUsersItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../_services/AuthContext';

const configureUserPage = (props) => {
  return(
    <ConfigureUser usersList={props.usersList} createNewUser={props.createNewUser} type={props.type}
      uploadFileUser={props.uploadFileUser} uploadFileEnrollment={props.uploadFileEnrollment}/>
  );
}

class ConfigureUser extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      file: undefined, isUploading: false, errorFile: false,
      isCreating: false, userId: '', fullName:'', email: '', password: '',
      errorId: false, errorName: false, errorEmail: false, errorPW: false
    }
  }

  activateModal = () => {
    this.setState({isCreating: true});
  }
  activateUploadFileModal = () => {
    this.setState({isUploading: true})
  }

  updateField = (name, value) => {
    this.setState({[name]: value}, () => {
      if(this.state.userId !== ''){
        this.setState({errorId: false});
      }
      if(this.state.fullName !== ''){
        this.setState({errorName: false});
      }
      if(this.state.email !== ''){
        this.setState({errorEmail: false});
      }
      if(this.state.password !== ''){
        this.setState({errorPW: false});
      }
      if(this.state.file !== undefined && this.state.file !== ''){
        this.setState({errorFile: false});
      }
    });
  }

  handleSubmit = () => {
    if (!this.form.checkValidity()) {
        this.form.reportValidity();
    }
    if(this.state.userId !== ''){
      this.setState({errorId: false});
    }
    if(this.state.fullName !== ''){
      this.setState({errorName: false});
    }
    if(this.state.email !== ''){
      this.setState({errorEmail: false});
    }
    if(this.state.password !== ''){
      this.setState({errorPW: false});
    }
    else {
      this.props.createNewUser(this.state.userId, this.state.fullName, this.state.email,
        this.state.password, this.props.type)
      this.setState({isCreating: false});
    }
  }
  handleSubmitFile = () => {
    if (!this.formFile.checkValidity()) {
      this.formFile.reportValidity();
    }
    else if(this.state.file === undefined || this.state.file === ''){ 
      this.setState({errorFile: true});
    }
    else if(this.props.type === 'student' && (this.state.file === undefined || this.state.file === '')){ 
      this.setState({errorFileEnrollment: true});
    }
    else {
        this.props.uploadFileUser(this.state.file)
        this.setState({isUploading: false})
    }
  }

  render(){
    return(
      <AuthContext.Consumer>
        {(context) => (
          <>        
            {context.user && this.props.usersList &&
              <>
                <br/>
                <Row className="justify-content-around">
                    <Button variant="primary" onClick={(event) => {
                          event.preventDefault();
                          this.activateModal();
                      }} id={"activateModalOfUsers"}>
                          Add New
                    </Button>
                    <Button variant="primary" onClick={(event) => {
                          event.preventDefault();
                          this.activateUploadFileModal();
                      }} id={"uploadFileOfUsers"}>
                          Upload User File
                    </Button>
                </Row>
                <ListGroup as="ul" variant="flush">
                  <ListHeader />
                    {this.props.usersList.map((user) => 
                      <ConfigureUsersItem key = {user.personId} user = {user}/>)
                    }
                </ListGroup>

                <Modal show={this.state.isCreating} animation={false} scrollable={true}>
                  <Modal.Header>
                    <Modal.Title>Create new {this.props.type}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form method="POST" action="" id="newUserForm" onSubmit={(ev) => {
                      ev.preventDefault();
                      this.handleSubmit();
                    }} ref={(form) => this.form = form}>
                          
                      <Form.Group>
                        <Form.Label className="control-label">User Id</Form.Label>
                        <Form.Control type="text" name="userId" size = "lg"
                          value = {this.state.userId} required autoFocus
                          onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="control-label">User Full Name</Form.Label>
                        <Form.Control type="text" name="fullName" size = "lg"
                          value = {this.state.fullName} required
                          onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="control-label">User Email</Form.Label>
                        <Form.Control type="text" name="email" size = "lg"
                          value = {this.state.email} required
                          onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="control-label">User Id</Form.Label>
                        <Form.Control type="text" name="password" size = "lg"
                          value = {this.state.password} required
                          onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                      </Form.Group>
                      <Form.Group>
                        <div>
                          <button type="submit" className="btn btn-primary">Create</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" type="button" 
                      onClick={(event) => {
                        event.preventDefault();
                        this.setState({isCreating: false});
                      }}>Close</Button>
                      {this.state.errorId &&
                        <>
                          <br/>
                          <Alert key="idError" variant="danger">
                            Invalid Id.
                          </Alert>
                        </>}
                      {this.state.errorName &&
                        <>
                          <br/>
                          <Alert key="nameError" variant="danger">
                            Invalid name.
                          </Alert>
                        </>}
                      {this.state.errorEmail &&
                        <>
                          <br/>
                          <Alert key="emailError" variant="danger">
                            Invalid email.
                          </Alert>
                        </>}
                      {this.state.errorPW &&
                        <>
                          <br/>
                          <Alert key="pwError" variant="danger">
                            Invalid password.
                          </Alert>
                        </>}
                  </Modal.Footer>
                </Modal>

                <Modal show={this.state.isUploading} animation={false} scrollable={true}>
                  <Modal.Header>
                    <Modal.Title>Upload {this.props.type} file</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form method="POST" action="" id="newUserFormFile" onSubmit={(ev) => {
                      ev.preventDefault();
                      this.handleSubmitFile();
                    }} ref={(form) => this.formFile = form}>                          
                      <Form.Group>
                        <Form.Label className="control-label">Insert {this.props.type} infos file</Form.Label>
                        <Form.Control type="file" name="file" size = "lg"
                          required autoFocus accept=".csv"
                          onChange={(ev) => {                            
                            var f2 =function readFileContent(file) {
                              const reader = new FileReader()
                                return new Promise((resolve, reject) => {
                                  reader.onload=event=>resolve(event.target.result)
                                  reader.onerror = error => reject(error)
                                  reader.readAsText(file)
                                })
                            }
                            
                            f2(ev.target.files[0]).then(content => {
                              this.updateField('file', content)
                            }).catch(error => console.log(error))
                          }}/>
                      </Form.Group>

                      <Form.Group>
                        <div>
                          <button type="submit" className="btn btn-primary">
                            UPLOAD
                          </button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" type="button" 
                      onClick={(event) => {
                        event.preventDefault();
                        this.setState({isUploading: false});
                      }}>Close</Button>
                    {this.state.errorFile &&
                      <>
                        <br/>
                        <Alert key="fileError" variant="danger">
                          Invalid file.
                        </Alert>
                      </>}
                  </Modal.Footer>
                </Modal>  
              </>
            }

            {context.user && !this.props.usersList &&
              <NoItemsImage/>
            }
            {!context.user && <Redirect to="/login"/>}
          </>
        )}
      </AuthContext.Consumer>
    );
  };  
}

function ListHeader() {
  return(
    <ListGroup.Item id = {"usersList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-3">
            <h4>User Id</h4>
          </div>
          <div className="col-sm-4">
            <h4>Full Name</h4>
          </div>
          <div className="col-sm-5">
            <h4>Email (Username)</h4>
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

export default configureUserPage;
