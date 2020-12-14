import React from 'react';
import LessonListItem from './MyBookedLessonsItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Scheduler from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../_services/AuthContext';

const myBookedLessonsPage = (props) => {
  return(
    <LessonListPageRender coursesList={props.courses}
        lessonsList={props.lessonsList}
        waitingBookings={props.waitingBookings}
        selectLessonFunction={props.selectLessonFunction}
        updateMyBookedLessonsList={props.updateMyBookedLessonsList}/>
  );
}

class LessonListPageRender extends React.Component {

  constructor(props) {
      super(props);
      this.props = props;
      this.state = {
        bookingMessage: undefined, bookingCompleted:false,
        startingDay: '', endingDay: '', courseName: 'Select course name',
        viewType: "list", lessonType: "booked"
      }
  }

  updateModalMessage = (msg) => {
    this.setState({bookingMessage: msg, bookingCompleted: true});
  }
  
  updateField = (name, value) => {
    this.setState({[name]: value}, () => {
      if(name === 'startingDay' && moment(this.state.startingDay).isAfter(moment(this.state.endingDay))){
        this.setState({endingDay: ''}, () => {})
      }
    });
  }
  resetFields = () => {
    this.setState({startingDay: '', endingDay: '', courseName: 'Select course name'}, () => {});
  }
  isLessonInDateBoundaries = (lessonStartingDay, lessonEndingDay) => {
    if(this.state.startingDay === '' && this.state.endingDay === ''){
      return true;
    }
    else if(this.state.startingDay !== '' 
      && moment(this.state.startingDay).isSameOrBefore(moment(lessonStartingDay)) 
      && this.state.endingDay === ''){
        return true;
      }
    else if(this.state.startingDay !== '' 
      && moment(this.state.startingDay).isSameOrBefore(moment(lessonStartingDay)) 
      && this.state.endingDay !== ''
      && moment(this.state.endingDay).isSameOrAfter(moment(lessonEndingDay)) ){
        return true;
    }
    else if(this.state.startingDay === '' 
      && this.state.endingDay !== ''
      && moment(this.state.endingDay).isSameOrAfter(moment(lessonEndingDay)) ){
        return true;
    }
    else{
      return false;
    }
  }
  isCourseSelected = (currentCourseName) => {
    if(this.state.courseName === 'Select course name'){
      return true;
    }
    else if (this.state.courseName === currentCourseName){
      return true;
    }
    else{
      return false;
    }
  }

  setViewType = (type) => {
    this.setState({viewType: type})
  }
  setLessonView = (type) => {
    this.setState({lessonType: type});
  }
  renderLessonContent = (model) => {
    return this.props.coursesList.map((course) => {
      return (this.isCourseSelected(course.courseName)) &&
      (course.courseId === model.appointmentData.courseId) &&
        <>
          <h4>{course.courseName}</h4>
          <h6># of Booked Seats: {model.appointmentData.occupiedSeats} / {model.appointmentData.availableSeats}</h6>
          <Button variant="danger" onClick={(event) => {
            event.preventDefault();
            this.props.selectLessonFunction(model.appointmentData.scheduleId);
          }} id={"deleteFieldCalOfLesson" + model.appointmentData.scheduleId}>
            DELETE
          </Button>
        </>
      });
  };

  render(){
    return(
      <AuthContext.Consumer>
        {(context) => (
          <>        
            {context.user && (this.props.lessonsList || this.props.waitingBookings )&& 
            <div style={{padding: "15px"}}>
              <Row>
                <Col>
                  <h5>Filter your lessons!</h5>
                </Col>
                <Col className="text-right" style={{marginRight: "15px"}}>
                  <img width="30" height="30" className="img-button" src='./images/list_icon.png' alt="" onClick={(e) => {
                    e.preventDefault();
                    this.setViewType("list");
                  }}/>
                  <span>   </span>
                  <img width="30" height="30" className="img-button" src='./images/calendar_icon.png' alt="" onClick={(e) => {
                    e.preventDefault();
                    this.setViewType("calendar");
                  }}/>
                </Col>
              </Row>
              <Form method="POST" action="" id="lessonFilterForm" onSubmit={(ev) => {
                        ev.preventDefault();
                }} ref={(form) => this.form = form}>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label className="control-label">Course Name</Form.Label>
                    <Form.Control as="select" custom name="courseName" value = {this.state.courseName} 
                        onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                      <option>Select course name</option>
                      {this.props.coursesList.map((course) =>
                        <option key={course.courseId}>{course.courseName}</option>
                      )}
                    </Form.Control>
                  </Form.Group>
                  {this.state.viewType === "list" &&
                    <>
                      <Form.Group as={Col}>
                        <Form.Label className="control-label">Starting Day</Form.Label>
                        <Form.Control type="date" name="startingDay"
                          value = {this.state.startingDay} min={moment().format("YYYY-MM-DD")}
                          onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                      </Form.Group>
                      <Form.Group as={Col}>
                        <Form.Label className="control-label">Ending day</Form.Label>
                        <Form.Control type="date" name="endingDay"
                          value = {this.state.endingDay} min={moment(this.state.startingDay).format("YYYY-MM-DD")}
                          onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                      </Form.Group>
                    </>
                  }
                </Form.Row>

                <Form.Group>
                  <div>
                    <button type="button" className="btn btn-secondary" onClick={() => this.resetFields()}>Reset Fields</button>
                  </div>
                </Form.Group>                  
              </Form>
                    
              <br/>
              {this.state.viewType === "list" &&
                <Accordion>
                  {this.props.lessonsList &&
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey = {"bookedLessons"}>
                          <div className="d-flex w-100 pt-3 justify-content-between no-gutters" id = {"bookedLessons"}>
                              <h3>Booked Lessons</h3>
                          </div>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey={"bookedLessons"}>
                        <Card.Body>
                          <Accordion>
                            {this.props.coursesList.map((course) => //per ogni mio corso
                              (this.isCourseSelected(course.courseName)) &&
                              <Card key={course.courseId}>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey = {"course-" + course.courseName}>
                                    <CourseHeader course = {course.courseName}/>
                                  </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey={"course-" + course.courseName}>
                                  <Card.Body>
                                    <ListGroup as="ul" variant="flush">
                                      <ListHeader />
                                      {this.props.lessonsList.map((lesson) => 
                                        (course.courseId === lesson.courseId) &&
                                        (this.isLessonInDateBoundaries(lesson.startDate, lesson.endDate)) &&
                                        <LessonListItem key = {lesson.scheduleId} lesson = {lesson}
                                          updateSelectionMessage = {this.updateSelectionMessage}
                                          updateLessonSelectedState = {this.updateLessonSelectedState}
                                          selectLessonFunction = {this.props.selectLessonFunction}/>
                                      )}
                                    </ListGroup>
                                  </Card.Body>
                                </Accordion.Collapse>
                              </Card>
                            )}
                          </Accordion>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  }
                  {this.props.waitingBookings && (console.log(this.props.waitingBookings) || true) && 
                    <Card>
                      <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey = {"pendingBookedLessons"}>
                          <div className="d-flex w-100 pt-3 justify-content-between no-gutters" id = {"pendingBookedLessons"}>
                              <h3>Pending Booked Lesson</h3>
                          </div>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey={"pendingBookedLessons"}>
                        <Card.Body>
                          <Accordion>
                            {this.props.coursesList.map((course) => //per ogni mio corso
                              (this.isCourseSelected(course.courseName)) &&
                              <Card>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey = {"course-" + course.courseName}>
                                    <CourseHeader course = {course.courseName}/>
                                  </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey={"course-" + course.courseName}>
                                  <Card.Body>
                                    <ListGroup as="ul" variant="flush">
                                      <ListHeader />
                                      {this.props.waitingBookings.map((lesson) => 
                                        (course.courseId === lesson.courseId) &&
                                        (this.isLessonInDateBoundaries(lesson.startDate, lesson.endDate)) &&
                                        <LessonListItem key = {lesson.scheduleId} lesson = {lesson}
                                          updateSelectionMessage = {this.updateSelectionMessage}
                                          updateLessonSelectedState = {this.updateLessonSelectedState}
                                          selectLessonFunction = {this.props.selectLessonFunction}/>
                                      )}
                                    </ListGroup>
                                  </Card.Body>
                                </Accordion.Collapse>
                              </Card>
                            )}
                          </Accordion>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  }
                </Accordion>
              }
              {this.state.viewType === "calendar" &&
                <>
                  <Row className="justify-content-around">
                    <Button variant="primary" onClick={(event) => {
                      event.preventDefault();
                      this.setLessonView("booked");
                    }} id={"bookedTypedOfLesson"}>
                      Booked Lessons
                    </Button>
                    <Button variant="primary" onClick={(event) => {
                      event.preventDefault();
                      this.setLessonView("pending");
                    }} id={"bookedTypedOfLesson"}>
                      Pending Booked Lessons
                    </Button>
                  </Row>
                  <br/>
                  {this.state.lessonType === "booked" &&
                    <Scheduler
                      dataSource={this.props.lessonsList}
                      defaultCurrentDate={moment()}
                      appointmentRender={this.renderLessonContent}
                      appointmentTooltipRender={this.renderLessonContent}
                      //onAppointmentClick={onLessonTooltipClickFunction}
                      onAppointmentDblClick={this.onLessonTooltipClickFunction}
                    />
                  }
                  {this.state.lessonType === "pending" &&
                    <Scheduler
                      dataSource={this.props.waitingBookings}
                      defaultCurrentDate={moment()}
                      appointmentRender={this.renderLessonContent}
                      appointmentTooltipRender={this.renderLessonContent}
                      //onAppointmentClick={onLessonTooltipClickFunction}
                      onAppointmentDblClick={this.onLessonTooltipClickFunction}
                    />
                  }
                </>
              }
              </div>
            }
            {context.user && this.props.lessonsList && this.state.bookingCompleted &&
              <Modal show={this.state.bookingCompleted} animation={false}>
                <Modal.Header>
                  <Modal.Title>Booking response</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="row-md-6">
                    {this.state.bookingMessage}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" type="button" 
                    onClick={(event) => {
                      event.preventDefault();
                      this.setState({bookingCompleted: false, bookingMessage: undefined});
                    }}>Close</Button>
                </Modal.Footer>
              </Modal>
            }
            {context.user && !this.props.lessonsList &&
              <NoItemsImage/>
            }
            {!context.user && <Redirect to="/login"/>}
          </>
        )}
      </AuthContext.Consumer>
    )
  }
}

function ListHeader() {
  return(
    <ListGroup.Item id = {"lessonList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-3">
              <h4>Starting Time</h4>
          </div>
          <div className="col-sm-3">
              <h4>Ending Time</h4>
          </div>
          <div className="col-sm-3">
              <h4># of Booked Seats</h4>
          </div>
          <div className="col-sm-3">
          </div>
        </div>
    </ListGroup.Item>
  );
}

function CourseHeader(props) {
  return(
    <div className="d-flex w-100 pt-3 justify-content-between no-gutters" id = {"course-" + props.course}>
        <h4>{props.course}</h4>
    </div>
  );
}
function NoItemsImage(props){
    return(
        <div className="col-sm-12 pt-3">
            <img width="800" height="600" className="img-button" src='./images/no_data_image.png' alt=""/>
        </div>
    );
}

export default myBookedLessonsPage;
