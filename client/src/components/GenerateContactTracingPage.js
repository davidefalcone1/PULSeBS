import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import {AuthContext} from '../_services/AuthContext';
import {Redirect} from 'react-router-dom';

const generateContactTracingPage = (props) => {
  return <GenerateContactTracing generateStudentTracing = {props.generateStudentTracing}
    generateTeacherTracing = {props.generateTeacherTracing}/>
}

class GenerateContactTracing extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            studentID: '', teacherID: '',
            studentFormat: 'Select format', teacherFormat: 'Select format',
            errorStudent: false, errorTeacher: false,
            errorStudentFormat: false, errorTeacherFormat: false
        }
    }

    updateField = (name, value) => {
        this.setState({[name]: value}, () => {
            if(this.state.studentID !== ''){
              this.setState({errorStudent: false});
            }
            if(this.state.teacherID !== ''){
              this.setState({errorTeacher: false});
            }
            if(this.state.studentFormat !== 'Select format'){
                this.setState({errorStudentFormat: false});
            }
            if(this.state.teacherFormat !== 'Select format'){
                this.setState({errorTeacherFormat: false});
            }
        });
    }
    handleSubmitStudent = () => {
        if (!this.sForm.checkValidity()) {
            this.form.reportValidity();
        }
        else if(this.state.studentID === ''){
            this.setState({errorStudent: true});
        }
        else if(this.state.studentFormat === 'Select format'){
            this.setState({errorStudentFormat: true});
        }
        else {
            this.props.generateStudentTracing(this.state.studentID, this.state.studentFormat.toLowerCase())
        }
    }
    handleSubmitTeacher = () => {
        if (!this.sForm.checkValidity()) {
            this.form.reportValidity();
        }
        else if(this.state.teacherID === ''){
            this.setState({errorTeacher: true});
        }
        else if(this.state.teacherFormat !== 'Select format'){
            this.setState({errorTeacherFormat: true});
        }
        else {
            this.props.generateTeacherTracing(this.state.teacherID, this.state.teacherFormat.toLowerCase())
        }
    }

    render(){
        return(
            <div style={{padding: "15px"}}>
                <AuthContext.Consumer>
                {(context) => (
                    <>        
                    {context.user && 
                        <>
                            <Row>
                                <Col>
                                    <Form method="POST" action="" id="studentForm" onSubmit={(ev) => {
                                        ev.preventDefault();
                                        this.handleSubmitStudent();
                                    }} ref={(form) => this.sForm = form}>                          
                                        <Form.Group>
                                            <Form.Label className="control-label">Student Id</Form.Label>
                                            <Form.Control type="text" name="studentID" size = "lg"
                                            value = {this.state.studentID} required autoFocus
                                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="control-label">Download Format</Form.Label>
                                            <Form.Control as="select" custom name="studentFormat" value = {this.state.studentFormat} 
                                                onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                                            <option>Select format</option>
                                            <option>PDF</option>
                                            <option>CSV</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <div>
                                                <button type="submit" className="btn btn-primary">Download</button>
                                                {this.state.errorStudent &&
                                                <>
                                                    <br/>
                                                    <Alert key="sError" variant="danger">
                                                        Student Id cannot be empty.
                                                    </Alert>
                                                </>}
                                                {this.state.errorStudentFormat &&
                                                <>
                                                    <br/>
                                                    <Alert key="tError" variant="danger">
                                                        You must select a valid format.
                                                    </Alert>
                                                </>}
                                            </div>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col>
                                    <Form method="POST" action="" id="teacherForm" onSubmit={(ev) => {
                                        ev.preventDefault();
                                        this.handleSubmitTeacher();
                                    }} ref={(form) => this.tForm = form}>                          
                                        <Form.Group>
                                            <Form.Label className="control-label">Teacher Id</Form.Label>
                                            <Form.Control type="text" name="teacherID" size = "lg"
                                            value = {this.state.teacherID} required autoFocus
                                            onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="control-label">Download Format</Form.Label>
                                            <Form.Control as="select" custom name="teacherFormat" value = {this.state.teacherFormat} 
                                                onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}>
                                            <option>Select format</option>
                                            <option>PDF</option>
                                            <option>CSV</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <div>
                                                <button type="submit" className="btn btn-primary">Download</button>
                                                {this.state.errorTeacher &&
                                                <>
                                                    <br/>
                                                    <Alert key="sError" variant="danger">
                                                        Teacher Id cannot be empty.
                                                    </Alert>
                                                </>}
                                                {this.state.errorTeacherFormat &&
                                                <>
                                                    <br/>
                                                    <Alert key="tError" variant="danger">
                                                        You must select a valid format.
                                                    </Alert>
                                                </>}
                                            </div>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                        </>}
                    {!context.user && <Redirect to="/login"/>}
                </>
                )}
                </AuthContext.Consumer>
            </div>
        );
    }
}

export default generateContactTracingPage;
