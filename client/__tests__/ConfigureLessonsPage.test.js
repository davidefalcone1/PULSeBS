import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import ConfigureLessonsPage from '../src/components/ConfigureLessonsPage';
import { BrowserRouter } from 'react-router-dom';
import LessonData from '../src/API/LessonData';
import UserData from '../src/API/UserData';
import CourseData from '../src/API/CourseData';
import ClassroomData from '../src/API/ClassroomData';
import moment from 'moment';

describe('ConfigureLessonsPage', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}}>
                    <ConfigureLessonsPage classesList={[new ClassroomData(1, 'A1', 80)]} coursesList={[new CourseData('XY123', 'Software engineering 2', '654321', 2, 3, 5, 6, 7, 3, 5, 7)]} lessonsList={[new LessonData(1, 'XY123', moment('2020-09-08T14:30'), moment('2020-09-08T17:00'), 9, 90, false, true, 'A1', 100, 4, 33, 0)]} createNewLesson={()=>{}} editLesson={()=>{}} uploadFileLessons={()=>{}}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});