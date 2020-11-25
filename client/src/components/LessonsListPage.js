import React from 'react';
import LessonListItem from './LessonListItem';
import ListGroup from 'react-bootstrap/ListGroup';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../_services/AuthContext'

const lessonsList = (props) => {
  return(
    <LessonListPageRender coursesList={props.courses}
        lessonsList={props.lessonsList}
        selectLessonFunction={props.selectLessonFunction}
        updateMyBookedLessonsList={props.updateMyBookedLessonsList}
        isMyLessonsList={props.isMyLessonsList}/>
  );
}

class LessonListPageRender extends React.Component {

  constructor(props) {
      super(props);
      this.props = props;
      this.state = {}
  }


  render(){
    return(
      <AuthContext.Consumer>
        {(context) => (
          <>        
            {context.user && this.props.lessonsList && 
              <ListGroup as="ul" variant="flush">
                <ListHeader />
                {this.props.lessonsList.map((lesson) => 
                  <LessonListItem key = {lesson.scheduleId} lesson = {lesson}
                    updateSelectionMessage = {this.updateSelectionMessage}
                    updateLessonSelectedState = {this.updateLessonSelectedState}
                    selectLessonFunction = {this.props.selectLessonFunction}
                    isMyLessonsList={this.props.isMyLessonsList}
                    coursesList={this.props.coursesList}/>
                )}
              </ListGroup>
            }
            {context.user && !this.props.lessonsList &&
              <NoItemsImage/>
            }
            {!context.user && <Redirect to="/login"/>}
          </>
        )}
      </AuthContext.Consumer>
    )
  }
}

function ListHeader() {
  return(
    <ListGroup.Item id = {"lessonList-header"}>
        <div className="d-flex w-100 pt-3 justify-content-between no-gutters">
          <div className="col-sm-4">
              <h4>Course</h4>
          </div>
          <div className="col-sm-2">
              <h4>Starting Time</h4>
          </div>
          <div className="col-sm-2">
              <h4>Ending Time</h4>
          </div>
          <div className="col-sm-2">
              <h4># of Booked Seats</h4>
          </div>
          <div className="col-sm-2">
          </div>
        </div>
    </ListGroup.Item>
  );
}

function NoItemsImage(props){
    return(
        <div className="col-sm-12 pt-3">
            <img width="800" height="600" className="img-button" src='./images/no_data_image.png' alt=""/>
        </div>
    );
}

export default lessonsList;
