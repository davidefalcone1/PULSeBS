import React from 'react';
import StudentTutorialPage from '../src/components/StudentTutorialPage';
import UserData from '../src/API/UserData';

describe('StudentTutorialPage', ()=>{
    test('Renders correctly', ()=>{
        const component = mount(
            <StudentTutorialPage setTutorialCompleted={()=>{}}/>,
            {
                context: {
                    user: new UserData(1, '12345', 'Davide Falcone', 'davide.falcone@polito.it'),
                    hasDoneTutorial: false
                }
            }
        );
        let i=0;
        for(;i < 8; i++){
            component.find('img').simulate('click');
        }
    });
});