import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import ConfigureClassroomsItem from '../src/components/ConfigureClassroomsItem';
import { BrowserRouter } from 'react-router-dom';
import ClassroomData from '../src/API/ClassroomData';

describe('ConfigureClassroomsItem', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{}}>
                    <ConfigureClassroomsItem class={new ClassroomData(1, 'A1', 70)}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});