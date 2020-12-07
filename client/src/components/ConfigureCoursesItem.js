import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const configureCourseItem = (props) => {

  return (
    <ListGroup.Item id = {"course-" + props.course.courseId}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
            <NameField id = {props.course.courseId} name = {props.course.courseName}/>
            <TeacherField id = {props.course.courseId} teacherId = {props.course.teacherId}
                teachersList = {props.teachers}/>
        </div>
    </ListGroup.Item>
  );
}

function NameField(props){
    return(
        <div className="col-sm-6">
            <h6 id={"nameOfcourse_" + props.id}>
                {props.name}
            </h6>
        </div>
    );
}

function TeacherField(props){
    return(
        <div className="col-sm-6">
            {props.teachersList.map((t) => //per ogni lezione del mio corso
                (t.personId === props.teacherId) &&
                    <h6 id={"teacherOfcourse_" + t.personId + "-" + props.id}>
                        {t.fullName}
                    </h6>
            )}
        </div>
    );
}

export default configureCourseItem;