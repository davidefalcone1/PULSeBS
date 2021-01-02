import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import TeacherTutorialPage from '../src/components/TeacherTutorialPage';
import { BrowserRouter } from 'react-router-dom';
import UserData from '../src/API/UserData';
describe('TeacherTutorialPage', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}}>
                    <TeacherTutorialPage setTutorialCompleted={()=>{}}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});