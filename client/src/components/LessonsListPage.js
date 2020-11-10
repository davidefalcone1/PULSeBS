import React from 'react';
import LessonListItem from './LessonListItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

const lessonsList = (props) => {
  return(
    <LessonListPageRender lessonsList={props.lessonsList}
        selectLessonFunction={props.selectLessonFunction}
        updateMyBookedLessonsList={props.updateMyBookedLessonsList}
        isMyLessonsList={props.isMyLessonsList}/>
  );
}

class LessonListPageRender extends React.Component {

  constructor(props) {
      super(props);
      this.props = props;
      this.state = {lessonSelected: false, selectionMessage: ""}
  }

  updateLessonSelectedState = (status) => {
    this.setState({lessonSelected: status});
  }
  updateSelectionMessage = (msg) => {
    this.setState({selectionMessage: msg});
  }

  render(){
    return(
      <>        
        {this.props.lessonsList && 
          <ListGroup as="ul" variant="flush">
              <ListHeader />
              <>{console.log(this.props.lessonsList)}</>
              {this.props.lessonsList.map((lesson) => 
                  <LessonListItem key = {lesson.scheduleId} lesson = {lesson}
                    updateSelectionMessage = {this.updateSelectionMessage}
                    updateLessonSelectedState = {this.updateLessonSelectedState}
                    selectLessonFunction = {this.props.selectLessonFunction}
                    updateMyBookedLessonsList = {this.props.updateMyBookedLessonsList}
                    isMyLessonsList={this.props.isMyLessonsList}/>
                    )
              }
          </ListGroup>
        }

        {!this.props.lessonsList &&
          <NoItemsImage/>
        }

        {this.state.lessonSelected && 
          <Modal show={this.state.lessonSelected} animation={false}>
            <Modal.Header>
              <Modal.Title>Lesson Selection</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row-md-6">
                {this.state.selectionMessage}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" type="button" 
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({lessonSelected: false});
                }}>Close</Button>
            </Modal.Footer>
          </Modal>
        }
      </>
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
              <h4>Date</h4>
          </div>
          <div className="col-sm-1">
              <h4>Starting Time</h4>
          </div>
          <div className="col-sm-1">
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
