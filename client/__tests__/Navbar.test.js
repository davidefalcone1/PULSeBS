import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import NavBar from '../src/components/Navbar';
import { BrowserRouter } from 'react-router-dom';
import UserData from '../src/API/UserData';

describe('Navbar', ()=>{
    test('Navbar renders correctly when user is a student', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{isStudent: true, user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}}>
                    <NavBar/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('Navbar renders correctly when user is a teacher', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{isTeacher: true, user: new UserData(1, '123456', 'Mario Rossi', 'mario.rossi@polito.it')}}>
                    <NavBar/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('Navbar renders correctly when user is the booking manager', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{isBookingManager: true, user: new UserData(1, '123456', 'Mario Rossi', 'mario.rossi@polito.it')}}>
                    <NavBar/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('Navbar renders correctly when user is the support officier', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{isSupportOfficier: true, user: new UserData(1, '123456', 'Mario Rossi', 'mario.rossi@polito.it')}}>
                    <NavBar/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});