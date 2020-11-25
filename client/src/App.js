import React from 'react';
import Navbar from './components/Navbar';
import API from './API/API';
import LessonsList from './components/LessonsListPage';
import MyCoursesLessonsStudents from './components/MyCoursesLessonsStudentsPage';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
//import LoginPage from './components/LoginPage';
import LoginForm from './components/LoginForm'
import { AuthContext } from './_services/AuthContext';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      user: null,
      isTeacher: false,
      isStudent: false,
      loginError: false,
      configurationCompleted: false,
      lessons: [],
      myBookedLessons: [],
      courses: [],
      studentsBookings: [],
      studentsInfos: [],
    };
  }

  componentDidMount() {
  }

  logout = () => {
    API.logout().then(() => {
      this.setState({ user: null, loginError: null, configurationCompleted: false });
    });
  }

  login = async (username, password) => {
    API.login(username, password)
      .then((user) => {
        console.log("Login completed " + user);
        this.setState({ user, loginError: false });
        if (user.accessLevel === 1) {
          this.setState({ isTeacher: false, isStudent: true });
        }
        if (user.accessLevel === 2) {
          this.setState({ isTeacher: true, isStudent: false });
        }
        if (this.state.isTeacher) {
          console.log("User is teacher");
          API.getTeacherCourses().then((courseList) => {
            this.setState({ courses: courseList });
    
            API.getMyCoursesLessons().then((myCoursesLessons) => {
              this.setState({ lessons: myCoursesLessons });
      
              var lessonsIds = myCoursesLessons.map((row) => { return row.scheduleId });
              API.getBookedStudents(lessonsIds).then((bookingData) => {
                this.setState({ studentsBookings: bookingData });
      
                var studentsIds = bookingData.map((row) => { return row.studentId });
                API.getStudentsData(studentsIds).then((studentsData) => {
                  this.setState({ studentsInfos: studentsData, configurationCompleted: true });
                }).catch((errorObj) => { console.log(errorObj); });
              }).catch((errorObj) => { console.log(errorObj); });
            }).catch((errorObj) => { console.log(errorObj); });
          }).catch((errorObj) => { console.log(errorObj); });
        }
        if (this.state.isStudent) {
          console.log("User is student");
          API.getStudentCourses().then((courseList) => {
            this.setState({ courses: courseList });

            API.getMyBookableLessons().then((bookableLessons) => {
              this.setState({ lessons: bookableLessons });
    
              API.getMyBookedLessons().then((bookedLessons) => {
                this.setState({ myBookedLessons: bookedLessons, configurationCompleted: true });
              }).catch((errorObj) => { console.log(errorObj); });
            }).catch((errorObj) => { console.log(errorObj); });
          }).catch((errorObj) => { console.log(errorObj); });
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState((state) => { return { ...state, user: null, loginError: e } });
      });
  }

  bookLesson = (lessonId) => {
    API.bookLesson(lessonId).then(() => {
      console.log("Lesson booked.");
      API.getMyBookableLessons().then((bookableLessons) => {
        this.setState({ lessons: bookableLessons });
      }).catch((errorObj) => { console.log(errorObj); });
      API.getMyBookedLessons().then((myLessons) => {
        this.setState({ myBookedLessons: myLessons });
      }).catch((errorObj) => { console.log(errorObj); });
    }).catch((errorObj) => { console.log(errorObj); });
  }

  deleteLesson = (lessonId) => {
    API.deleteBooking(lessonId).then(() => {
      console.log("Lesson deleted.");

      API.getMyBookableLessons().then((bookableLessons) => {
        this.setState({ lessons: bookableLessons });
      }).catch((errorObj) => { console.log(errorObj); });

      API.getMyBookedLessons().then((myLessons) => {
        this.setState({ myBookedLessons: myLessons });
      }).catch((errorObj) => { console.log(errorObj); });
    }).catch((errorObj) => { console.log(errorObj); });
  }


  render() {
    const value = {
      user: this.state.user,
      loginError: this.state.loginError,
      isStudent: this.state.isStudent,
      isTeacher: this.state.isTeacher,
      loginUser: this.login,
      logoutUser: this.logout,
      configurationCompleted: this.state.configurationCompleted
    }
    return (
      <AuthContext.Provider value={value}>
        <>
          <Navbar />
          <Switch>
            <Route path='/lessonslist'>
              {!this.state.user ? <Redirect to='/login'/> : <LessonsList lessonsList={this.state.lessons} selectLessonFunction={this.bookLesson}
                courses={this.state.courses} isMyLessonsList={false} />}
            </Route>
            <Route path='/myBookedLessonslist'>
               {!this.state.user ? <Redirect to='/login'/> : <LessonsList lessonsList={this.state.myBookedLessons} selectLessonFunction={this.deleteLesson}
                courses={this.state.courses} isMyLessonsList={true} />}
            </Route>
            <Route path='/myCoursesLessonslist'>
              {!this.state.user ? <Redirect to='/login'/> : <MyCoursesLessonsStudents teacherCourses={this.state.courses} myTeachedCoursesLessons={this.state.lessons}
                studentsBookedToMyLessons={this.state.studentsBookings} myBookedStudentsInfos={this.state.studentsInfos} />}
            </Route>
            <Route path="/login">
              <LoginForm />
            </Route>
            <Route path="/">
              <Redirect to="/login" />
            </Route>
          </Switch>
        </>
      </AuthContext.Provider>
    );
  }
}
export default withRouter(App);
