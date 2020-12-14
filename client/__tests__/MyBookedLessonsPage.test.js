import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import MyBookedLessonsPage from '../src/components/MyBookedLessonsPage';
import { BrowserRouter } from 'react-router-dom';
import UserData from '../src/API/UserData';
import LessonData from '../src/API/LessonData';
import CourseData from '../src/API/CourseData';
import moment from 'moment';

describe('MyBookedLessonsPage', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}}>
                    <MyBookedLessonsPage courses={[new CourseData('XY123', 'Software engineering 2', '654321', 2, 3, 5, 6, 7, 3, 5, 7)]} lessonsList={[new LessonData(1, 'XY123', moment().add(1, 'days'), moment().add(1, 'days').add(1, 'hours'), 9, 90, false, true, 'A1', 100, 4, 33, 0)]} selectLessonFunction={()=>{}} updateMyBookedLessonsList={()=>{}}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});