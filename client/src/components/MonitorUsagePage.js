import React from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../_services/AuthContext';

const monitorUsagePage = (props) => {
  return(
    <AuthContext.Consumer>
      {(context) => (
        <>        
          {context.user && 
            <>
            </>}
          {!context.user && <Redirect to="/login"/>}
      </>
    )}
    </AuthContext.Consumer>
  );
}

export default monitorUsagePage;
