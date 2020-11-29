import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

const lessonListItem = (props) => {
  return (
    <ListGroup.Item id = {"lesson-" + props.lesson.id}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
                <StartDateField id = {props.lesson.scheduleId} startDate = {props.lesson.startDate}/>
                <EndDateField id = {props.lesson.scheduleId} endDate = {props.lesson.endDate}/>
                <BookingStatusField id = {props.lesson.scheduleId} occupiedSeats = {props.lesson.occupiedSeats} availableSeats = {props.lesson.availableSeats}/>
                <SelectField id = {props.lesson.scheduleId} selectLessonFunction = {props.selectLessonFunction} />
        </div>
    </ListGroup.Item>
  );
}

function StartDateField(props){
    return(
        <div className="col-sm-3">
            <p id={"startDateOfLesson" + props.id}>
                {props.startDate.format("ddd DD-MM-YYYY HH:mm").toString()}
            </p>
        </div>
    );
}

function EndDateField(props){
    return(
        <div className="col-sm-3">
            <p id={"endDateOfLesson" + props.id}>
                {props.endDate.format("ddd DD-MM-YYYY HH:mm").toString()}
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