import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import ConfigureCourseScheduleItem from '../src/components/ConfigureCourseScheduleItem';
import { BrowserRouter } from 'react-router-dom';
import CourseBasicSchedule from '../src/API/CourseBasicSchedule';
import UserData from '../src/API/UserData';
import moment from 'moment';

describe('ConfigureCoursesItem', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}}>
                    <ConfigureCourseScheduleItem schedule={new CourseBasicSchedule(1, 1, 'Mon', moment('2020-09-08T14:30').format('HH:mm'), moment('2020-09-08T17:00').format('HH:mm'), 'A1')} editCourseSchedule={()=>{}} deleteCourseSchedule={()=>{}}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});