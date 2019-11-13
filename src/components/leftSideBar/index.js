import React from 'react'
import { Header, Accordion, Menu, Segment, Sidebar, Icon, Button } from 'semantic-ui-react'
import { useStoreState, useStoreActions } from 'easy-peasy';
import Matter from 'matter-js';

import './style.scss'

const World = Matter.World;
const Events = Matter.Events;

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
let inspector;

const SidebarExampleSidebar = (props) => {

  const world = useStoreState(state => state.general.render);
  console.log(world)
  // store
  const menuLeft = useStoreState(state => state.general.menuLeft);
  const general = useStoreState(state => state.general.render);
  const turnMenuLeft = useStoreActions(
    actions => actions.general.turnMenuLeft
  );
  const runInspector = value => {
    inspector = value;
    console.log(value)
    Events.on(inspector.render, 'afterRender', afterRender);
  }

  const bodiesState = general.bodies || [];
  const turnMenu = () => {
    turnMenuLeft(!menuLeft);
  };
  const activateBlock = (event,data) => {
    const key = data.content.split(' ')
    const findObject = world.bodies.find((val)=>{
      if(val.id == key[0]){
        return val
      }
    });
    inspector.selected[0]={ data: findObject}
  };
  const bodies = bodiesState.map(val=> {
    return { key: `body-${val.id}`, title:`${val.id} ${val.label}`, content: {content: <MenageElements obj={val}/> }}
  });

  const Level1Content = (
    <div>
      <Accordion.Accordion onTitleClick={activateBlock} panels={bodies} />
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
    { key: 'bodies', title: `Bodies (${bodies.length})`, content: {content: Level1Content } },
    { key: 'composites', title: 'Composites', content: { content: Level2Content } },
    { key: 'constraints', title: 'Constraints', content: { content: Level2Content } },
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
