import React from 'react';
import ConfigureCourseScheduleItem from './ConfigureCourseScheduleItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import moment from 'moment';
import { AuthContext } from '../_services/AuthContext';
import { Redirect } from 'react-router-dom';

const configureCoursePage = (props) => {
  return(
    <ConfigureCourses coursesList={props.coursesList} basicSchedules={props.basicSchedules}
      teachersList={props.teachersList} editCourseSchedule={props.editCourseSchedule}
      createNewCourseSchedule={props.createNewCourseSchedule} deleteCourseSchedule={props.deleteCourseSchedule}
      createNewCourse={props.createNewCourse} uploadFileCourses={props.uploadFileCourses}
      classroomssList={props.classroomssList}/>
  );
}

class ConfigureCourses extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      file: undefined, isUploading: false, errorFile: false,
      isCreating: false, courseName: '', teacherId: 'Select teacher', 
      errorName: false, errorTeacher: false,
      isCreatingSchedule: false, isEditingSchedule: false, scheduleId: '', scheduleClassroom: 'Select classroom',
      scheduleCourseId: '', scheduleDay: 'Select day', scheduleStartTime: '', scheduleEndTime: '',
      errorScheduleDay: false, errorScheduleStartTime: false, errorScheduleEndTime: false,
      errorScheduleClassroom: false, errorScheduleCourseId: false
    }
  }

  activateModal = () => {
    this.setState({isCreating: true, courseName: '', teacherId: 'Select teacher'});
  }
  activateUploadFileModal = () => {
    this.setState({isUploading: true})
  }
  activateNewScheduleModal = (courseID) => {
    this.setState({isCreatingSchedule: true, scheduleCourseId: courseID, scheduleDay: 'Select day', 
      scheduleStartTime: '', scheduleEndTime: '', scheduleClassroom: 'Select classroom', 
      scheduleId: ''});
  }
  activateEditScheduleModal = (schedule) => {
    this.setState({isEditingSchedule: true, scheduleDay: schedule.day, scheduleEndTime: schedule.endTime,
      scheduleCourseId: schedule.courseId, scheduleStartTime: schedule.startTime,
      scheduleClassroom: schedule.classroom, scheduleId: schedule.id});
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
      if(this.state.scheduleClassroom !== 'Select classroom'){
          this.setState({errorScheduleClassroom: false});
      }
      if(this.state.scheduleDay !== 'Select day'){
          this.setState({errorScheduleDay: false});
      }
      if(this.state.scheduleStartTime !== ''){
          this.setState({errorScheduleStartTime: false});
      }
      if(this.state.scheduleEndTime !== ''){
          this.setState({errorScheduleEndTime: false});
      }
      if(name === "scheduleEndTime" && this.state.scheduleEndTime !== '' &&
        moment(this.state.scheduleStartTime, "HH:mm").isAfter(moment(this.state.scheduleEndTime, "HH:mm"))){
          alert("The scheduled end time cannot be before the scheduled start time.")
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
        this.props.uploadFileCourses(this.state.file)
        this.setState({isUploading: false})
    }
  }
  handleSubmitSchedule = () => {
    if (!this.scheduleform.checkValidity()) {
      this.form.reportValidity();
    }
    else if(this.state.scheduleClassroom === 'Select classroom'){
        this.setState({errorScheduleClassroom: true});
    }
    else if(this.state.scheduleDay === 'Select day'){
        this.setState({errorScheduleDay: true});
    }
    else if(this.state.scheduleStartTime === ''){
        this.setState({errorScheduleStartTime: true});
    }
    else if(this.state.scheduleEndTime === ''){
        this.setState({errorScheduleEndTime: true});
    }
    else {
      if(this.state.isCreatingSchedule){
        this.props.createNewCourseSchedule(this.state.scheduleCourseId, this.state.scheduleDay,
          this.state.scheduleStartTime, this.state.scheduleEndTime, this.state.scheduleClassroom)
        this.setState({isCreatingSchedule: false});
      }
      else if(this.state.isEditingSchedule){
        this.props.editCourseSchedule(this.state.scheduleId, this.state.scheduleCourseId, this.state.scheduleDay,
          this.state.scheduleStartTime, this.state.scheduleEndTime, this.state.scheduleClassroom)
        this.setState({isEditingSchedule: false});
      }
    }
  }

  render(){
    return(
      <AuthContext.Consumer>
        {(context) => (
          <>        
            {context.user && this.props.coursesList && this.props.teachersList && this.props.basicSchedules &&
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
                <br/>
                <div style={{padding: "15px"}}>
                  <Accordion>
                    {this.props.coursesList.map((course) => //per ogni mio corso
                      <Card key={course.courseId} style={{width: '100%'}}>
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" style={{width: '100%'}}
                            eventKey = {"course-" + course.courseName} >
                            <ConfigureCourseHeader id = {course.courseId} course = {course} 
                              teachers = {this.props.teachersList}/>
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={"course-" + course.courseName}>
                          <Card.Body>
                          <ListGroup as="ul" variant="flush">
                            <ListScheduleHeader id = {course.courseId} action = {this.activateNewScheduleModal}/>
                            {this.props.basicSchedules.map((schedule) => 
                              (course.courseId === schedule.courseId) &&
                              <ConfigureCourseScheduleItem key = {schedule.id + "-" + schedule.courseId}
                                schedule = {schedule} editCourseSchedule={this.activateEditScheduleModal}
                                deleteCourseSchedule = {this.props.deleteCourseSchedule}/>
                            )}
                          </ListGroup>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    )}
                  </Accordion>  

                  <Modal show={this.state.isCreating} animation={false} scrollable={true} backdrop={'static'}>
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
                            value = {this.state.courseName} required autoFocus
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label className="control-label">Teacher</Form.Label>
                          <Form.Control as="select" custom name="teacherId" value = {this.state.teacherId} 
                              onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                            <option>Select teacher</option>
                            {this.props.teachersList.map((teacher) =>
                              <option key={teacher.personId} value={teacher.personId}>{teacher.fullName}</option>
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
                  <Modal show={this.state.isCreatingSchedule || this.state.isEditingSchedule} animation={false} scrollable={true} backdrop={'static'}>
                    <Modal.Header>
                      <Modal.Title>{this.state.isCreatingSchedule ? "Create new schedule" : "Edit schedule"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form method="POST" action="" id="newCourseForm" onSubmit={(ev) => {
                        ev.preventDefault();
                        this.handleSubmitSchedule();
                      }} ref={(form) => this.scheduleform = form}>
                        <Form.Group>
                          <Form.Label className="control-label">Schedule day</Form.Label>
                          <Form.Control as="select" custom name="scheduleDay" value = {this.state.scheduleDay} 
                              onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                            <option>Select day</option>
                            <option value="Mon">Monday</option>
                            <option value="Tue">Tuesday</option>
                            <option value="Wed">Wednesday</option>
                            <option value="Thu">Thursday</option>
                            <option value="Fri">Friday</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label className="control-label">Starting Time</Form.Label>
                          <Form.Control type="time" name="scheduleStartTime"
                            value = {this.state.scheduleStartTime}
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label className="control-label">Ending Time</Form.Label>
                          <Form.Control type="time" name="scheduleEndTime"
                            value = {this.state.scheduleEndTime} min={moment(this.state.scheduleStartTime, "HH:mm")}
                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label className="control-label">Classroom - Seats</Form.Label>
                          <Form.Control as="select" custom name="scheduleClassroom" value = {this.state.classroom} 
                              defaultValue = {this.state.scheduleClassroom}
                              onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                            <option>Select classroom</option>
                            {this.props.classroomssList.map((c) =>
                              <option value={c.classroomName} key={c.classroomName}>{c.classroomName + ' - ' + c.maxSeats}</option>
                            )}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group>
                          <div>
                            <button type="submit" className="btn btn-primary">{this.state.isCreatingSchedule ? "Create" : "Edit"}</button>
                          </div>
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" type="button" 
                        onClick={(event) => {
                          event.preventDefault();
                          this.setState({isCreatingSchedule: false, isEditingSchedule: false});
                        }}>Close</Button>
                        {this.state.errorScheduleCourseId &&
                          <>
                            <br/>
                            <Alert key="courseError" variant="danger">
                              Invalid course.
                            </Alert>
                          </>}
                        {this.state.errorScheduleDay &&
                          <>
                            <br/>
                            <Alert key="dayError" variant="danger">
                              Invalid day.
                            </Alert>
                          </>}
                        {this.state.errorScheduleStartTime &&
                          <>
                            <br/>
                            <Alert key="stError" variant="danger">
                              Invalid starting time.
                            </Alert>
                          </>}
                        {this.state.errorScheduleEndTime &&
                          <>
                            <br/>
                            <Alert key="etError" variant="danger">
                              Invalid ending time.
                            </Alert>
                          </>}
                        {this.state.errorScheduleClassroom &&
                          <>
                            <br/>
                            <Alert key="crError" variant="danger">
                              Invalid classroom.
                            </Alert>
                          </>}
                    </Modal.Footer>
                  </Modal>
                  
                  <Modal show={this.state.isUploading} animation={false} scrollable={true} backdrop={'static'}>
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
                </div>
              </>
            }

            {context.user && (!this.props.coursesList || !this.props.teachersList || !this.props.basicSchedules) && 
              <NoItemsImage/>
            }
            {!context.user && <Redirect to="/login"/>}
          </>
        )}
      </AuthContext.Consumer>
    );
  }  
}

function ListScheduleHeader(props) {
  return(
    <ListGroup.Item id = {"coursesList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-3">
            <h5>Day</h5>
          </div>
          <div className="col-sm-2">
            <h5>Start time</h5>
          </div>
          <div className="col-sm-2">
            <h5>End time</h5>
          </div>
          <div className="col-sm-2">
            <h5>Classroom</h5>
          </div>
          <div className="col-sm-3">
            <Button variant="primary" onClick={(event) => {
                event.preventDefault();
                props.action(props.id);
            }} id={"buttonFieldOflesson" + props.id}>
                Create New Schedule
            </Button>
          </div>
        </div>
    </ListGroup.Item>
  );
}
function ConfigureCourseHeader(props){
  return(
    <>
      <Row id={"courseHeader" + props.id}>
        <Col className="text-left">
          <h4 id={"nameOfcourse_" + props.id} style={{display:"inline"}} className="col-sm-6">
            {props.course.courseName}
          </h4>
        </Col>
        <Col className="text-left">
          {props.teachers.map((t) => //per ogni lezione del mio corso
            (t.personId === props.course.teacherId) &&
              <h4 key={"teacherOfcourse_" + t.personId + "-" + props.id} className="col-sm-6"
                id={"teacherOfcourse_" + t.personId + "-" + props.id} style={{display:"inline"}}>
                {'  ' + t.fullName}
              </h4>
          )}
        </Col>
      </Row>
    </>
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
