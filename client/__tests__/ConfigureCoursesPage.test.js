import React from 'react';
import ConfigureCoursesPage from '../src/components/ConfigureCoursesPage';
import CourseData from '../src/API/CourseData';
import UserData from '../src/API/UserData';
import { mount } from 'enzyme';
import CourseBasicSchedule from '../src/API/CourseBasicSchedule';
import ConfigureCourseScheduleItem from '../src/components/ConfigureCourseScheduleItem';
import ClassroomData from '../src/API/ClassroomData';
import Accordion from 'react-bootstrap/Accordion';

describe('ConfigureCoursesPage', ()=>{
    const component = mount(
        <ConfigureCoursesPage coursesList={[new CourseData('XY123', 'Software engineering 2', '654321', 2, 3, 5, 6, 7, 3, 5, 7)]} teachersList={[new UserData(1, '654321', 'Mario Rossi', 'mario.rossi@polito.it')]} createNewCourse={()=>{}} uploadFileCourses={()=>{}} basicSchedules={[new CourseBasicSchedule(1, 'XY123', 'Mon', '02:00', '05:00', 'A1')]} editCourseSchedule={()=>{}} createNewCourseSchedule={()=>{}} deleteCourseSchedule={()=>{}} classroomssList={[new ClassroomData(1, 'A1', 90)]}/>,
        {
            context: {user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}
        }
    );
    test('Renders', ()=>{
        expect(component).toContainMatchingElement('#XY123');
    });
    test('Add new Modal renders', ()=>{
        component.find('#activateModalOfCourses').at(0).simulate('click'); // open Modal
        component.find('input').at(0).simulate('change', {target: {value: 'My new value'}}); //Type something
        component.find('select').at(0).simulate('change', {target: {value: '654321'}}); //Type something
    });
    test('Upload file Modal renders', ()=>{
        component.find('#uploadFileOfCourses').at(0).simulate('click'); // open modal
    });
    test('Create new schedule Modal renders', (done)=>{
        component.find('.card-header').find('button').at(0).simulate('click'); //open accordion
        setTimeout(()=>{ //wait for accordion to open
            component.find('#buttonFieldOflessonXY123').at(0).simulate('click'); //open modal
            component.find('input').at(0).simulate('change', {target: {value: 'My new value'}}); //Type something
            component.find('input').at(1).simulate('change', {target: {value: 'My new value'}}); //Type something
            component.find('select').at(0).simulate('change', {target: {value: 'Monday'}}); 
            component.find('select').at(1).simulate('change', {target: {value: '1 - 120'}}); 
            component.find('#newCourseForm').at(0).simulate('submit');
            done();
        }, 500);
    });
    test('Open course accordion', (done)=>{
        component.find('.card-header').find('button').at(0).simulate('click'); //open accordion
        setTimeout(()=>{
            expect(component).toContainExactlyOneMatchingElement(ConfigureCourseScheduleItem);
            done();
        }, 500);
    });
});