import React from 'react';
import {/* Switch , */ withRouter,/* Route, */useRouteMatch } from 'react-router-dom';
// import ContainerRouter from './ContainerRouter';
import LeftSideBar from '../leftSideBar';

/*Client part*/
import MatterDemo from '../../matterDemo';
import BallPool from '../../matterDemo/ballPool';
import Page404 from '../../pages/page404';
import Bridge from '../../matterDemo/bridge';
import Catapult from '../../matterDemo/catapult';
import Chains from '../../matterDemo/chains';
import Concave from '../../matterDemo/concave';
import Constraints from '../../matterDemo/constraints';
import Manipulation from '../../matterDemo/manipulation';
import Pyramid from '../../matterDemo/pyramid';
import Restitution from '../../matterDemo/restitution';
import Sprites from '../../matterDemo/sprites';
import WreckingBall from '../../matterDemo/wreckingBall';


const RootRouter = props => {
  // let match = useRouteMatch("/");
  let examples = useRouteMatch("/examples/:id");
  if(examples && examples.isExact){
    return (
      <>
      { examples.params.id === 'ballPool' &&  <LeftSideBar><BallPool/></LeftSideBar>}
      { examples.params.id === 'bridge' &&  <LeftSideBar><Bridge/></LeftSideBar>}
      { examples.params.id === 'catapult' &&  <LeftSideBar><Catapult/></LeftSideBar>}
      { examples.params.id === 'chains' &&  <LeftSideBar><Chains/></LeftSideBar>}
      { examples.params.id === 'concave' &&  <LeftSideBar><Concave/></LeftSideBar>}
      { examples.params.id === 'constraints' &&  <LeftSideBar><Constraints/></LeftSideBar>}
      { examples.params.id === 'manipulation' &&  <LeftSideBar><Manipulation/></LeftSideBar>}
      { examples.params.id === 'pyramid' &&  <LeftSideBar><Pyramid/></LeftSideBar>}
      { examples.params.id === 'restitution' &&  <LeftSideBar><Restitution/></LeftSideBar>}
      { examples.params.id === 'sprites' &&  <LeftSideBar><Sprites/></LeftSideBar>}
      { examples.params.id === 'wreckingBall' &&  <LeftSideBar><WreckingBall/></LeftSideBar>}
      { examples.params.id === 'emptyArea' &&  <LeftSideBar><MatterDemo/></LeftSideBar>}
      </>
      )
  } else {
    return <Page404/>
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
