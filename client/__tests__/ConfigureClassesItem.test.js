import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import ConfigureClassesItem from '../src/components/ConfigureClassesItem';
import { BrowserRouter } from 'react-router-dom';
import CourseData from '../src/API/CourseData';
import UserData from '../src/API/UserData';

describe('ConfigureClassesItem', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{user: undefined}}>
                    <ConfigureClassesItem enrollment={{courseId: 'XY123', studentId: '12345'}} courses={[new CourseData('XY123', 'Software engineering 2', '654321', 2, 3, 5, 6, 7, 3, 5, 7)]} students={[new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')]}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});