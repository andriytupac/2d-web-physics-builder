import React from 'react'
import { Header, Accordion, Menu, Segment, Sidebar, Icon, Button } from 'semantic-ui-react'
import { useStoreState, useStoreActions } from 'easy-peasy';
import Matter from 'matter-js';

import './style.scss'

const World = Matter.World;
const Events = Matter.Events;
let inspector;

// List of bodies
const MenageElements = props => {
  const { obj } = props;
  const world = useStoreState(state => state.general.render);

  const deleteObj = () =>{
    World.remove(world, obj)
  };
  return (
    <Button icon onClick={deleteObj}>
      <Icon name='trash' />
    </Button>
  )
};

const SidebarExampleSidebar = (props) => {

  //Store
  const world = useStoreState(state => state.general.render);
  const menuLeft = useStoreState(state => state.general.menuLeft);
  const general = useStoreState(state => state.general.render);

  const bodiesState = general.bodies || [];
  const constraintState = general.constraints || [];

  console.log(general)

  //Elements inspector
  const runInspector = value => {
    inspector = value;
    Events.on(inspector.render, 'afterRender', afterRender);
  };
  //Get active body
  const activateBody = (event,data) => {
    const key = data.content.split(' ')
    const findObject = bodiesState.find((val)=>{
      if(val.id == key[0]){
        return val
      }
    });
    inspector.selected[0]={ data: findObject}
  };
  //Get active constraint
  const activateConstraint = (event,data) => {
    const key = data.content.split(' ')
    const findObject = constraintState.find((val)=>{
      if(val.id == key[0]){
        return val
      }
    });
    inspector.selected[0]={ data: findObject}
  };
  //List of bodies
  const bodies = bodiesState.map(val=> {
    return {
      key: `body-${val.id}`,
      title:`${val.id} ${val.label}`,
      content: {
        content: <MenageElements obj={val}/>
      }
    }
  });
  const LevelBodies = (
    <div>
      <Accordion.Accordion onTitleClick={activateBody} panels={bodies} />
    </div>
  );
  //List of constraints
  const constraints = constraintState.map(val=> {
    return {
      key: `constaraint-${val.id}`,
      title:`${val.id} ${val.label}`,
      content: {
        content: <MenageElements obj={val}/>
      }
    }
  });
  const LevelConstraints = (
    <div>
      <Accordion.Accordion onTitleClick={activateConstraint} panels={constraints} />
    </div>
  );

  const level2Panels = [
    { key: 'panel-2a', title: 'Level 2A', content: 'Level 2A Contents' },
    { key: 'panel-2b', title: 'Level 2B', content: 'Level 2B Contents' },
  ];

  const Level2Content = (
    <div>
      <Accordion.Accordion panels={level2Panels} />
    </div>
  );

  const rootPanels = [
    { key: 'bodies', title: `Bodies (${bodies.length})`, content: {content: LevelBodies } },
    { key: 'composites', title: 'Composites', content: { content: Level2Content } },
    { key: 'constraints', title: `Constraints (${constraints.length})`, content: { content: LevelConstraints } },
  ];
  const AccordionExampleNested = () => (
    <Accordion panels={rootPanels} styled />
  );

  const afterRender = function (param) {
    var renderController = inspector.render.controller,
      context = inspector.render.context;
    if (renderController.inspector) renderController.inspector(inspector, context);
  };



  const childrenWithProps = React.Children.map(props.children, child => {
      return React.cloneElement(child, { runInspector: runInspector })
    }
  );

  return (
    <Sidebar.Pushable as={Segment}>
      <Sidebar
        as={Menu}
        animation='overlay'
        icon='labeled'
        inverted
        // onHide={() => turnMenu()}
        vertical
        visible={menuLeft}
        width='wide'
      >
        {AccordionExampleNested()}
        {/*<Menu.Item as='a'>
          <Icon name='home' />
          Home
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='gamepad' />
          Games
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='camera' />
          Channels
        </Menu.Item>*/}
      </Sidebar>

      <Sidebar.Pusher>
        <Segment basic >
          {childrenWithProps}
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}

export default SidebarExampleSidebar
