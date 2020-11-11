import React from "react";

import { userService } from "../_services";

class StudentPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null
    };
  }

  componentDidMount() {
    userService.getAll().then(users => this.setState({ users }));
  }

  render() {
    const { users } = this.state;
    return (
      <div>
        <h1>Student</h1>
        <p>This page can only be accessed by students.</p>
      </div>
    );
  }
}

export { StudentPage };
