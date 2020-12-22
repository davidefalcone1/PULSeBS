import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import MyBookedLessonsItem from '../src/components/MyBookedLessonsItem';
import { BrowserRouter } from 'react-router-dom';
import UserData from '../src/API/UserData';
import LessonData from '../src/API/LessonData';
import moment from 'moment';

Date.now = jest.fn(() => 1482363367071);//Avoid dynamic content on the page

describe('MyBookedLessonsItem', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}}>
                    <MyBookedLessonsItem lesson={new LessonData(1, 'XY123', moment().add(1, 'days'), moment().add(1, 'days').add(1, 'hours'), 9, 90, false, true, 'A1', 100, 4, 33, 0)} selectLessonFunction={()=>{}}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});