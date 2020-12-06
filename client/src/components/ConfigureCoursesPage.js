import React from 'react';
import ConfigureCourseItem from './ConfigureCoursesItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { AuthContext } from '../_services/AuthContext';
import { Redirect } from 'react-router-dom';

const configureCoursePage = (props) => {
  return(
    <ConfigureCourses coursesList={props.coursesList} createNewCourse={props.createNewCourse}
      teachersList={props.teachersList} uploadFileCourses={props.uploadFileCourses}/>
  );
}

class ConfigureCourses extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      file: undefined, isUploading: false, errorFile: false,
      isCreating: false, courseName: '', teacherId: 'Select teacher', 
      errorName: false, errorTeacher: false
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
      if(this.state.courseName !== 'Select teacher'){
        this.setState({errorName: false});
      }
      if(this.state.teacherId !== 'Select teacher'){
          this.setState({errorTeacher: false});
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
    else if(this.state.courseName === 'Select teacher'){
        this.setState({errorName: true});
    }
    else if(this.state.teacherId === 'Select teacher'){
        this.setState({errorTeacher: true});
    }
    else {
        this.props.createNewCourse(this.state.courseName, this.state.teacherId)
    }
  }
  handleSubmitFile = () => {
    if (!this.formFile.checkValidity()) {
      this.formFile.reportValidity();
    }
    else if(this.state.file === undefined || this.state.file === ''){ 
      this.setState({errorFile: true});
    }
    else {
        this.props.uploadFileCourses(this.state.file)
        this.setState({isUploading: false})
    }
  }

  render(){
    return(
      <AuthContext.Consumer>
        {(context) => (
          <>        
            {context.user && this.props.coursesList && this.props.teachersList &&
              <>
                <br/>
                <Row className="justify-content-around">
                    <Button variant="primary" onClick={(event) => {
                          event.preventDefault();
                          this.activateModal();
                      }} id={"activateModalOfCourses"}>
                          Add New
                    </Button>
                    <Button variant="primary" onClick={(event) => {
                          event.preventDefault();
                          this.activateUploadFileModal();
                      }} id={"uploadFileOfCourses"}>
                          Upload File
                    </Button>
                </Row>
                <ListGroup as="ul" variant="flush">
                  <ListHeader />
                  {this.props.coursesList.map((course) => 
                      <ConfigureCourseItem key = {course.courseId} course = {course} 
                          teachers = {this.props.teachersList}/>)
                  }
                </ListGroup>

                <Modal show={this.state.isCreating} animation={false} scrollable={true}>
                  <Modal.Header>
                    <Modal.Title>Create new course</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form method="POST" action="" id="newCourseForm" onSubmit={(ev) => {
                      ev.preventDefault();
                      this.handleSubmit();
                    }} ref={(form) => this.form = form}>
                          
                      <Form.Group>
                        <Form.Label className="control-label">Course Name</Form.Label>
                        <Form.Control type="text" name="courseName" size = "lg"
                          value = {this.state.classRoomName} required autoFocus
                          onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="control-label">Teacher</Form.Label>
                        <Form.Control as="select" custom name="teacherId" value = {this.state.courseName} 
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                          <option>Select teacher</option>
                          {this.props.teachersList.map((teacher) =>
                            <option value={teacher.personId}>{teacher.fullName}</option>
                          )}
                        </Form.Control>
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
                      {this.state.errorName &&
                        <>
                          <br/>
                          <Alert key="nameError" variant="danger">
                            Invalid name.
                          </Alert>
                        </>}
                      {this.state.errorTeacher &&
                        <>
                          <br/>
                          <Alert key="teacherError" variant="danger">
                            Invalid teacher.
                          </Alert>
                        </>}
                  </Modal.Footer>
                </Modal>
                
                <Modal show={this.state.isUploading} animation={false} scrollable={true}>
                  <Modal.Header>
                    <Modal.Title>Upload file</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form method="POST" action="" id="newCourseFormFile" onSubmit={(ev) => {
                      ev.preventDefault();
                      this.handleSubmitFile();
                    }} ref={(form) => this.formFile = form}>                          
                      <Form.Group>
                        <Form.Label className="control-label">Insert file</Form.Label>
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
                              this.updateField("file", content)
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

            {context.user && (!this.props.coursesList || this.props.teachersList) && 
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
    <ListGroup.Item id = {"coursesList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-6">
            <h4>Course Name</h4>
          </div>
          <div className="col-sm-6">
            <h4>Teacher</h4>
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

export default configureCoursePage;
