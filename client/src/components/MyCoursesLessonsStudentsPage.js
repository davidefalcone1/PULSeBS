import React from 'react';
import MyCourseLessonsStudentItem from './MyCoursesLessonsStudentItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import moment from 'moment'

const myCoursesLessons = (props) => {
  return (
    <MyCoursesLessonsPageRender teacherCourses={props.teacherCourses}
      myTeachedCoursesLessons={props.myTeachedCoursesLessons}
      studentsBookedToMyLessons={props.studentsBookedToMyLessons}
      myBookedStudentsInfos={props.myBookedStudentsInfos}
      cancelLesson={props.cancelLesson}
      changeLessonToRemote={props.changeLessonToRemote} />
  );
}

class MyCoursesLessonsPageRender extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      startingDay: undefined, endingDay: undefined
    }
  }

  render() {
    return (
      <>
        {this.props.teacherCourses && this.props.myTeachedCoursesLessons &&
          <div style={{ padding: "15px" }}>
            <Accordion>
              {this.props.teacherCourses.map((teacherCourse) => //per ogni mio corso
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey={"course-" + teacherCourse.courseName}>
                      <CourseHeader course={teacherCourse.courseName} />
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey={"course-" + teacherCourse.courseName}>
                    <Card.Body>
                      <Accordion>
                        {this.props.myTeachedCoursesLessons.map((courseLesson) => //per ogni lezione del mio corso
                          (courseLesson.courseId === teacherCourse.courseId) &&
                          <Card>
                            <Card.Header>
                              <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
                                <Accordion.Toggle as={Button} variant="link" eventKey={teacherCourse.courseName + "-" + courseLesson.scheduleId}>
                                  <LessonHeader id={courseLesson.scheduleId} startingTime={courseLesson.startingTime} endingTime={courseLesson.endingTime}
                                    cancelLesson={this.props.cancelLesson} changeLessonToRemote={this.props.changeLessonToRemote} />
                                </Accordion.Toggle>
                                <LessonsHeaderButtons id={courseLesson.scheduleId} startingTime={courseLesson.startingTime} endingTime={courseLesson.endingTime}
                                  cancelLesson={this.props.cancelLesson} changeLessonToRemote={this.props.changeLessonToRemote}
                                  isLessonRemote={courseLesson.isLessonRemote}
                                  isLessonCancelled={courseLesson.isLessonCancelled} />
                              </div>
                            </Card.Header>
                            <Accordion.Collapse eventKey={teacherCourse.courseName + "-" + courseLesson.scheduleId}>
                              <Card.Body>
                                <StudentHeader />
                                <ListGroup as="ul" variant="flush">
                                  {this.props.studentsBookedToMyLessons.map((studentBooking) => //per ogni prenotazione alla lezione del mio corso
                                    (studentBooking.scheduleId === courseLesson.scheduleId) &&
                                    <ListGroup.Item key={studentBooking.studentId} id={teacherCourse.courseName + "-" + courseLesson.scheduleId + "-" + studentBooking.studentId}>
                                      {this.props.myBookedStudentsInfos.map((student) => //trova e mostra i dati dello studente
                                        (studentBooking.studentId === student.personId) &&
                                        <MyCourseLessonsStudentItem key={student.personId} student={student} />
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
          <NoItemsImage />
        }
      </>
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
function LessonHeader(props) {
  return (
    <>
      <div id={"lesson-" + props.startingTime + "----" + props.endingTime}>
        <h6>Lezione del {props.startingTime.format("ddd DD-MM-YYYY HH:mm").toString()} -- {props.endingTime.format("ddd DD-MM-YYYY HH:mm").toString()}</h6>
      </div>
    </>
  );
}
function LessonsHeaderButtons(props) {
  return (
    <>
      <div id={"lesson-" + props.startingTime + "----" + props.endingTime}>
        {(moment().isBefore(moment(props.startingTime).subtract(30, 'm'))) && props.isLessonRemote &&
          <Button variant="warning" onClick={(event) => {
            event.preventDefault();
            props.changeLessonToRemote(props.id);
          }} id={"makeRemoteFieldOfLesson" + props.id}>
            Make Remote
          </Button>
        }
        <span>   </span>
        {(moment().isBefore(moment(props.startingTime).subtract(1, 'h'))) && props.isLessonCancelled &&
          <Button variant="danger" onClick={(event) => {
            event.preventDefault();
            props.cancelLesson(props.id);
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

export default myCoursesLessons;
