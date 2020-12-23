import React from 'react';
import ConfigureClassesItem from './ConfigureClassesItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { AuthContext } from '../_services/AuthContext';
import { Redirect } from 'react-router-dom';

const configureClassesPage = (props) => {
  return(
    <ConfigureClasses courses={props.courses} studentsInfos={props.studentsInfos} 
        enrollmentInfos={props.enrollmentInfos} createNewEnrollment={props.createNewEnrollment}
        uploadFileEnrollment={props.uploadFileEnrollment}/>
  )
}

class ConfigureClasses extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      file: undefined, isUploading: false, errorFile: false,
      isCreating: false, studentId: 'Select student', courseId: 'Select course',
      errorStudent: false, errorCourse: false
    }
  }

  activateModal = () => {
    this.setState({isCreating: true, studentId: 'Select student', courseId: 'Select course'});
  }
  activateUploadFileModal = () => {
    this.setState({isUploading: true})
  }

  updateField = (name, value) => {
    this.setState({[name]: value}, () => {
      if(this.state.studentId !== 'Select student'){
        this.setState({errorStudent: false});
      }
      if(this.state.courseId !== 'Select course'){
          this.setState({errorCourse: false});
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
    else if(this.state.studentId === 'Select student'){
        this.setState({errorStudent: true});
    }
    else if(this.state.courseId === 'Select course'){
        this.setState({errorCourse: true});
    }
    else {
        this.props.createNewEnrollment(this.state.studentId, this.state.courseId);
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
    else {
        this.props.uploadFileEnrollment(this.state.file)
        this.setState({isUploading: false})
    }
  }
  
  render(){
    return(
      <AuthContext.Consumer>
        {(context) => (
          <>
            {context.user && this.props.courses && this.props.studentsInfos 
              && this.props.enrollmentInfos &&
              <>
                <br/>
                <Row className="justify-content-around">
                    <Button variant="primary" onClick={(event) => {
                          event.preventDefault();
                          this.activateModal();
                      }} id={"activateModalOfClasses"}>
                          Add New
                    </Button>
                    <Button variant="primary" onClick={(event) => {
                          event.preventDefault();
                          this.activateUploadFileModal();
                      }} id={"uploadFileOfClasses"}>
                          Upload File
                    </Button>
                </Row>
                <ListGroup as="ul" variant="flush">
                    <ListHeader />
                    {this.props.enrollmentInfos.map((e) => 
                        <ConfigureClassesItem key = {e.studentId + "-" + e.courseId}
                            enrollment = {e} students = {this.props.studentsInfos}
                            courses = {this.props.courses}/>)}
                </ListGroup>

                <Modal show={this.state.isCreating} animation={false} scrollable={true} backdrop={'static'}>
                  <Modal.Header>
                    <Modal.Title>Create new enrollment data</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form method="POST" action="" id="newClassForm" onSubmit={(ev) => {
                      ev.preventDefault();
                      this.handleSubmit();
                    }} ref={(form) => this.form = form}>
                          
                      <Form.Group>
                        <Form.Label className="control-label">Course</Form.Label>
                        <Form.Control as="select" custom name="courseId" value = {this.state.courseId} key={this.state.courseId}
                            defaultValue = {this.state.courseId}
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                          <option>Select course</option>
                          {this.props.courses.map((course) =>
                            <option value={course.courseId} key={course.courseId}>{course.courseName}</option>
                          )}
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="control-label">Student</Form.Label>
                        <Form.Control as="select" custom name="studentId" value = {this.state.studentId} key={this.state.studentId}
                            defaultValue = {this.state.studentId}
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                          <option>Select student</option>
                          {this.props.studentsInfos.map((s) =>
                            <option value={s.personId} key={s.personId}>{s.fullName}</option>
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
                    {this.state.errorStudent &&
                      <>
                        <br/>
                        <Alert key="nameError" variant="danger">
                          Invalid student.
                        </Alert>
                      </>}
                    {this.state.errorCourse &&
                      <>
                        <br/>
                        <Alert key="seatsError" variant="danger">
                          Invalid course.
                        </Alert>
                      </>}
                  </Modal.Footer>
                </Modal>

                <Modal show={this.state.isUploading} animation={false} scrollable={true} backdrop={'static'}>
                  <Modal.Header>
                    <Modal.Title>Upload file</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form method="POST" action="" id="newClassFormFile" onSubmit={(ev) => {
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
                                  reader.readAsText(file, 'ISO-8859-1')
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

            {context.user && (!this.props.courses || !this.props.studentsInfos || !this.props.enrollmentInfos) &&
              <NoItemsImage/>
            }
            {!context.user && <Redirect to="/login"/>}
          </>
        )}
      </AuthContext.Consumer>
    );
  }
}

function ListHeader() {
  return(
    <ListGroup.Item id = {"classesList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-6">
              <h4>Course</h4>
          </div>
          <div className="col-sm-6">
              <h4>Student</h4>
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

export default configureClassesPage;
