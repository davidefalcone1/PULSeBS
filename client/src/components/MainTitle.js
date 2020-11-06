import React from 'react';

const mainTitle = (props) => {
    
    return (
        <div className="row main-from-nav justify-content-center">
		    <h2 className="navbar-center text-center">
			    <span className="badge main-title-color" id="main_title">{props.mainTitle}</span>
            </h2>
	    </div>
    );

}

export default mainTitle;