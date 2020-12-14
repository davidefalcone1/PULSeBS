import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

const configureLessonItem = (props) => {
  return (
    <ListGroup.Item id = {"lesson-" + props.lesson.scheduleId}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
            <CourseNameField id = {props.lesson.scheduleId} courseId = {props.lesson.courseId}
                courses = {props.courses}/>
            <StartDateField id = {props.lesson.scheduleId} startDate = {props.lesson.startDate}/>
            <EndDateField id = {props.lesson.scheduleId} endDate = {props.lesson.endDate}/>
            <SeatsField id = {props.lesson.scheduleId} seats = {props.lesson.availableSeats}/>
            <ClassroomField id = {props.lesson.scheduleId} classroom = {props.lesson.classroom}/>
            <ButtonField id = {props.lesson.scheduleId} lesson = {props.lesson} editLesson = {props.editLesson}/>
        </div>
    </ListGroup.Item>
  );
}

function CourseNameField(props){
    return(
        <div className="col-sm-3">
            {props.courses.map((c) => //per ogni lezione del mio corso
                (c.courseId === props.courseId) &&
                    <h6 id={"nameOfcourseForLesson_" + props.id} key={"nameOfcourseForLesson_" + props.id}>
                        {c.courseName}
                    </h6>
            )}
        </div>
    );
}

function StartDateField(props){
    return(
        <div className="col-sm-2">
            <p id={"startDateOfLesson" + props.id}>
                {props.startDate.format("ddd DD-MM-YYYY HH:mm").toString()}
            </p>
        </div>
    );
}

function EndDateField(props){
    return(
        <div className="col-sm-2">
            <p id={"endDateOfLesson" + props.id}>
                {props.endDate.format("ddd DD-MM-YYYY HH:mm").toString()}
            </p>
        </div>
    );
}

function SeatsField(props){
    return(
        <div className="col-sm-2">
            <p id={"seatsOfLesson" + props.id}>
                {props.seats}
            </p>
        </div>
    );
}

function ClassroomField(props){
    return(
        <div className="col-sm-2">
            <p id={"classroomOfLesson" + props.id}>
                {props.classroom}
            </p>
        </div>
    );
}

function ButtonField(props){
    return(
        <div className="col-sm-1">
            <Button variant="primary" onClick={(event) => {
                event.preventDefault();
                props.editLesson(props.lesson);
            }} id={"buttonFieldOflesson" + props.id}>
                Edit
            </Button>
        </div>
    );
}

export default configureLessonItem;