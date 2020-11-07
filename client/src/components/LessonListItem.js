import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

const lessonListItem = (props) => {

  return (
    <ListGroup.Item id = {"lesson-" + props.lesson.id}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
                <CourseField id = {props.lesson.id} course = {props.lesson.course}/>
                <ProfessorField id = {props.lesson.id} professor = {props.lesson.professor}/>
                <DateAndTimeField id = {props.lesson.id} dateAndTime = {props.lesson.dateAndTime}/>
                <SelectField id = {props.lesson.id} selectLessonFunction = {props.selectLessonFunction}
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

function ProfessorField(props){
    return(
        <div className="col-sm-3">
            <p id={"professorOfLesson" + props.id}>
                {props.professor}
            </p>
        </div>
    );
}

function DateAndTimeField(props){
    return(
        <div className="col-sm-3">
            <p id={"dateAndTimeOfLesson" + props.id}>
                {props.dateAndTime}
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