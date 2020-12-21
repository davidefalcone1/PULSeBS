import React from 'react';
import MyCourseLessonsStudentItem from './MyCoursesLessonsStudentItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/esm/Col';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../_services/AuthContext';

const myCoursesLessonsStudentsPage = (props) => {
  return (
    <MyCoursesLessonsPageRender teacherCourses={props.teacherCourses}
      myTeachedCoursesLessons={props.myTeachedCoursesLessons}
      studentsBookedToMyLessons={props.studentsBookedToMyLessons}
      myBookedStudentsInfos={props.myBookedStudentsInfos}
      cancelLesson={props.cancelLesson}
      changeLessonToRemote={props.changeLessonToRemote}
      setStudentAsPresent={props.setStudentAsPresent}
      setStudentAsNotPresent={props.setStudentAsNotPresent}/>
  );
}

class MyCoursesLessonsPageRender extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      startingDay: undefined, endingDay: undefined, 
      modalMessage: "", showModal: false
    }
  }

  activateModal = (message)  => {
    this.setState({showModal: true, modalMessage: message});
  }

  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <>
            {context.user &&
              <>        
                {this.props.teacherCourses && this.props.myTeachedCoursesLessons &&
                <div style={{padding: "15px"}}>
                  <Accordion>
                    {this.props.teacherCourses.map((teacherCourse) => //per ogni mio corso
                      <Card key={teacherCourse.courseId}>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey = {"course-" + teacherCourse.courseName}>
                              <CourseHeader course = {teacherCourse.courseName}/>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={"course-" + teacherCourse.courseName}>
                          <Card.Body>
                            <Accordion>
                              <CourseHeaderStatics normalBookingsAvgWeek = {teacherCourse.normalBookingsAvgWeek} cancelledBookingsAvgWeek = {teacherCourse.cancelledBookingsAvgWeek}
                                waitingBookingsAvgWeek = {teacherCourse.waitingBookingsAvgWeek} normalBookingsAvgMonth = {teacherCourse.normalBookingsAvgMonth} 
                                cancelledBookingsAvgMonth = {teacherCourse.cancelledBookingsAvgMonth} waitingBookingsAvgMonth = {teacherCourse.waitingBookingsAvgMonth}/>
                              {this.props.myTeachedCoursesLessons.map((courseLesson) => //per ogni lezione del mio corso
                                (courseLesson.courseId === teacherCourse.courseId) &&
                                  <Card key={courseLesson.courseId}>
                                    <Card.Header>
                                      <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
                                        <Accordion.Toggle as={Button} variant="link" eventKey={teacherCourse.courseName + "-" + courseLesson.scheduleId}>
                                          <LessonHeader id = {courseLesson.scheduleId} startDate = {courseLesson.startDate} endDate = {courseLesson.endDate}
                                            isLessonRemote={courseLesson.isLessonRemote} isLessonCancelled={courseLesson.isLessonCancelled}/>
                                        </Accordion.Toggle>
                                        <LessonsHeaderButtons id = {courseLesson.scheduleId} startDate = {courseLesson.startDate} endDate = {courseLesson.endDate}
                                            cancelLesson = {this.props.cancelLesson} changeLessonToRemote = {this.props.changeLessonToRemote} 
                                            isLessonRemote={courseLesson.isLessonRemote} isLessonCancelled={courseLesson.isLessonCancelled} activateModal = {this.activateModal}/>
                                      </div>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={teacherCourse.courseName + "-" + courseLesson.scheduleId}>
                                      <Card.Body>
                                        <LessonHeaderStatistics id = {courseLesson.scheduleId + "statistics"} lesson = {courseLesson}/>
                                        <StudentHeader/>
                                        <ListGroup as="ul" variant="flush">
                                          {this.props.studentsBookedToMyLessons.map((studentBooking) => //per ogni prenotazione alla lezione del mio corso
                                            (studentBooking.scheduleId === courseLesson.scheduleId) &&
                                            <ListGroup.Item key = {studentBooking.studentId} id = {teacherCourse.courseName + "-" + courseLesson.scheduleId + "-" + studentBooking.studentId}>
                                              {this.props.myBookedStudentsInfos.map((student) => //trova e mostra i dati dello studente
                                              (studentBooking.studentId === student.personId) &&
                                                <MyCourseLessonsStudentItem key = {student.personId} student = {student} booking = {studentBooking}
                                                  setStudentAsPresent = {this.props.setStudentAsPresent} setStudentAsNotPresent = {this.props.setStudentAsNotPresent}/> 
                                              )}
                                            </ListGroup.Item>  
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
                    )}
                  </Accordion>
                </div>
                }
        
                {!this.props.teacherCourses && !this.props.myTeachedCoursesLessons &&
                  <NoItemsImage/>
                }
        
                {this.state.showModal &&
                  <Modal show={this.state.showModal} animation={false} backdrop={'static'}>
                    <Modal.Header>
                      <Modal.Title>Operation response</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="row-md-6">
                        {this.state.modalMessage}
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" type="button" 
                        onClick={(event) => {
                          event.preventDefault();
                          this.setState({showModal: false, modalMessage: ""});
                        }}>Close</Button>
                    </Modal.Footer>
                  </Modal>
                }
              </>
            }
            {!context.user && <Redirect to="/login"/>}
          </>
        )}
      </AuthContext.Consumer>
    )
  }
}

function CourseHeader(props) {
  return (
    <div className="d-flex w-100 pt-3 justify-content-between no-gutters" id={"course-" + props.course}>
      <h4>{props.course}</h4>
    </div>
  );
}
function CourseHeaderStatics(props) {
  return (
    <div id={props.id}>
      <Row>
        <Col>
          <h5>Statistics per week</h5>
          <h6>
            {props.normalBookingsAvgWeek + props.cancelledBookingsAvgWeek + props.waitingBookingsAvgWeek} total bookings, {' '}
            {props.normalBookingsAvgWeek} actual bookings, {' '}
            {props.cancelledBookingsAvgWeek} cancelled bookings, {' '}
            {props.waitingBookingsAvgWeek} waiting bookings{' '}
          </h6>
        </Col>
        <Col>
          <h5>Statistics per month</h5>
          <h6>
            {props.normalBookingsAvgMonth + props.cancelledBookingsAvgMonth + props.waitingBookingsAvgMonth} total bookings, {' '}
            {props.normalBookingsAvgMonth} actual bookings, {' '}
            {props.cancelledBookingsAvgMonth} cancelled bookings, 
            {props.waitingBookingsAvgMonth} waiting bookings
          </h6>
        </Col>
      </Row>
      <br/>
    </div>
  );
}
function LessonHeader(props) {
  return (
    <>
      <div id={"lesson-" + props.startDate + "----" + props.endDate}>
        <h6>
          Lesson of {props.startDate.format("ddd DD-MM-YYYY HH:mm").toString()} -- {props.endDate.format("ddd DD-MM-YYYY HH:mm").toString()}
          {' '}
          {props.isLessonRemote && !props.isLessonCancelled && <Badge pill variant="warning">Remote</Badge>}
          {props.isLessonCancelled && <Badge pill variant="secondary">Cancelled</Badge>}
          {' '}
        </h6>
      </div>
    </>
  );
}
function LessonHeaderStatistics(props){
  return (
    <>
      <h6>
          {props.lesson.normalBookings + props.lesson.cancelledBookings 
            + props.lesson.waitingBookings + props.lesson.attendanceCount} total bookings, {' '}
          {props.lesson.normalBookings} actual bookings, {' '}
          {props.lesson.cancelledBookings} cancelled bookings, {' '}
          {props.lesson.waitingBookings} waiting bookings, {' '}
          {props.lesson.attendanceCount} attendances
      </h6>
      <br/>
    </>
  );
}
function LessonsHeaderButtons(props) {
  return (
    <>
      <div id={props.id + "buttons"}>
        {(moment().isBefore(moment(props.startDate).subtract(30, 'm'))) && !props.isLessonRemote && !props.isLessonCancelled &&
          <Button variant="warning" onClick={(event) => {
            event.preventDefault();
            if(moment().isBefore(moment(props.startDate).subtract(30, 'm'))){
              props.changeLessonToRemote(props.id).then(() =>{
                props.activateModal("Operation completed successfully. Your lesson is now remote!");
              })
              .catch((errorObj) => { 
                props.activateModal("Something went wrong: " + errorObj);
              });
            }
            else{
              props.activateModal("Sorry, your time to make this lesson remote is over.");
            }
          }} id={"makeRemoteFieldOfLesson" + props.id}>
            Make Remote
          </Button>
        }
        <span>   </span>
        {(moment().isBefore(moment(props.startDate).subtract(1, 'h'))) && !props.isLessonCancelled &&
          <Button variant="danger" onClick={(event) => {
            event.preventDefault();
            if(moment().isBefore(moment(props.startDate).subtract(1, 'h'))){
              props.cancelLesson(props.id).then(() =>{
                props.activateModal("Operation completed successfully. Your lesson is now cancelled!");
              })
              .catch((errorObj) => { 
                props.activateModal("Something went wrong: " + errorObj);
              });
            }
            else{
              props.activateModal("Sorry, your time to cancel this lesson is over.");
            }
          }} id={"cancelFieldOfLesson" + props.id}>
            CANCEL
          </Button>
        }
      </div>
    </>
  );
}

function StudentHeader(props) {
  return (
    <ListGroup.Item id={"ticketList-header"}>
      <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
        <div className="col-sm-2">
          <h6>Person Id</h6>
        </div>
        <div className="col-sm-5">
          <h6>Full Name</h6>
        </div>
        <div className="col-sm-5">
          <h6>E-mail</h6>
        </div>
      </div>
    </ListGroup.Item>
  );
}

function NoItemsImage(props) {
  return (
    <div className="col-sm-12 pt-3">
      <img width="800" height="600" className="img-button" src='./images/no_data_image.png' alt="" />
    </div>
  );
}

export default myCoursesLessonsStudentsPage;
