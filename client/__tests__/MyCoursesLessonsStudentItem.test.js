import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import MyCoursesLessonsStudentItem from '../src/components/MyCoursesLessonsStudentItem';
import { BrowserRouter } from 'react-router-dom';
import UserData from '../src/API/UserData';
import BookingData from '../src/API/BookingData';

describe('MyCoursesLessonsStudentItem', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')}}>
                    <MyCoursesLessonsStudentItem student={new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it')} booking={new BookingData(1, '', '12345', 1, 0)} setStudentAsPresent={()=>{}}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});