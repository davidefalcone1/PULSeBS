import React from 'react';
import ConfigureLessonsPage from '../src/components/ConfigureLessonsPage';
import LessonData from '../src/API/LessonData';
import UserData from '../src/API/UserData';
import CourseData from '../src/API/CourseData';
import ClassroomData from '../src/API/ClassroomData';
import moment from 'moment';

Date.now = jest.fn(() => 1482363367071);//Avoid dynamic content on the page

describe('ConfigureLessonsPage', ()=>{
    let component;
    beforeAll(()=>{
        component = mount(
            <ConfigureLessonsPage classesList={[new ClassroomData(1, 'A1', 80)]} coursesList={[new CourseData('XY123', 'Software engineering 2', '654321', 2, 3, 5, 6, 7, 3, 5, 7)]} lessonsList={[new LessonData(1, 'XY123', moment('2020-09-08T14:30'), moment('2020-09-08T17:00'), 9, 90, false, true, 'A1', 100, 4, 33, 0)]} createNewLesson={()=>{}} editLesson={()=>{}} uploadFileLessons={()=>{}}/>,
            {
                context: {user: new UserData(1, '12345', 'Davide Falcone', 'davidefalcone@polito.it', true)}
            }
        );
    });
    test('lesson modal', ()=>{
        component.find('#activateModalOfLessons').at(0).simulate('click');
        expect(component).toContainMatchingElement('#newCourseForm');
        const form = component.find('#newCourseForm').at(0);
        form.find('select').at(0).simulate('change', {target: {value: 'Software engineering 2'}});
        form.find('select').at(1).simulate('change', {target: {value: 'Active'}});
        form.find('select').at(2).simulate('change', {target: {value: 'Remote'}});
        form.find('select').at(3).simulate('change', {target: {value: '1 - 120'}});
        form.find('input').at(0).simulate('change', {target: {value: 'new-value'}});
        form.find('input').at(1).simulate('change', {target: {value: 'new-value'}});
        form.simulate('submit');
    });
    test('file lesson modal', ()=>{
        component.find('#uploadFileOfLessons').at(0).simulate('click');
        expect(component).toContainMatchingElement('#newLessonFormFile');
        const form = component.find('#newLessonFormFile').at(0);
        form.simulate('submit');
    });
});