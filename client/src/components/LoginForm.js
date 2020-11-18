import React, { Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../_services/AuthContext'

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { username: '', password: '', submitted: false };
    }

    onChangeUsername = (event) => {
        this.setState({ username: event.target.value });
    };

    onChangePassword = (event) => {
        this.setState({ password: event.target.value });
    };

    handleSubmit = (event, onLogin) => {
        event.preventDefault();
        onLogin(this.state.username, this.state.password).then(() => {
        });
        this.setState({ submitted: true });
    }

    render() {
        // if (this.state.submitted)
        //     return <Redirect to='/' />;
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {!context.user && 
                            <Fragment>
                                <div id='form' className="col-sm-4 mx-auto">
                                    <div className="card">
                                        <article className="card-group-item">
                                            <header className="card-header">
                                                <h5 className="title"><em id ='form-title'>Insert your credentials </em></h5>
                                            </header>  
                                            <div className="filter-content">
                                                <div className="card-body">
                                                    <div className="table-responsive">

                                                        <Form method="POST" onSubmit={(event) => this.handleSubmit(event, context.loginUser)}>
                                                            <Form.Group controlId="username">
                                                                <Form.Label>E-mail</Form.Label>
                                                                <Form.Control className="inputEmail" type="email" name="email" placeholder="E-mail" value={this.state.username} onChange={(ev) => this.onChangeUsername(ev)} required autoFocus />
                                                                <small className="form-text text-muted">Email is required</small>
                                                            </Form.Group>



                                                            <Form.Group controlId="password">
                                                                <Form.Label>Password</Form.Label>
                                                                <Form.Control type="password" name="password" placeholder="Password" value={this.state.password} onChange={(ev) => this.onChangePassword(ev)} required />
                                                                <small className="form-text text-muted">Password is required</small>
                                                            </Form.Group>

                                                            <Button variant="primary" type="submit">Login</Button>
                                                        </Form>

                                                        {context.loginError &&
                                                            <Alert variant="danger">
                                                                {context.loginError}
                                                            </Alert>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            </Fragment>
                        }
                        {context.configurationCompleted && context.isStudent && <Redirect to="lessonslist"/> }
                        {context.configurationCompleted && context.isTeacher && <Redirect to="myCoursesLessonslist"/> }
                    </>
                )}
            </AuthContext.Consumer>

        );
    }


}

export default LoginForm;