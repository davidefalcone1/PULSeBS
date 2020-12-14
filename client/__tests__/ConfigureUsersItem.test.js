import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import ConfigureUsersItem from '../src/components/ConfigureUsersItem';
import { BrowserRouter } from 'react-router-dom';
import UserData from '../src/API/UserData';

describe('ConfigureUsersItem', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}}>
                    <ConfigureUsersItem user={new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});