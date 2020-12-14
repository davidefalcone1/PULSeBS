import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import ConfigureUsersPage from '../src/components/ConfigureUsersPage';
import { BrowserRouter } from 'react-router-dom';
import UserData from '../src/API/UserData';

describe('ConfigureUsersPage', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}}>
                    <ConfigureUsersPage usersList={[new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')]} createNewUser={()=>{}} type={'student'} uploadFileUser={()=>{}} uploadFileEnrollment={()=>{}}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});