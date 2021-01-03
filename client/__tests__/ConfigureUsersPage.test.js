import React from 'react';
import ConfigureUsersPage from '../src/components/ConfigureUsersPage';
import { mount } from 'enzyme';
import UserData from '../src/API/UserData';

describe('ConfigureUsersPage', ()=>{
    let component;
    beforeAll(()=>{
        component = mount(
            <ConfigureUsersPage usersList={[new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')]} createNewUser={()=>{}} type={'student'} uploadFileUser={()=>{}} uploadFileEnrollment={()=>{}}/>,
            {
                context: {user: new UserData(1, '12345', 'Davide Falcone', 'davidefalcone@polito.it', true)}
            }
        );
    });
    test('create new user', ()=>{
        component.find('#activateModalOfUsers').at(0).simulate('click');
        expect(component).toContainMatchingElement('#newUserForm');
        const form = component.find('#newUserForm').at(0);
        form.find('input').at(0).simulate('change', {target: {value: 'new value'}});
        form.find('input').at(1).simulate('change', {target: {value: 'new value'}});
        form.find('input').at(2).simulate('change', {target: {value: 'new value'}});
        form.find('input').at(3).simulate('change', {target: {value: 'new value'}});
        form.simulate('submit');
    });
    test('upload file', ()=>{
        component.find('#uploadFileOfUsers').at(0).simulate('click');
        expect(component).toContainMatchingElement('#newUserFormFile');
        component.find('#newUserFormFile').at(0).simulate('submit');
    });
});