import React from 'react';
import Navbar from './components/Navbar';
import API from './API/API';
import LessonsList from './components/MyBookableLessonsPage';
import MyLessonsList from './components/MyBookedLessonsPage';
import MyCoursesLessonsStudents from './components/MyCoursesLessonsStudentsPage';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import ConfigureUsers from './components/ConfigureUsersPage';
import ConfigureLessons from './components/ConfigureLessonsPage';
import ConfigureCourses from './components/ConfigureCoursesPage';
import ConfigureClassrooms from './components/ConfigureClassroomsPage';
import ConfigureClasses from './components/ConfigureClassesPage';
import MonitorUsage from './components/MonitorUsagePage';
import GenerateContactTracing from './components/GenerateContactTracingPage';
import StudentTutorial from './components/StudentTutorialPage';
import TeacherTutorial from './components/TeacherTutorialPage';
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
      isBookingManager: false,
      isSupportOfficer: false,
      hasDoneTutorial: true,
      loginError: false,
      configurationCompleted: false,
      lessons: [], //usata per bookableLessons, lezioni di Teacher (coursesLessons), lista totale lezioni (support officer)
      myBookedLessons: [],
      myWaitingBookedLessons: [],
      courses: [], //usata per lista corsi teacher, lista totale corsi (support officer)
      studentsBookings: [],
      studentsInfos: [], //usata per dati studenti a teacher, lista totale studenti (support officer)
      teachersInfos: [], //usata per lista totale teachers (support officer)
      classes: [], //usata per lista totale classi (support officer)
      enrollmentInfos: [], //usata per lista totale di iscrizione ai corsi (support officer)
      basicSchedules: [], //usata per memorizzare le combinazioni base corso-giorno/ora (support officer)
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
        console.log("Login completed " + user.accessLevel);
        this.setState({ user: user, loginError: false });
        if (user.accessLevel === 1) { //student
          this.setState({ isTeacher: false, isStudent: true,
            isBookingManager: false, isSupportOfficer: false, 
            hasDoneTutorial: user.hasDoneTutorial
          });
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
            isBookingManager: false, isSupportOfficer: false,
            hasDoneTutorial: user.hasDoneTutorial
          });
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
          this.setState({ isTeacher: false, isStudent: false,
            isBookingManager: true, isSupportOfficer: false});
          API.getLessonsStatistics()
            .then((lessons)=>{
              this.setState({lessons: lessons});
              API.getCoursesStatistics()
                .then((courses)=>{
                  this.setState({courses: courses, configurationCompleted: true});
                })
                .catch(function(e){console.log(e);})
            })
            .catch(function(e){console.log(e);})
        }
        if (user.accessLevel === 4) { //support officer
          this.setState({ isTeacher: false, isStudent: false,
            isBookingManager: false, isSupportOfficer: true});
          this.updateSupportOfficerData().then(() => {
            this.setState({configurationCompleted: true});
          });          
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState((state) => { return { ...state, user: null, loginError: e } });
      });
  }
  setTutorialCompleted = () => {
    API.setTutorialCompleted().then(() => {
      this.setState({hasDoneTutorial: true});
    })
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
      this.setState({ myWaitingBookedLessons: myWaitingBookedLessons });
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

      this.updateBookableLessons();
      this.updateMyBookedLessons();

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
  setStudentAsNotPresent = (scheduleId, studentId) => {
    API.setStudentAsNotPresent(scheduleId, studentId).then(() => {
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

  createNewCourse = (courseName, teacherId) => {
    API.createNewCourse(courseName, teacherId).then(() => {
      API.getAllCourses().then((coursesList) => {
        this.setState({courses: coursesList});
      }).catch((errorObj) => { console.log(errorObj); });
    }).catch((errorObj) => { console.log(errorObj); });  
  }
  createNewClassroom = (classroomName, maxSeats) => {
    API.createNewClass(classroomName, maxSeats).then(() => {
      API.getAllClassrooms().then((classesList) => {
        this.setState({classes: classesList});
      }).catch((errorObj) => { console.log(errorObj); });
    }).catch((errorObj) => { console.log(errorObj); });
  }
  createNewEnrollment = (studentId, courseId) => {
    API.createNewEnrollment(studentId, courseId).then(() => {
      API.getAllEnrollments().then((enrollementsList) => {
        this.setState({enrollmentInfos: enrollementsList});
      }).catch((errorObj) => { console.log(errorObj); });
    }).catch((errorObj) => { console.log(errorObj); });
  }
  createNewUser = (userId, fullName, email, password, type) => {
    API.createNewUser(userId, fullName, email, password, type).then(() => {
      if(type === 'student') {
        API.getAllStudents().then((studentsList) => {
          this.setState({studentsInfos: studentsList});
        }).catch((errorObj) => { console.log(errorObj); });
      }
      else if(type === 'teacher') {
        API.getAllTeachers().then((teachersList) => {
          this.setState({teachersInfos: teachersList});
        }).catch((errorObj) => { console.log(errorObj); }); 
      }
    }).catch((errorObj) => { console.log(errorObj); }); 
  }
  createNewLesson = (courseId, lessonStatus, lessonType, startDate, endDate, classroom) => {
    API.createNewLesson(courseId, lessonStatus, lessonType, startDate, endDate, classroom)
    .then(() => {
      API.getAllLessons().then((lessonsList) => {
        this.setState({lessons: lessonsList});
      }).catch((errorObj) => { console.log(errorObj); });  
    }).catch((errorObj) => { console.log(errorObj); });
  }
  editLesson = (scheduleId, courseId, lessonStatus, lessonType, startDate, endDate, classroom) => {
    API.editLesson(scheduleId, courseId, lessonStatus, lessonType, startDate, endDate, classroom)
    .then(() => {
      API.getAllLessons().then((lessonsList) => {
        this.setState({lessons: lessonsList});
      }).catch((errorObj) => { console.log(errorObj); });  
    })
  }
  createNewCourseSchedule = (courseId, day, startTime, endTime, classroom) => {
    API.createNewCourseSchedule(courseId, day, startTime, endTime, classroom).then(() => {

      API.getAllCoursesSchedules().then((schedules) => {
        this.setState({basicSchedules: schedules})
      }).catch((errorObj) => { console.log(errorObj); });

      API.getAllLessons().then((lessonsList) => {
        this.setState({lessons: lessonsList});
      }).catch((errorObj) => { console.log(errorObj); });  

    }).catch((errorObj) => { console.log(errorObj); });
  }
  editCourseSchedule = (scheduleId, courseId, day, startTime, endTime, classroom) => {
    API.editCourseSchedule(scheduleId, courseId, day, startTime, endTime, classroom).then(() => {

      API.getAllCoursesSchedules().then((schedules) => {
        this.setState({basicSchedules: schedules})
      }).catch((errorObj) => { console.log(errorObj); });

      API.getAllLessons().then((lessonsList) => {
        this.setState({lessons: lessonsList});
      }).catch((errorObj) => { console.log(errorObj); });  

    }).catch((errorObj) => { console.log(errorObj); });
  }
  deleteCourseSchedule = (scheduleId) => {
    API.deleteCourseSchedule(scheduleId).then(() => {

      API.getAllCoursesSchedules().then((schedules) => {
        this.setState({basicSchedules: schedules})
      }).catch((errorObj) => { console.log(errorObj); });

      API.getAllLessons().then((lessonsList) => {
        this.setState({lessons: lessonsList});
      }).catch((errorObj) => { console.log(errorObj); });  

    }).catch((errorObj) => { console.log(errorObj); });
  }
  uploadFileClassrooms= (file) => {
    API.uploadFileClassrooms(file).then(() => {
      API.getAllCourses().then((coursesList) => {
        this.setState({courses: coursesList});
      }).catch((errorObj) => { console.log(errorObj); });
    }).catch((errorObj) => { console.log(errorObj); });  
  }
  uploadFileCourses = (file) => {
    API.uploadFileCourses(file).then(() => {
      API.getAllCourses().then((coursesList) => {
        this.setState({courses: coursesList});
      }).catch((errorObj) => { console.log(errorObj); });
    }).catch((errorObj) => { console.log(errorObj); });  
  }
  uploadFileLessons = (file) => {
    API.uploadFileLessons(file)
    .then(() => {
      API.getAllCoursesSchedules().then((schedules) => {
        this.setState({basicSchedules: schedules})
      }).catch((errorObj) => { console.log(errorObj); });

      API.getAllLessons().then((lessonsList) => {
        this.setState({lessons: lessonsList});
      }).catch((errorObj) => { console.log(errorObj); }); 
    }).catch((errorObj) => { console.log(errorObj); });   
  }
  uploadFileStudents = (file) => {
    API.uploadFileStudents(file).then(() => {
      API.getAllStudents().then((studentsList) => {
        this.setState({studentsInfos: studentsList});
      }).catch((errorObj) => { console.log(errorObj); });
    }).catch((errorObj) => { console.log(errorObj); });
  }
  uploadFileTeachers = (file) => {
    API.uploadFileTeachers(file).then(() => {
      API.getAllTeachers().then((teachersList) => {
        this.setState({teachersInfos: teachersList});
      }).catch((errorObj) => { console.log(errorObj); });
    }).catch((errorObj) => { console.log(errorObj); });
  }
  uploadFileEnrollment = (file) => {
    API.uploadFileEnrollment(file).then(() => {
      API.getAllEnrollments().then((enrollementsList) => {
        this.setState({enrollmentInfos: enrollementsList})
      }).catch((errorObj) => { console.log(errorObj); });
    }).catch((errorObj) => { console.log(errorObj); });
  }
  updateSupportOfficerData = async () => {
    API.getAllClassrooms().then((classesList) => {
      this.setState({classes: classesList});
    }).catch((errorObj) => { console.log(errorObj); });

    API.getAllCourses().then((coursesList) => {
      this.setState({courses: coursesList});
    }).catch((errorObj) => { console.log(errorObj); });

    API.getAllStudents().then((studentsList) => {
      this.setState({studentsInfos: studentsList});
    }).catch((errorObj) => { console.log(errorObj); });

    API.getAllTeachers().then((teachersList) => {
      this.setState({teachersInfos: teachersList});
    }).catch((errorObj) => { console.log(errorObj); }); 

    API.getAllLessons().then((lessonsList) => {
      this.setState({lessons: lessonsList});
    }).catch((errorObj) => { console.log(errorObj); });  

    API.getAllEnrollments().then((enrollementsList) => {
      this.setState({enrollmentInfos: enrollementsList})
    }).catch((errorObj) => { console.log(errorObj); });

    API.getAllCoursesSchedules().then((schedules) => {
      this.setState({basicSchedules: schedules})
    }).catch((errorObj) => { console.log(errorObj); });
  }

  generateStudentTracing = (studentID, downloadType) => {
    API.generateStudentTracing(studentID, downloadType)
    .then(fileJSON => fileJSON.blob())
    .then((file) => {   
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${studentID}_studentContactTracing.${downloadType}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
  }
  generateTeacherTracing = (teacherID, downloadType) => {
    API.generateTeacherTracing(teacherID, downloadType)
    .then(fileJSON => fileJSON.blob())
    .then((file) => {   
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${teacherID}_teacherContactTracing.${downloadType}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
  }

  changeLocalTutorialFlag = (flag) => {
    this.setState({hasDoneTutorial: flag})
  }

  render() {
    const value = {
      user: this.state.user,
      loginError: this.state.loginError,
      isStudent: this.state.isStudent,
      isTeacher: this.state.isTeacher,
      isBookingManager: this.state.isBookingManager,
      isSupportOfficer: this.state.isSupportOfficer,
      hasDoneTutorial: this.state.hasDoneTutorial,
      loginUser: this.login,
      logoutUser: this.logout,
      configurationCompleted: this.state.configurationCompleted
    }
    return (
      <AuthContext.Provider value={value}>
        <>
          <Navbar changeLocalTutorialFlag={this.changeLocalTutorialFlag} />
          <Switch>
            {/* STUDENT */}
            <Route path='/myBookableLessonsList'>
              {!this.state.user ? <Redirect to='/login' /> : <LessonsList lessonsList={this.state.lessons}
                selectLessonFunction={this.bookLesson} courses={this.state.courses} />}
            </Route>
            <Route path='/myBookedLessonslist'>
              {!this.state.user ? <Redirect to='/login' /> : <MyLessonsList lessonsList={this.state.myBookedLessons}
                waitingBookings={this.state.myWaitingBookedLessons} selectLessonFunction={this.deleteLesson} courses={this.state.courses} />}
            </Route>
            <Route path='/studentTutorial'>
              {!this.state.user ? <Redirect to='/login' /> : <StudentTutorial setTutorialCompleted={this.setTutorialCompleted}/>}
            </Route>
            
            {/* TEACHER */}
            <Route path='/myCoursesLessonslist'>
              {!this.state.user ? <Redirect to='/login' /> : <MyCoursesLessonsStudents teacherCourses={this.state.courses}
                myTeachedCoursesLessons={this.state.lessons} studentsBookedToMyLessons={this.state.studentsBookings}
                myBookedStudentsInfos={this.state.studentsInfos} cancelLesson={this.cancelLesson}
                changeLessonToRemote={this.changeLessonToRemote} setStudentAsPresent={this.setStudentAsPresent}
                setStudentAsNotPresent={this.setStudentAsNotPresent}/>}
            </Route>
            <Route path='/teacherTutorial'>
              {!this.state.user ? <Redirect to='/login' /> : <TeacherTutorial setTutorialCompleted={this.setTutorialCompleted}/>}
            </Route>
            
            {/* BOOKING MANAGER */}
            <Route path='/monitorUsage'>
              {!this.state.user ? <Redirect to='/login' /> : <MonitorUsage lessons={this.state.lessons}
                courses={this.state.courses}/>}
            </Route>
            <Route path='/generateContactTracing'>
              {!this.state.user ? <Redirect to='/login' /> : <GenerateContactTracing
                generateStudentTracing={this.generateStudentTracing} generateTeacherTracing={this.generateTeacherTracing}/>}
            </Route>

            {/* SUPPORT OFFICER */}
            <Route path='/configureStudentsList'>
              {!this.state.user ? <Redirect to='/login' /> : <ConfigureUsers type={"student"} usersList={this.state.studentsInfos}
                createNewUser={this.createNewUser} uploadFileUser={this.uploadFileStudents}/>}
            </Route>
            <Route path='/configureCoursesList'>
              {!this.state.user ? <Redirect to='/login' /> : <ConfigureCourses coursesList={this.state.courses} teachersList={this.state.teachersInfos}
                basicSchedules={this.state.basicSchedules} createNewCourseSchedule={this.createNewCourseSchedule}
                editCourseSchedule={this.editCourseSchedule} deleteCourseSchedule={this.deleteCourseSchedule}
                createNewCourse={this.createNewCourse} uploadFileCourses={this.uploadFileCourses}
                classroomssList={this.state.classes}/>}
            </Route>
            <Route path='/configureTeachersList'>
              {!this.state.user ? <Redirect to='/login' /> : <ConfigureUsers type={"teacher"}  usersList={this.state.teachersInfos}
                createNewUser={this.createNewUser} uploadFileUser={this.uploadFileTeachers}/>}
            </Route>
            <Route path='/configureLessonsList'>
              {!this.state.user ? <Redirect to='/login' /> : <ConfigureLessons lessonsList={this.state.lessons}
                coursesList={this.state.courses} classesList={this.state.classes} createNewLesson={this.createNewLesson}
                editLesson={this.editLesson} uploadFileLessons={this.uploadFileLessons}/>}
            </Route>
            <Route path='/configureClassroomsList'>
              {!this.state.user ? <Redirect to='/login' /> : <ConfigureClassrooms classesList={this.state.classes}
                createNewClassroom={this.createNewClassroom} uploadFileClassrooms={this.uploadFileClassrooms}/>}
            </Route>
            <Route path='/configureClassesList'>
              {!this.state.user ? <Redirect to='/login' /> : <ConfigureClasses courses={this.state.courses}
                studentsInfos={this.state.studentsInfos} enrollmentInfos={this.state.enrollmentInfos}
                createNewEnrollment={this.createNewEnrollment} uploadFileEnrollment={this.uploadFileEnrollment}/>}
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
