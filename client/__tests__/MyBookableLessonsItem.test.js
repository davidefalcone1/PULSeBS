import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import MyBookableLessonsItem from '../src/components/MyBookableLessonsItem';
import { BrowserRouter } from 'react-router-dom';
import UserData from '../src/API/UserData';
import LessonData from '../src/API/LessonData';
import moment from 'moment';

Date.now = jest.fn(() => 1482363367071);//Avoid dynamic content on the page

describe('MyBookableLessonsItem', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}}>
                    <MyBookableLessonsItem lesson={new LessonData(1, 'XY123', moment('2020-09-08T14:30'), moment('2020-09-08T17:00'), 9, 90, false, true, 'A1', 100, 4, 33, 0)} selectLessonFunction={()=>{}} updateModalMessage={()=>{}}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});