import React from 'react';
import LoginForm from '../src/components/LoginForm';

describe('LoginForm', ()=>{
    let component;
    beforeAll(()=>{
        component = mount(
        <AuthContext.Provider value={{ user: undefined, loginUser: function(user, pass){return Promise.resolve()}, configurationCompleted: false }}>
            <LoginForm />
        </AuthContext.Provider>);
    });
    it('renders', ()=>{
        expect(component).toContainMatchingElement('#loginForm');
    });
    it('form', ()=>{
        const form = component.find('#loginForm').at(0);
        form.find('input').at(0).simulate('change', {target: {value: 'new value'}});
        form.find('input').at(1).simulate('change', {target: {value: 'new value'}});
        form.simulate('submit');
    });
});