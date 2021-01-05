import React from 'react';
import GenerateContactTracingPage from '../src/components/GenerateContactTracingPage';
import UserData from '../src/API/UserData';
import {mount} from 'enzyme';

describe('GenerateContactTracingPage', ()=>{
    let component;
    beforeAll(()=>{
        component = mount(
            <GenerateContactTracingPage generateStudentTracing={()=>{}} generateTeacherTracing={()=>{}}/>
        ,{
            context: {user: new UserData(1, '12345', 'Davide Falcone', 'davidefalcone@polito.it', true)}
        });
    });
    test('student report', ()=>{
        const form = component.find('#studentForm');
        form.find('input').simulate('change', {target: {value: '1'}});
        form.find('select').simulate('change', {target: {value: 'PDF'}});
        form.at(0).simulate('submit');
    });
    test('teacher report', ()=>{
        const form = component.find('#teacherForm');
        form.find('input').simulate('change', {target: {value: '1'}});
        form.find('select').simulate('change', {target: {value: 'PDF'}});
        form.at(0).simulate('submit');
    });
});
