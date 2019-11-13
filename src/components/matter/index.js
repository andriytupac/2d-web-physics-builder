import React from 'react';
import LeftSideBar from '../leftSideBar';

function Matter(props) {
    return (
      <React.Fragment>
        <LeftSideBar>
          {props.children}
        </LeftSideBar>
        {/*<div className="container">{props.children}</div>*/}
      </React.Fragment>
    )
}
export default Matter
