import React from 'react';
import {AuthContext} from '../_services/AuthContext';
import {Redirect} from 'react-router-dom';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Accordion from 'react-bootstrap/esm/Accordion';
import Card from 'react-bootstrap/esm/Card';
import Button from 'react-bootstrap/esm/Button';
import Badge from 'react-bootstrap/esm/Badge';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const monitorUsagePage = (props) => {
  return(
    <AuthContext.Consumer>
      {(context) => (
        <>        
          {context.user && 
            <>
              {props.courses && props.lessons &&
                <div style={{padding: "15px"}}>
                  <OverallStatistics courses = {props.courses}/>
                  <Accordion>
                    {props.courses.map((course) => //per ogni mio corso
                      <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey = {"course-" + course.courseName}>
                              <CourseHeader course = {course.courseName}/>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={"course-" + course.courseName}>
                          <Card.Body>
                            <CourseHeaderStatics course={course}/>
                            <Accordion>
                              {props.lessons.map((lesson) => //per ogni lezione del mio corso
                                (lesson.courseId === course.courseId) &&
                                  <Card>
                                    <Card.Header>
                                      <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
                                        <Accordion.Toggle as={Button} variant="link" eventKey={course.courseName + "-" + lesson.scheduleId}>
                                          <LessonHeader id = {lesson.scheduleId} startDate = {lesson.startDate} endDate = {lesson.endDate}
                                            isLessonRemote={lesson.isLessonRemote} isLessonCancelled={lesson.isLessonCancelled}/>
                                        </Accordion.Toggle>
                                      </div>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={course.courseName + "-" + lesson.scheduleId}>
                                      <Card.Body>
                                        <LessonHeaderStatistics id = {lesson.scheduleId + "statistics"} normalBookings = {lesson.normalBookings}
                                          cancelledBookings = {lesson.cancelledBookings} waitingBookings = {lesson.waitingBookings} attendanceCount={lesson.attendanceCount}/>
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
            </>}
          {!context.user && <Redirect to="/login"/>}
      </>
    )}
    </AuthContext.Consumer>
  );
}

function computeStatistics(courses){
  const result = {
    normalBookingsAvgWeek: 0,
    cancelledBookingsAvgWeek: 0,
    waitingBookingsAvgWeek: 0,
    normalBookingsAvgMonth: 0,
    cancelledBookingsAvgMonth: 0,
    waitingBookingsAvgMonth: 0,
    attendanceCountAvgWeek: 0,
    attendanceCountAvgMonth: 0
  };
  for(let course of courses){
    result.normalBookingsAvgMonth += course.normalBookingsAvgMonth;
    result.normalBookingsAvgWeek += course.normalBookingsAvgWeek;
    result.waitingBookingsAvgMonth += course.waitingBookingsAvgMonth;
    result.waitingBookingsAvgWeek += course.waitingBookingsAvgWeek;
    result.cancelledBookingsAvgMonth += course.cancelledBookingsAvgMonth;
    result.cancelledBookingsAvgWeek += course.cancelledBookingsAvgWeek;
    result.attendanceCountAvgMonth += course.attendanceCountAvgMonth;
    result.attendanceCountAvgWeek += course.attendanceCountAvgWeek;
  }
  result.normalBookingsAvgMonth /= courses.length;
  result.normalBookingsAvgWeek /= courses.length;
  result.waitingBookingsAvgMonth /= courses.length;
  result.waitingBookingsAvgWeek /= courses.length;
  result.cancelledBookingsAvgMonth /= courses.length;
  result.cancelledBookingsAvgWeek /= courses.length;
  result.attendanceCountAvgMonth /= courses.length;
  result.attendanceCountAvgWeek /= courses.length;
  return result;
}

function OverallStatistics(props) {
  const statistics = computeStatistics(props.courses);
  return (
    <div id={props.id}>
      <Row>
        <Col>
          <h5>Statistics per week</h5>
          <h6>
            {statistics.normalBookingsAvgWeek + statistics.cancelledBookingsAvgWeek + statistics.waitingBookingsAvgWeek} total bookings,{' '}
            {statistics.normalBookingsAvgWeek} actual bookings, {' '}
            {statistics.cancelledBookingsAvgWeek} cancelled bookings, {' '}
            {statistics.waitingBookingsAvgWeek} waiting bookings, {' '}
            {statistics.attendanceCountAvgWeek} attendance {' '}
          </h6>
        </Col>
        <Col>
          <h5>Statistics per month</h5>
          <h6>
            {statistics.normalBookingsAvgMonth + statistics.cancelledBookingsAvgMonth + statistics.waitingBookingsAvgMonth} total bookings, {' '}
            {statistics.normalBookingsAvgMonth} actual bookings, {' '}
            {statistics.cancelledBookingsAvgMonth} cancelled bookings, 
            {statistics.waitingBookingsAvgMonth} waiting bookings,
            {statistics.attendanceCountAvgMonth} attendance
          </h6>
        </Col>
      </Row>
      <br/>
    </div>
  );
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
      <div id={"lesson-" + props.startDate + "----" + props.endDate}>
        <h6>
          Lezione del {props.startDate.format("ddd DD-MM-YYYY HH:mm").toString()} -- {props.endDate.format("ddd DD-MM-YYYY HH:mm").toString()}
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
  debugger;
  return (
    <>
      <h6>{props.normalBookings} Bookings</h6>
      <h6>{props.cancelledBookings} Cancelled bookings</h6>
      <h6>{props.waitingBookings} Waiting bookings</h6>
      <h6>{props.normalBookings + props.cancelledBookings + props.waitingBookings} Total bookings</h6>
      <h6>{props.attendanceCount} Attendance</h6>
    </>
  );
}

function CourseHeaderStatics(props) {
  return (
    <div id={props.course.id}>
      <Row>
        <Col>
          <h5>Statistics per week</h5>
          <h6>{props.course.normalBookingsAvgWeek} Bookings</h6>
          <h6>{props.course.cancelledBookingsAvgWeek} Cancelled bookings</h6>
          <h6>{props.course.waitingBookingsAvgWeek} Waiting bookings</h6>
          <h6>{props.course.normalBookingsAvgWeek + props.course.cancelledBookingsAvgWeek + props.course.waitingBookingsAvgWeek} Total </h6>
          <h6>{props.course.attendanceCountAvgWeek} Attendance</h6>
        </Col>
        <Col>
          <h5>Statistics per month</h5>
          <h6>{props.course.normalBookingsAvgMonth} Bookings</h6>
          <h6>{props.course.cancelledBookingsAvgMonth} Cancelled bookings</h6>
          <h6>{props.course.waitingBookingsAvgMonth} Waiting bookings</h6>
          <h6>{props.course.normalBookingsAvgMonth + props.course.cancelledBookingsAvgMonth + props.course.waitingBookingsAvgMonth} Total </h6>
          <h6>{props.course.attendanceCountAvgMonth} Attendance</h6>
        </Col>
      </Row>
      <br/>
    </div>
  );
}

export default monitorUsagePage;
