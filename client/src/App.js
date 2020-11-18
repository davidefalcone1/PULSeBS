import React from 'react';
import Navbar from './components/Navbar';
import API from './API/API';
import LessonsList from './components/LessonsListPage';
import MyCoursesLessonsStudents from './components/MyCoursesLessonsStudentsPage';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import LoginPage from './components/LoginPage';
class App extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      user: null,
      loginError: false,
      lessons: [
        {
          scheduleId: 0,
          courseId: 1,
          startingTime: "2013-02-08 09:30:26",
          endingTime: "2013-02-08 09:30:26",
          occupiedSeats: 5,
          availableSeats: 10
        },
      ],
      myBookedLessons: [
        {
          scheduleId: 0,
          courseId: 1,
          startingTime: "2013-02-08 09:30:26",
          endingTime: "2013-02-08 09:30:26",
          occupiedSeats: 5,
          availableSeats: 10
        },
      ],
      courses: [
        {
          courseId: 1,
          courseName: "CourseName",
          teacherId: 1
        },
      ],
      studentsBookings: [
        {
          id: 0,
          scheduleId: 0,
          studentId: 2,
          status: "active",
          attended: "true"
        },
      ],
      studentsInfos: [
        {
          id: 0,
          personId: 2,
          fullName: "Full Name",
          email: "mail@mail.com"
        }
      ],
    };ticketdetails
  }

  componentDidMount() {
    var test = 1; //per test --> 1= student, 2=teacher
    if(test === 1 ){
      API.getStudentCourses().then((courseList) => {
        this.setState({courses: courseList});
      }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });

      API.getMyBookableLessons().then((bookableLessons) => {
        this.setState({lessons: bookableLessons});
      }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });

      API.getMyBookedLessons().then((bookedLessons) => {
        this.setState({myBookedLessons: bookedLessons});
      }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    }
    else if(test === 2){
      API.getTeacherCourses().then((courseList) => {
        this.setState({courses: courseList});
      }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });

      API.getMyCoursesLessons().then((myCoursesLessons) => {
        this.setState({lessons: myCoursesLessons});
        
        var lessonsIds = myCoursesLessons.map((row) => { return row.scheduleId });
        API.getBookedStudents(lessonsIds).then((bookingData) => {
          this.setState({studentsBookings: bookingData});

          var studentsIds = bookingData.map((row) => { return row.studentId });
          API.getStudentsData(studentsIds).then((studentsData) => {
            this.setState({studentsInfos: studentsData});
          }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });;
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
      }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    }
  }
  
  login = async (username, password) => {
    API.login(username, password)
    .then((user) =>{
      this.setState({user, loginError: false});
      //IF STUDENT        
        //fetch from back-end bookable lessons and my booked lessons
          //1.1 --> fetch my courses (where i am enrolled)
          //1.2 --> fetch bookable lessons for my courses
          //1.3 --> fetch booked lessons for my courses
      //IF PROFESSOR
        //fetch from back-end data on my lessons and students booked to them
          //1.1 --> fetch my courses (where i teach)
          //1.2 --> fetch lessons of my courses
          //1.3 --> fetch my lessons' booked students id
          //1.4 --> fetch my lessons' booked students data 
      //IF SUPPORT MANAGER
        //fetch from back-end something??? TODO
    })
    .catch((e) => {
      console.log(e);
      this.setState((state)=> {return {...state, user: null, loginError: true}});
    });
  }

  bookLesson = (lessonId) => {
    API.bookLesson(lessonId).then(() =>{
      console.log("Lesson booked.");
      API.getMyBookableLessons().then((bookableLessons) =>{
        this.setState({lessons: bookableLessons});
      });
    });
  }

  deleteLesson = (bookingId) => {
    API.deleteBooking(bookingId).then(() =>{
      console.log("Lesson deleted.");   
      API.getMyBookableLessons().then((bookableLessons) =>{
        this.setState({lessons: bookableLessons});
      });
    });
  }

  updateMyBookedLessonsList = () => {
    API.getMyBookedLessons(/*user.personId*/).then((myLessons) => {
      this.setState({myBookedLessons: myLessons});
    })   
  }

  render() {
    //LOGIN IS THE FIRST PAGE
    return (
      <>
        <Navbar />
        <Switch>
          <Route path='/lessonslist'>
            <LessonsList lessonsList = {this.state.lessons} selectLessonFunction={this.bookLesson} courses = {this.state.courses}
              updateMyBookedLessonsList={this.updateMyBookedLessonsList} isMyLessonsList={false}/>
          </Route>
          <Route path='/myBookedLessonslist'>
            <LessonsList lessonsList = {this.state.myBookedLessons} selectLessonFunction={this.deleteLesson} courses = {this.state.courses}
              updateMyBookedLessonsList={this.updateMyBookedLessonsList} isMyLessonsList={true}/>
          </Route>
          <Route path='/myCoursesLessonslist'>
            <MyCoursesLessonsStudents teacherCourses = {this.state.courses} myTeachedCoursesLessons = {this.state.lessons} 
              studentsBookedToMyLessons = {this.state.studentsBookings} myBookedStudentsInfos = {this.state.studentsInfos}/>
          </Route>
          {/* <Route path="/ticketdetails">
            {
              !this.state.user ? <Redirect to='/login'/> : <TicketDetails tickets={this.state.tickets} differentCounterIds = {this.state.differentCounterIds} 
                callNextCustomerFunction={API.callNextCustomer} updateTicketList={this.updateTicketList}/>
            }
          </Route> */}
          <Route path="/login">
            <LoginPage login={this.login} error={this.state.loginError}/>
          </Route>
        </Switch>
      </>
    );
  }
}
export default withRouter(App);