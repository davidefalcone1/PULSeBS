import React from 'react';
import MyCourseLessonsStudentItem from './MyCoursesLessonsStudentItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'

const myCoursesLessons = (props) => {
  return(
    <MyCoursesLessonsPageRender teacherCourses = {props.teacherCourses}
      myTeachedCoursesLessons = {props.myTeachedCoursesLessons}
      studentsBookedToMyLessons = {props.studentsBookedToMyLessons}
      myBookedStudentsInfos = {props.myBookedStudentsInfos}/>
  );
}

class MyCoursesLessonsPageRender extends React.Component {

  constructor(props) {
      super(props);
      this.props = props;
  }

  render(){
    return(
      <>        
        {this.props.teacherCourses && this.props.myTeachedCoursesLessons &&
          <ListGroup as="ul" variant="flush">
            {this.props.teacherCourses.map((teacherCourse) => //per ogni mio corso
              <ListGroup.Item key = {teacherCourse.courseId} id = {"teacherCourse-" + teacherCourse.courseId}>
                <Accordion>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey = {"course-" + teacherCourse.courseName}>
                        <CourseHeader course = {"course-" + teacherCourse.courseName}/>
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={teacherCourse.teacherCourse.courseName}>
                      <Card.Body>
                        <ListGroup as="ul" variant="flush">
                          {this.props.myTeachedCoursesLessons.map((courseLesson) => //per ogni lezione del mio corso
                            (courseLesson.courseId === teacherCourse.courseId) &&
                            <Accordion>
                              <Card>
                                <Card.Header>
                                  <Accordion.Toggle as={Button} variant="link" eventKey={teacherCourse.courseName + "-" + courseLesson.scheduleId}>
                                    <LessonHeader startingTime = {courseLesson.startingTime} endingTime = {courseLesson.endingTime}/>
                                  </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse>
                                  <Card.Body>
                                    <StudentHeader/>
                                    <ListGroup as="ul" variant="flush">
                                      {this.props.studentsBookedToMyLessons.map((studentBooking) => //per ogni prenotazione alla lezione del mio corso
                                        (studentBooking.scheduleId === courseLesson.scheduleId) &&
                                        this.props.myBookedStudentsInfos.map((student) => //trova e mostra i dati dello studente
                                          (studentBooking.studentId === student.personId) &&
                                            <MyCourseLessonsStudentItem key = {student.personId} student = {student}/> 
                                          )    
                                        )
                                      }
                                    </ListGroup>
                                  </Card.Body>
                                </Accordion.Collapse>
                              </Card>
                            </Accordion>
                            )
                          }
                        </ListGroup>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </ListGroup.Item>)}
          </ListGroup>
        }

        {!this.props.tickets && !this.props.differentCounterIds &&
          <NoItemsImage/>
        }
      </>
    )
  }
}

function CourseHeader(props) {
  return(
    <ListGroup.Item id = {"counter-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-8">
            <h4>{props.course}</h4>
          </div>
        </div>
    </ListGroup.Item>
  );
}
function LessonHeader(props) {
  return(
    <ListGroup.Item id = {"counter-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-8">
          <h6>{props.startingTime} -- {props.endingTime}</h6>
          </div>
        </div>
    </ListGroup.Item>
  );
}

function StudentHeader(props) {  
  return(
    <ListGroup.Item id = {"ticketList-header"}>
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

function NoItemsImage(props){
    return(
        <div className="col-sm-12 pt-3">
            <img width="800" height="600" className="img-button" src='./images/no_data_image.png' alt=""/>
        </div>
    );
}

export default myCoursesLessons;
