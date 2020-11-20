import React from 'react';
import LessonListItem from './LessonListItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../_services/AuthContext';

const lessonsList = (props) => {
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
        startingDay: '', endingDay: '', courseName: 'Select course name'
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

  render(){
    return(
      <AuthContext.Consumer>
        {(context) => (
          <>        
            {context.user && (this.props.lessonsList || this.props.waitingBookings )&& 
            <div style={{padding: "15px"}}>
              <h5>Filter your lessons!</h5>
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
                        <option>{course.courseName}</option>
                      )}
                    </Form.Control>
                  </Form.Group>
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
                </Form.Row>

                <Form.Group>
                  <div>
                    <button type="button" className="btn btn-secondary" onClick={() => this.resetFields()}>Reset Fields</button>
                  </div>
                </Form.Group>                  
              </Form>
                    
              <br/>
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
                                    {this.props.lessonsList.map((lesson) => 
                                      (course.courseId === lesson.courseId) &&
                                      (this.isLessonInDateBoundaries(lesson.startingTime, lesson.endingTime)) &&
                                      <LessonListItem key = {lesson.scheduleId} lesson = {lesson}
                                        updateSelectionMessage = {this.updateSelectionMessage}
                                        updateLessonSelectedState = {this.updateLessonSelectedState}
                                        selectLessonFunction = {this.props.selectLessonFunction}
                                        updateModalMessage={this.updateModalMessage}/>
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
                {this.props.waitingBookings &&
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
                                      (this.isLessonInDateBoundaries(lesson.startingTime, lesson.endingTime)) &&
                                      <LessonListItem key = {lesson.scheduleId} lesson = {lesson}
                                        updateSelectionMessage = {this.updateSelectionMessage}
                                        updateLessonSelectedState = {this.updateLessonSelectedState}
                                        selectLessonFunction = {this.props.selectLessonFunction}
                                        updateModalMessage={this.updateModalMessage}/>
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

export default lessonsList;
