import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

const lessonListItem = (props) => {

  return (
    <ListGroup.Item id = {"lesson-" + props.lesson.id}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
                <CourseField id = {props.lesson.scheduleId} course = {props.lesson.course}/>
                <DateField id = {props.lesson.scheduleId} date = {props.lesson.date}/>
                <StartingTimeField id = {props.lesson.scheduleId} startingTime = {props.lesson.startingTime}/>
                <EndingTimeField id = {props.lesson.scheduleId} endingTime = {props.lesson.endingTime}/>
                <BookingStatusField id = {props.lesson.scheduleId} occupiedSeats = {props.lesson.occupiedSeats} availableSeats = {props.lesson.availableSeats}/>
                <SelectField id = {props.lesson.scheduleId} selectLessonFunction = {props.selectLessonFunction}
                    updateSelectionMessage = {props.updateSelectionMessage}
                    updateLessonSelectedState = {props.updateLessonSelectedState}
                    updateMyBookedLessonsList = {props.updateMyBookedLessonsList}
                    isMyLessonsList={props.isMyLessonsList}
                />
        </div>
    </ListGroup.Item>
  );
}

function CourseField(props){
    return(
        <div className="col-sm-4">
            <p id={"courseOfLesson_" + props.id}>
                {props.course}
            </p>
        </div>
    );
}

function DateField(props){
    return(
        <div className="col-sm-2">
            <p id={"dateOfLesson" + props.id}>
                {props.date}
            </p>
        </div>
    );
}

function StartingTimeField(props){
    return(
        <div className="col-sm-1">
            <p id={"startingTimeOfLesson" + props.id}>
                {props.startingTime}
            </p>
        </div>
    );
}

function EndingTimeField(props){
    return(
        <div className="col-sm-1">
            <p id={"endingTimeOfLesson" + props.id}>
                {props.endingTime}
            </p>
        </div>
    );
}

function BookingStatusField(props){
    return(
        <div className="col-sm-2">
            <p id={"seatsStatusOfLesson" + props.id}>
                {props.occupiedSeats} / {props.availableSeats}
            </p>
        </div>
    );
}

function SelectField(props){
    return(
        <>
            {!props.isMyLessonsList && 
                <div className="col-sm-2">
                    <Button variant="info" onClick={(event) => {
                        event.preventDefault();
                        props.selectLessonFunction(props.id).then((resultString) => {
                            props.updateSelectionMessage(resultString);
                            props.updateMyBookedLessonsList();
                        });               
                        props.updateLessonSelectedState(true);
                    }} id={"selectFieldOfLesson" + props.id}>
                        SELECT
                    </Button>
                </div>
            }
            {props.isMyLessonsList && 
                <div className="col-sm-2">
                    <Button variant="danger" onClick={(event) => {
                        event.preventDefault();
                        props.selectLessonFunction(props.id).then((resultString) => {
                            props.updateSelectionMessage(resultString);
                            props.updateMyBookedLessonsList();
                        });               
                        props.updateLessonSelectedState(true);
                    }} id={"deleteFieldOfLesson" + props.id}>
                        DELETE
                    </Button>
                </div>
            }
        </>
    );
}

export default lessonListItem;