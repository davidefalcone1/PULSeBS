import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

const lessonListItem = (props) => {
  return (
    <ListGroup.Item id = {"lesson-" + props.lesson.id}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
                <StartingTimeField id = {props.lesson.scheduleId} startingTime = {props.lesson.startingTime}/>
                <EndingTimeField id = {props.lesson.scheduleId} endingTime = {props.lesson.endingTime}/>
                <BookingStatusField id = {props.lesson.scheduleId} occupiedSeats = {props.lesson.occupiedSeats} availableSeats = {props.lesson.availableSeats}/>
                <SelectField id = {props.lesson.scheduleId} selectLessonFunction = {props.selectLessonFunction} />
        </div>
    </ListGroup.Item>
  );
}

function StartingTimeField(props){
    return(
        <div className="col-sm-3">
            <p id={"startingTimeOfLesson" + props.id}>
                {props.startingTime.format("ddd DD-MM-YYYY HH:mm").toString()}
            </p>
        </div>
    );
}

function EndingTimeField(props){
    return(
        <div className="col-sm-3">
            <p id={"endingTimeOfLesson" + props.id}>
                {props.endingTime.format("ddd DD-MM-YYYY HH:mm").toString()}
            </p>
        </div>
    );
}

function BookingStatusField(props){
    return(
        <div className="col-sm-3">
            <p id={"seatsStatusOfLesson" + props.id}>
                {props.occupiedSeats} / {props.availableSeats}
            </p>
        </div>
    );
}

function SelectField(props){
    return(
        <div className="col-sm-3">
            <Button variant="danger" onClick={(event) => {
                event.preventDefault();
                props.selectLessonFunction(props.id);               
            }} id={"deleteFieldOfLesson" + props.id}>
                DELETE
            </Button>
        </div>
    );
}

export default lessonListItem;