import React from 'react';
import renderer from 'react-test-renderer';
import { AuthContext } from '../src/_services/AuthContext';
import GenerateContactTracingPage from '../src/components/GenerateContactTracingPage';
import { BrowserRouter } from 'react-router-dom';

describe('GenerateContactTracingPage', ()=>{
    test('Renders correctly', ()=>{
        const component = renderer.create(
            <BrowserRouter>
                <AuthContext.Provider value={{}}>
                    <GenerateContactTracingPage generateStudentTracing={()=>{}} generateTeacherTracing={()=>{}}/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});