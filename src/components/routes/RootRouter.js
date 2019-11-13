import React from 'react';
import { Switch, withRouter, Route, useRouteMatch } from 'react-router-dom';
import ContainerRouter from './ContainerRouter';
import LeftSideBar from '../leftSideBar';
//import HomeMatter from '../matter/homeMatter';

/*Client part*/
import Matter from '../matter';
import HomeMatter from '../matter/homeMatter';


const RootRouter = props => {
  let match = useRouteMatch("/");
  //console.log(match)
  if(match){
    return (<LeftSideBar><HomeMatter/></LeftSideBar>)
  }else {
    return <LeftSideBar></LeftSideBar>
  }
  //return
  /*return (
      <Switch>
        <ContainerRouter {...props} path="/"  component={Matter}>
          <Switch>
            <Route path="/t" {...props} component={HomeMatter} />
          </Switch>
        </ContainerRouter>
      </Switch>
    );*/
};


export default withRouter(RootRouter);
