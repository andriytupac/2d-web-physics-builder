import React from 'react';
import {/* Switch , */ withRouter,/* Route, */useRouteMatch } from 'react-router-dom';
// import ContainerRouter from './ContainerRouter';
import LeftSideBar from '../leftSideBar';

/*Client part*/
import MatterDemo from '../../matterDemo';


const RootRouter = props => {
  let match = useRouteMatch("/");
  //console.log(match)
  if(match){
    return (<LeftSideBar><MatterDemo/></LeftSideBar>)
  }else {
    return <LeftSideBar></LeftSideBar>
  }
  //return
  /*return (
      <Switch>
        <ContainerRouter {...props} path="/"  component={Matter}>
          <Switch>
            <Route path="/t" {...props} component={MatterDemo} />
          </Switch>
        </ContainerRouter>
      </Switch>
    );*/
};


export default withRouter(RootRouter);
