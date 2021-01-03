import React from 'react';
import ConfigureClassesPage from '../src/components/ConfigureClassesPage';
import CourseData from '../src/API/CourseData';
import UserData from '../src/API/UserData';

describe('ConfigureClassesPage', ()=>{
    let component;
    beforeAll(()=>{
        component = mount(
            <ConfigureClassesPage createNewEnrollment={()=>{}} uploadNewEnrollment={()=>{}} enrollmentInfos={[{courseId: 'XY123', studentId: '12345'}]} courses={[new CourseData('XY123', 'Software engineering 2', '654321', 2, 3, 5, 6, 7, 3, 5, 7)]} studentsInfos={[new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')]}/>,
            {
                context: {user: new UserData(1, '12345', 'Davide Falcone', 'davidefalcone@polito.it', true)}
            }
        );
    });
    test('classroom modal', ()=>{
        component.find('#activateModalOfClasses').at(0).simulate('click');
        expect(component).toContainMatchingElement('#newClassForm');
        const form = component.find('#newClassForm').at(0);
        form.find('select').at(0).simulate('change', {target: {value: 'Software engineering 2'}});
        form.find('select').at(1).simulate('change', {target: {value: 'Davide Falcone'}});
        form.simulate('submit');
    });
    test('file classroom modal', ()=>{
        component.find('#uploadFileOfClasses').at(0).simulate('click');
        expect(component).toContainMatchingElement('#newClassFormFile');
        const form = component.find('#newClassFormFile').at(0);
        form.simulate('submit');
    });
});

