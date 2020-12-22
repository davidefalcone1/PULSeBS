import React from 'react';
import {AuthContext} from '../_services/AuthContext';
import {Redirect} from 'react-router-dom';

const studentTutorialPage = (props) => {
  return <TeacherTutorial setTutorialCompleted = {props.setTutorialCompleted}/>
}

class TeacherTutorial extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            imagePath: "./images/tutorial/student/",
            imgIndex: 1,
            maxIndex: 8,
            hasFinished: false
        }
    }

    goToNext = () => {
        if((this.state.imgIndex + 1) <= 8){
            this.setState({imgIndex: this.state.imgIndex+1});
        }
        else{
            this.closeTutorial();
        }
    }
    closeTutorial = () => {
        this.props.setTutorialCompleted();
    }
    
    render(){
        return(
            <div style={{padding: "15px"}}>
                <AuthContext.Consumer>
                {(context) => (
                    <>
                    {context.user && !context.hasDoneTutorial &&
                    <div className="fill-screen">
                        <img className="img-button fitScreen" src={this.state.imagePath + this.state.imgIndex + ".png"}
                          alt="" onClick={(e) => {
                            e.preventDefault();
                            this.goToNext();
                        }}/>
                    </div>}
                    {context.user && context.hasDoneTutorial && <Redirect to="/myBookableLessonsList"/>}
                    {!context.user && <Redirect to="/login"/>}
                </>
                )}
                </AuthContext.Consumer>
            </div>
        );
    }
}

export default studentTutorialPage;
