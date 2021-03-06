import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

const configureCourseScheduleItem = (props) => {

  return (
    <ListGroup.Item id = {props.schedule.id + "-" + props.schedule.scheduleId}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
            <DayField id = {props.schedule.id} day = {props.schedule.day}/>
            <StartTimeField id = {props.schedule.id} startTime = {props.schedule.startTime}/>
            <EndTimeField id = {props.schedule.id} endTime = {props.schedule.endTime}/>
            <ClassroomField id = {props.schedule.id} classroom = {props.schedule.classroom} />
            <ButtonField id = {props.schedule.id} schedule = {props.schedule}
                edit = {props.editCourseSchedule} delete = {props.deleteCourseSchedule}/>
        </div>
    </ListGroup.Item>
  );
}

function DayField(props){
    return(
        <div className="col-sm-3">
            <h4 id={"dayOfSchedule" + props.id}>
                {props.day}
            </h4>
        </div>
    );
}
function StartTimeField(props){
    return(
        <div className="col-sm-2">
            <p id={"sTimeOfSchedule" + props.id}>
                {props.startTime.substring(0, 5)}
            </p>
        </div>
    );
}
function EndTimeField(props){
    return(
        <div className="col-sm-2">
            <p id={"eTimeOfSchedule" + props.id}>
                {props.endTime.substring(0, 5)}
            </p>
        </div>
    );
}
function ButtonField(props){
    return(
        <div className="col-sm-3">
            <Button variant="info" onClick={(event) => {
                event.preventDefault();
                props.edit(props.schedule);
            }} id={"editButtonFieldOflesson" + props.id}>
                Edit
            </Button>
            {' '}
            <Button variant="danger" onClick={(event) => {
                event.preventDefault();
                props.delete(props.id);
            }} id={"deleteButtonFieldOflesson" + props.id}>
                Delete
            </Button>
        </div>
    );
}
function ClassroomField(props){
    return(
        <div className="col-sm-2">
            <h4 id={"classroomOfSchedule" + props.id}>
                {props.classroom}
            </h4>
        </div>
    );
}

export default configureCourseScheduleItem;