import React from 'react';
import Navbar from './components/Navbar';
import API from './API/API';
import LessonsList from './components/MyBookableLessonsPage';
import MyLessonsList from './components/MyBookedLessonsPage';
import MyCoursesLessonsStudents from './components/MyCoursesLessonsStudentsPage';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import ConfigureUsers from './components/ConfigureUsersPage';
import ConfigureLessons from './components/MyBookableLessonsPage';
import ConfigureCourses from './components/ConfigureCoursesPage';
import ConfigureClasses from './components/ConfigureClassesPage';
import MonitorUsage from './components/MonitorUsagePage';
import LoginForm from './components/LoginForm'
import { AuthContext } from './_services/AuthContext';
import CourseData from './API/CourseData';
import LessonData from './API/LessonData';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      user: null,
      isTeacher: false,
      isStudent: false,
      isBookingManager: false,
      isSupportOfficer: false,
      loginError: false,
      configurationCompleted: false,
      lessons: [],
      myBookedLessons: [],
      myWaitingBookedLessons: [],
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
        if (user.accessLevel === 1) { //student
          this.setState({ isTeacher: false, isStudent: true,
            isBookingManager: false, isSupportOfficer: false, });
          console.log("User is student");
          API.getStudentCourses().then((courseList) => {
            this.setState({ courses: courseList });

            API.getMyBookableLessons().then((bookableLessons) => {
              this.setState({ lessons: bookableLessons });

              API.getMyBookedLessons().then((bookedLessons) => {
                this.setState({ myBookedLessons: bookedLessons, configurationCompleted: true });
              }).catch((errorObj) => { console.log(errorObj); });

              API.getMyWaitingBookedLessons().then((myWaitingBookedLessons) => {
                this.setState({ myWaitingBookedLessons: myWaitingBookedLessons });
              }).catch((errorObj) => { console.log(errorObj); });
            }).catch((errorObj) => { console.log(errorObj); });
          }).catch((errorObj) => { console.log(errorObj); });
        }
        if (user.accessLevel === 2) { //teacher
          this.setState({ isTeacher: true, isStudent: false,
            isBookingManager: false, isSupportOfficer: false});
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
        if (user.accessLevel === 3) { //booking manager
          const lessons = [
            new LessonData(0, 1, '2020-09-25T15:00', '2020-09-25T17:00', 40, 60, false, true, null),
            new LessonData(1, 1, '2020-09-26T17:00', '2020-09-26T19:00', 40, 40, false, true, null),
            new LessonData(2, 2, '2020-09-27T15:00', '2020-09-27T17:00', 20, 40, false, false, null),
            new LessonData(3, 2, '2020-09-30T15:00', '2020-09-30T17:00', 40, 60, false, false, null),
            new LessonData(4, 2, '2020-10-25T15:00', '2020-10-25T17:00', 40, 60, false, true, null)
          ];
          const courses = [
            new CourseData(1, 'Mobile application development', 's12345'),           
            new CourseData(2, 'Software engineering 2', 's54321')           
          ];
          this.setState({ isTeacher: false, isStudent: false,
            isBookingManager: true, isSupportOfficer: false, courses: courses, lessons: lessons});
        }
        if (user.accessLevel === 4) { //support officer
          this.setState({ isTeacher: false, isStudent: false,
            isBookingManager: false, isSupportOfficer: true});
          
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState((state) => { return { ...state, user: null, loginError: e } });
      });
  }

  updateBookableLessons = () => {
    API.getMyBookableLessons().then((bookableLessons) => {
      this.setState({ lessons: bookableLessons });
    }).catch((errorObj) => { console.log(errorObj); });
  }
  updateMyBookedLessons = () => {
    API.getMyBookedLessons().then((myLessons) => {
      this.setState({ myBookedLessons: myLessons });
    }).catch((errorObj) => { console.log(errorObj); });

    API.getMyWaitingBookedLessons().then((myWaitingBookedLessons) => {
      this.setState({ waitingBookings: myWaitingBookedLessons });
    }).catch((errorObj) => { console.log(errorObj); });
  }

  bookLesson = async (lessonId) => {
    return API.bookLesson(lessonId).then((response) => {//TODO bookLesson will return if it was an actual booking or the student is in the waiting queue
      console.log("Lesson booked.");

      this.updateBookableLessons();
      this.updateMyBookedLessons();

      return response; //TODO true if actual booking, false if waiting queue
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

  cancelLesson = (lessonId) => {
    return API.cancelLesson(lessonId).then(() =>{
      API.getMyCoursesLessons().then((myCoursesLessons) => {
        this.setState({ lessons: myCoursesLessons });
      });
    })
  }
  changeLessonToRemote = (lessonId) => {
    return API.makeLessonRemote(lessonId).then(() =>{
      API.getMyCoursesLessons().then((myCoursesLessons) => {
        this.setState({ lessons: myCoursesLessons });
      });
    })
  }
  setStudentAsPresent = (scheduleId, studentId) => {
    API.setStudentAsPresent(scheduleId, studentId).then(() => {
      var lessonsIds = this.state.lessons.map((row) => { return row.scheduleId });
      API.getBookedStudents(lessonsIds).then((bookingData) => {
        this.setState({ studentsBookings: bookingData });  
        var studentsIds = bookingData.map((row) => { return row.studentId });
        API.getStudentsData(studentsIds).then((studentsData) => {
          this.setState({ studentsInfos: studentsData, configurationCompleted: true });
        }).catch((errorObj) => { console.log(errorObj); });
      }).catch((errorObj) => { console.log(errorObj); });
    }).catch((errorObj) => { console.log(errorObj); });    
  }

  render() {
    const value = {
      user: this.state.user,
      loginError: this.state.loginError,
      isStudent: this.state.isStudent,
      isTeacher: this.state.isTeacher,
      isBookingManager: this.state.isBookingManager,
      isSupportOfficer: this.state.isSupportOfficer,
      loginUser: this.login,
      logoutUser: this.logout,
      configurationCompleted: this.state.configurationCompleted
    }
    return (
      <AuthContext.Provider value={value}>
        <>
          <Navbar />
          <Switch>
            <Route path='/myBookableLessonsList'>
              {!this.state.user ? <Redirect to='/login' /> : <LessonsList lessonsList={this.state.lessons}
                selectLessonFunction={this.bookLesson} courses={this.state.courses} />}
            </Route>
            <Route path='/myBookedLessonslist'>
              {!this.state.user ? <Redirect to='/login' /> : <MyLessonsList lessonsList={this.state.myBookedLessons}
                waitingBookings={this.state.myWaitingBookedLessons} selectLessonFunction={this.deleteLesson} courses={this.state.courses} />}
            </Route>
            <Route path='/myCoursesLessonslist'>
              {!this.state.user ? <Redirect to='/login' /> : <MyCoursesLessonsStudents teacherCourses={this.state.courses}
                myTeachedCoursesLessons={this.state.lessons} studentsBookedToMyLessons={this.state.studentsBookings}
                myBookedStudentsInfos={this.state.studentsInfos} cancelLesson={this.cancelLesson}
                changeLessonToRemote={this.changeLessonToRemote} setStudentAsPresent={this.setStudentAsPresent}/>}
            </Route>
            <Route path='/monitorUsage'>
              {!this.state.user ? <Redirect to='/login' /> : <MonitorUsage lessons={this.state.lessons} courses={this.state.courses}/>}
            </Route>
            <Route path='/configureStudentsList'>
              {!this.state.user ? <Redirect to='/login' /> : <ConfigureUsers type={"student"} usersList={""}
                createNewUser={""} editUser={""}/>}
            </Route>
            <Route path='/configureCoursesList'>
              {!this.state.user ? <Redirect to='/login' /> : <ConfigureCourses coursesList={""} teachersList={""}
                createNewCourse={""} editCourse={""}/>}
            </Route>
            <Route path='/configureTeachersList'>
              {!this.state.user ? <Redirect to='/login' /> : <ConfigureUsers type={"teacher"}  usersList={""}
                createNewUser={""} editUser={""}/>}
            </Route>
            <Route path='/configureLessonsList'>
              {!this.state.user ? <Redirect to='/login' /> : <ConfigureLessons lessonsList={""} coursesList={""}
                classesList={""} createNewLesson={""} editLesson={""}/>}
            </Route>
            <Route path='/configureClassesList'>
              {!this.state.user ? <Redirect to='/login' /> : <ConfigureClasses classesList={""}
                createNewClass={""} editClass={""}/>}
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
