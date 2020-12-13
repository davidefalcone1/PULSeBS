import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const configureClassroomItem = (props) => {
  return (
    <ListGroup.Item id = {"class-" + props.enrollment.studentId + '-' + props.enrollment.courseId}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
            <CourseField id = {"c-" + props.enrollment.courseId + "-" + props.enrollment.studentId}
                courseId = {props.enrollment.courseId} courses = {props.courses}/>
            <StudentField id = {"s-" + props.enrollment.courseId + "-" + props.enrollment.studentId}
                studentId = {props.enrollment.studentId} students = {props.students}/>
        </div>
    </ListGroup.Item>
  );
}

function CourseField(props){
    return(
        <div className="col-sm-6">
            {props.courses.map((c) => //per ogni lezione del mio corso
                (c.courseId === props.courseId) &&
                    <h6 id={"nameOfcourseForEnrollement_" + props.id} key={"nameOfcourseForEnrollement_" + props.id}>
                        {c.courseName}
                    </h6>
            )}
        </div>
    );
}

function StudentField(props){
    return(
        <div className="col-sm-6">
            {props.students.map((s) => //per ogni lezione del mio corso
                (s.personId === props.studentId) &&
                    <h6 id={"nameOfstudentForEnrollement_" + props.id} key={"nameOfstudentForEnrollement_" + props.id}>
                        {s.fullName}
                    </h6>
            )}
        </div>
    );
}

export default configureClassroomItem;