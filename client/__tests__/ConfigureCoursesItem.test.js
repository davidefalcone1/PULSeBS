import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import ConfigureCoursesItem from '../src/components/ConfigureCoursesItem';
import { BrowserRouter } from 'react-router-dom';
import CourseData from '../src/API/CourseData';
import UserData from '../src/API/UserData';

describe('ConfigureCoursesItem', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}}>
                    <ConfigureCoursesItem course={new CourseData('XY123', 'Software engineering 2', '654321', 2, 3, 5, 6, 7, 3, 5, 7)} teachers={[new UserData(1, '654321', 'Mario Rossi', 'mario.rossi@polito.it')]}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});