import React from 'react';
import ConfigureClassroomsPage from '../src/components/ConfigureClassroomsPage';
import ClassroomData from '../src/API/ClassroomData';
import UserData from '../src/API/UserData';

describe('ConfigureClassroomsPage', ()=>{
    let component;
    beforeAll(()=>{
        component = mount(
            <ConfigureClassroomsPage classesList={[new ClassroomData(1, 'A1', 70)]} createNewClass={()=>{}} uploadFileClassrooms={()=>{}}/>,
            {
                context: {user: new UserData(1, '12345', 'Davide Falcone', 'davidefalcone@polito.it', true)}
            }
        );
    });
    test('classroom modal', ()=>{
        component.find('#activateModalOfClasses').at(0).simulate('click');
        expect(component).toContainMatchingElement('#newClassForm');
        const form = component.find('#newClassForm').at(0);
        form.find('input').at(0).simulate('change', {target: {value: 'S2'}});
        form.find('input').at(1).simulate('change', {target: {value: '90'}});
        form.simulate('submit');
    });
    test('file classroom modal', ()=>{
        component.find('#uploadFileOfClasses').at(0).simulate('click');
        expect(component).toContainMatchingElement('#newClassFormFile');
        const form = component.find('#newClassFormFile').at(0);
        form.simulate('submit');
    });
});
