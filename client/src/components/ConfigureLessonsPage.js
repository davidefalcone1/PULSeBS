import React from 'react';
import ConfigureLessonsItem from './ConfigureLessonsItem';
import ListGroup from 'react-bootstrap/ListGroup';

const configureLessonsPage = (props) => {
  return(
    <AuthContext.Consumer>
      {(context) => (
        <>        
          {context.user && props.lessonsList && 
            <ListGroup as="ul" variant="flush">
              <ListHeader />
              {props.lessonsList.map((lesson) => 
                <ConfigureLessonsItem key = {lesson.scheduleId} lesson = {lesson} 
                  courses = {props.coursesList} editLesson={props.editLesson}/>)
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
    <ListGroup.Item id = {"lessonsList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-3">
              <h4>Course Name</h4>
          </div>
          <div className="col-sm-2">
              <h4>Start Date</h4>
          </div>
          <div className="col-sm-2">
              <h4>End Date</h4>
          </div>
          <div className="col-sm-1">
              <h4>Max Available Seats</h4>
          </div>
          <div className="col-sm-2">
              <h4>Classroom</h4>
          </div>
          <div className="col-sm-2">
              <h4>{' '}</h4>
          </div>
        </div>
    </ListGroup.Item>
  );
}

export default configureLessonsPage;
