import React from 'react';
import MyBookedLessonsPage from '../src/components/MyBookedLessonsPage';
import UserData from '../src/API/UserData';
import LessonData from '../src/API/LessonData';
import CourseData from '../src/API/CourseData';
import moment from 'moment';

Date.now = jest.fn(() => 1482363367071);//Avoid dynamic content on the page

describe('MyBookedLessonsPage', ()=>{
    let component;
    beforeAll(()=>{
        component = mount(
            <MyBookedLessonsPage courses={[new CourseData('XY123', 'course1', '654321', 2, 3, 5, 6, 7, 3, 5, 7), new CourseData('XY122', 'course2', '654321', 2, 3, 5, 6, 7, 3, 5, 7)]} lessonsList={[new LessonData(1, 'XY123', moment().add(1, 'days'), moment().add(1, 'days').add(1, 'hours'), 9, 90, false, true, 'A1', 100, 4, 33, 0)]} waitingBookings={[new LessonData(2, 'XY123', moment().add(2, 'days'), moment().add(2, 'days').add(1, 'hours'), 9, 90, false, true, 'A1', 100, 4, 33, 0)]} selectLessonFunction={()=>{}} updateMyBookedLessonsList={()=>{}}/>,
            {
                context: {user: new UserData(1, '12345', 'Davide Falcone', 'davidefalcone@polito.it', true)}
            }
        );
    });
    test('Renders correctly', ()=>{
        expect(component).toContainMatchingElement('#course-course1');
        expect(component).toContainMatchingElement('#course-course2');
    });
    test('filter', ()=>{
        const form = component.find('#lessonFilterForm').at(0);
        form.find('select').simulate('change', {target: {value: 'course1'}});
        form.find('select').simulate('change', {target: {value: 'Select course name'}});
    });
    test('accordion booked lessons', (done)=>{
        component.find('#bookedLessons').simulate('click');
        setTimeout(()=>{
            component.update();
            expect(component).toContainMatchingElement('.collapse.show');
            done();
        }, 500);
    });
    test('accordion pending lessons', (done)=>{
        component.find('#pendingBookedLessons').simulate('click');
        setTimeout(()=>{
            component.update();
            expect(component).toContainMatchingElement('.collapse.show');
            done();
        }, 500);
    });
    test('open calendar', ()=>{
        component.find('img').at(1).simulate('click');
        expect(component).not.toContainMatchingElement('.accordion');
    })
});