import React from 'react';
import ConfigureCourseItem from './ConfigureCoursesItem';
import ListGroup from 'react-bootstrap/ListGroup';

const configureCoursePage = (props) => {
  return(
    <AuthContext.Consumer>
      {(context) => (
        <>        
          {context.user && props.coursesList && 
          <ListGroup as="ul" variant="flush">
              <ListHeader />
              {props.coursesList.map((course) => 
                  <ConfigureCourseItem key = {course.courseId} course = {course} 
                      teachers = {props.teachersList} editCourse={props.editCourse}/>)
              }
          </ListGroup>}
          {!context.user && <Redirect to="/login"/>}
        </>
      )}
    </AuthContext.Consumer>
  );
}

function ListHeader() {
  return(
    <ListGroup.Item id = {"coursesList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-6">
            <h4>Course Name</h4>
          </div>
          <div className="col-sm-6">
            <h4>Teacher</h4>
          </div>
        </div>
    </ListGroup.Item>
  );
}

export default configureCoursePage;
