import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import ConfigureClassroomsPage from '../src/components/ConfigureClassroomsPage';
import { BrowserRouter } from 'react-router-dom';
import ClassroomData from '../src/API/ClassroomData';
import UserData from '../src/API/UserData';

describe('ConfigureClassroomsPage', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}}>
                    <ConfigureClassroomsPage classesList={[new ClassroomData(1, 'A1', 70)]} createNewClass={()=>{}} uploadFileClassrooms={()=>{}}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});