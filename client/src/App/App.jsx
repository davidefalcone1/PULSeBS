import React from "react";
import { Router, Route, Link } from "react-router-dom";

import { history, Role } from "../_helpers";
import { authenticationService } from "../_services";
import { PrivateRoute } from "../_components";
import { HomePage } from "../HomePage";
import { TeacherPage } from "../TeacherPage";
import { LoginPage } from "../LoginPage";
import { StudentPage } from "../StudentPage";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      isTeacher: false,
      isStudent: false
    };
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe(x =>
      this.setState({
        currentUser: x,
        isTeacher: x && x.role === Role.Teacher,
        isStudent: x && x.role === Role.Student
      })
    );
  }

  logout() {
    authenticationService.logout();
    history.push("/login");
  }

  render() {
    const { currentUser, isTeacher, isStudent } = this.state;
    return (
      <Router history={history}>
        <div>
          {currentUser && (
            <nav className="navbar navbar-expand navbar-dark bg-dark">
              <div className="navbar-nav">
                <Link to="/" className="nav-item nav-link">
                  Home
                </Link>
                {isTeacher && (
                  <Link to="/teacher" className="nav-item nav-link">
                    Teacher
                  </Link>
                )}
                {isStudent && (
                  <Link to="/student" className="nav-item nav-link">
                    Student
                  </Link>
                )}
                <a onClick={this.logout} className="nav-item nav-link">
                  Logout
                </a>
              </div>
            </nav>
          )}
          <div className="jumbotron">
            <div className="container">
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <PrivateRoute exact path="/" component={HomePage} />
                  <PrivateRoute
                    path="/teacher"
                    roles={[Role.Teacher]}
                    component={TeacherPage}
                  />
                  <PrivateRoute
                    path="/student"
                    roles={[Role.Student]}
                    component={StudentPage}
                  />
                  <Route path="/login" component={LoginPage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export { App };
