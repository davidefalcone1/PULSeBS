import React from 'react';

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
