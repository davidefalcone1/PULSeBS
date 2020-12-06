import React from 'react';
import ConfigureLessonsItem from './ConfigureLessonsItem';
import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../_services/AuthContext';

const configureLessonsPage = (props) => {
  console.log(props);
  return(
    <ConfigureLessons lessonsList = {props.lessonsList} coursesList = {props.coursesList}
      classesList = {props.classesList} createNewLesson={props.createNewLesson}
      editLesson={props.editLesson} uploadFileLessons={props.uploadFileLessons}/>
  );
}

class ConfigureLessons extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      isCreating: false, isEditing: false, file: undefined, isUploading: false, errorFile: false,
      scheduleId: '', courseId: 'Select course', lessonStatus: 'Select status', lessonType: 'Select type',
        startDate: '', endDate: '', classroom: 'Select classroom',
      errorCourseId: false, errorLessonStatus: false, errorLessonType: false,
        errorStartDate: false, errorEndDate: false, errorClassroom: false
    }
  }

  activateCreateModal = () => {
    this.setState({isCreating: true, 
      scheduleId: '', courseId: 'Select course', lessonStatus: 'Select status',
      lessonType: 'Select type', startDate: '', endDate: '', classroom: 'Select classroom',
    });
  }
  activateEditModal = (lesson) => {
    this.setState({isEditing: true,
      scheduleId: lesson.scheduleId, courseId: lesson.courseId, lessonStatus: lesson.isLessonCancelled,
      lessonType: lesson.isLessonRemote, startDate: lesson.startDate,
      endDate: lesson.endDate, classroom: lesson.classroom
    });
  }
  activateUploadFileModal = () => {
    this.setState({isUploading: true})
  }

  updateField = (name, value) => {
    this.setState({[name]: value}, () => {
      if(name === 'startDate' && moment(this.state.startDate).isAfter(moment(this.state.endDate))){
        this.setState({endDate: ''}, () => {})
      }
      if(this.state.courseId !== 'Select course'){
        this.setState({errorCourseId: false});
      }
      if(this.state.lessonStatus !== 'Select status'){
          this.setState({errorLessonStatus: false});
      }
      if(this.state.lessonType !== 'Select type'){
          this.setState({errorLessonType: false});
      }
      if(this.state.startDate !== ''){
          this.setState({errorStartDate: false});
      }
      if(this.state.endDate !== ''){
          this.setState({errorEndDate: false});
      }
      if(this.state.classroom !== 'Select classroom'){
          this.setState({errorClassroom: false});
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
    else if(this.state.courseId === 'Select course'){
      this.setState({errorCourseId: true});
    }
    else if(this.state.lessonStatus === 'Select status'){
        this.setState({errorLessonStatus: true});
    }
    else if(this.state.lessonType === 'Select type'){
        this.setState({errorLessonType: true});
    }
    else if(this.state.startDate === ''){
        this.setState({errorStartDate: true});
    }
    else if(this.state.endDate === ''){
        this.setState({errorEndDate: true});
    }
    else if(this.state.classroom === 'Select classroom'){
        this.setState({errorClassroom: true});
    }
    else {
      if(this.state.isCreating)
        this.props.createNewLesson(this.state.courseId, this.state.errorLessonStatus,
          this.state.lessonType, this.state.startDate, this.state.endDate, this.state.classroom);
      else if(this.state.isEditing)
        this.props.editLesson(this.state.scheduleId, this.state.courseId, this.state.errorLessonStatus,
          this.state.lessonType, this.state.startDate, this.state.endDate, this.state.classroom);
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
        this.props.uploadFileLessons(this.state.file)
    }
  }

  render(){
    return(
      <AuthContext.Consumer>
        {(context) => (
          <>        
            {context.user && this.props.coursesList && 
              <>
                <br/>
                <Row className="justify-content-around">
                    <Button variant="primary" onClick={(event) => {
                          event.preventDefault();
                          this.activateCreateModal();
                      }} id={"activateModalOfLessons"}>
                          Add New
                    </Button>
                    <Button variant="primary" onClick={(event) => {
                          event.preventDefault();
                          this.activateUploadFileModal();
                      }} id={"uploadFileOfLessons"}>
                          Upload File
                    </Button>
                </Row>
                <ListGroup as="ul" variant="flush">
                  <ListHeader />
                  {this.props.lessonsList.map((lesson) => 
                    <ConfigureLessonsItem key = {lesson.scheduleId} lesson = {lesson} 
                      courses = {this.props.coursesList} editLesson={this.activateEditModal}/>)
                  }
                </ListGroup>

                <Modal show={this.state.isCreating || this.state.isEditing} animation={false} scrollable={true}>
                  <Modal.Header>
                    <Modal.Title>{this.state.isCreating ? 'Create new lesson' : 'Edit lesson'}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form method="POST" action="" id="newCourseForm" onSubmit={(ev) => {
                      ev.preventDefault();
                      this.handleSubmit();
                    }} ref={(form) => this.form = form}>
                      <Form.Group>
                        <Form.Label className="control-label">Course</Form.Label>
                        <Form.Control as="select" custom name="courseId" value = {this.state.courseId} 
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                          <option>Select course</option>
                          {this.props.coursesList.map((course) =>
                            <option value={course.courseId}>{course.courseName}</option>
                          )}
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="control-label">Select Status</Form.Label>
                        <Form.Control as="select" custom name="lessonStatus" value = {this.state.lessonStatus} 
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                          <option>Select status</option>
                          <option value={true}>Active</option>
                          <option value={false}>Cancelled</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="control-label">Select Type</Form.Label>
                        <Form.Control as="select" custom name="lessonType" value = {this.state.lessonType} 
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                          <option>Select type</option>
                          <option value={1}>In Presence</option>
                          <option value={0}>Remote</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="control-label">Starting Date and Time</Form.Label>
                        <Form.Control type="datetime-local" name="startDate"
                          value = {this.state.startDate} min={moment().format("YYYY-MM-DD hh:mm")}
                          onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="control-label">Ending Date and Time</Form.Label>
                        <Form.Control type="datetime-local" name="endDate"
                          value = {this.state.endDate} min={moment(this.state.startingDay).format("YYYY-MM-DD hh:mm")}
                          onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="control-label">Classroom</Form.Label>
                        <Form.Control as="select" custom name="classroom" value = {this.state.classroom} 
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                          <option>Select classroom</option>
                          {this.props.classesList.map((c) =>
                            <option value={c.classId}>{c.classroomName}</option>
                          )}
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <div>
                          <button type="submit" className="btn btn-primary">
                            {this.state.isCreating ? 'Create' : 'Edit'}
                          </button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" type="button" 
                      onClick={(event) => {
                        event.preventDefault();
                        this.setState({isCreating: false, isEditing: false});
                      }}>Close</Button>
                      {this.state.errorCourseId &&
                        <>
                          <br/>
                          <Alert key="courseIdError" variant="danger">
                            Invalid course.
                          </Alert>
                        </>}
                      {this.state.errorLessonStatus &&
                        <>
                          <br/>
                          <Alert key="statusError" variant="danger">
                            Invalid status.
                          </Alert>
                        </>}
                      {this.state.errorLessonType &&
                        <>
                          <br/>
                          <Alert key="typeError" variant="danger">
                            Invalid type.
                          </Alert>
                        </>}
                      {this.state.errorStartDate &&
                        <>
                          <br/>
                          <Alert key="sdError" variant="danger">
                            Invalid starting date and time.
                          </Alert>
                        </>}
                      {this.state.errorEndDate &&
                        <>
                          <br/>
                          <Alert key="edError" variant="danger">
                            Invalid ending date and time.
                          </Alert>
                        </>}
                      {this.state.errorClassroom &&
                        <>
                          <br/>
                          <Alert key="crError" variant="danger">
                            Invalid classroom.
                          </Alert>
                        </>}
                  </Modal.Footer>
                </Modal>
              
                <Modal show={this.state.isUploading} animation={false} scrollable={true}>
                  <Modal.Header>
                    <Modal.Title>Upload file</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form method="POST" action="" id="newLessonFormFile" onSubmit={(ev) => {
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
                              console.log(content)
                              this.updateField("file", content)
                            }).catch(error => console.log(error))
                          }}/>
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
            {context.user && !this.props.coursesList &&
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
    <ListGroup.Item id = {"lessonsList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-3">
              <h4>Course Name</h4>
          </div>
          <div className="col-sm-2">
              <h4>Start Date</h4>
          </div>
          <div className="col-sm-2">
              <h4>End Date</h4>
          </div>
          <div className="col-sm-2">
              <h4>Max Available Seats</h4>
          </div>
          <div className="col-sm-2">
              <h4>Classroom</h4>
          </div>
          <div className="col-sm-1">
              <h4>{' '}</h4>
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

export default configureLessonsPage;
