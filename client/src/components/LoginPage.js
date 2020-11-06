import React from 'react';
import {Form, Button} from 'react-bootstrap';
class LoginPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            validated: false,
            username: '',
            password: ''
        };
    }

    updateField = (name, value) => {
        this.setState((state) => {
          return ({[name]: value});
        });
      }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if(form.checkValidity()){
            this.props.login(this.state.username, this.state.password);
        }
        this.setState({validated: true});
    }

    render(){
        return (
            <Form noValidate validated = {this.state.validated} onSubmit={this.handleSubmit}>
                <Form.Row className = 'justify-content-center'>
                    <Form.Group controlId = "username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control required name="username" type="text" placeholder="Username" value = {this.state.username} onChange = {(e) => {this.updateField(e.target.name, e.target.value)}}/>
                    </Form.Group>
                </Form.Row>
                <Form.Row className = 'justify-content-center'>
                    <Form.Group controlId = "password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required name = 'password' className = {this.props.error ? 'is-invalid':''} type="password" placeholder="Password" value = {this.state.password} onChange = {(e) => {this.updateField(e.target.name, e.target.value)}}/>
                        <Form.Control.Feedback type='invalid'>Username or password are wrong.</Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row className = 'justify-content-center'>
                    <Button type = 'submit'>Login</Button>
                </Form.Row>
            </Form>
        );
    }
}

export default LoginPage;