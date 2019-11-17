import React, {useEffect, useState} from 'react'
import { Header, Accordion, Menu, Segment, Sidebar, Icon, Button } from 'semantic-ui-react'
import { useStoreState, useStoreActions } from 'easy-peasy';
import MatterForm from '../matterForm';
import AddBodies from '../addBodies';
import Matter from 'matter-js';

import './style.scss'

const World = Matter.World;
const Events = Matter.Events;
const Composite = Matter.Composite;
const Bodies = Matter.Bodies;
let inspector = {};

// List of bodies
const MenageElements = props => {
  const { obj } = props;
  const world = useStoreState(state => state.general.render);
//Delete obj
  const deleteObj = () =>{
    World.remove(world, obj);
    inspector.selected.pop();
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

  const addOptions = useStoreActions(
    actions => actions.matterOptions.addOptions
  );

  // const bodiesState = general.bodies || [];
  // const constraintState = general.constraints || [];

  const addBody = obj => {
    let dataObj = {};
    if(obj.body === 'circle'){
      dataObj = Bodies.circle(+obj.x, +obj.y, +obj.radius, obj.options)
    }else if(obj.body === 'polygon'){
      dataObj = Bodies.polygon(+obj.x, +obj.y,+obj.sides, +obj.radius, obj.options)
    }else if(obj.body === 'rectangle'){
      dataObj = Bodies.rectangle(+obj.x, +obj.y,+obj.width, +obj.height, obj.options)
    }else if(obj.body === 'trapezoid'){
      dataObj = Bodies.trapezoid(+obj.x, +obj.y,+obj.width, +obj.height,+obj.slope, obj.options)
    }
    World.add(general, [dataObj])
  }

  //Elements inspector
  const runInspector = value => {
    inspector = value;
    Events.on(inspector.render, 'afterRender', afterRender);
  };
  //Get active body
  const activateBody = (data, composite) => {
    //inspector.render.options.wireframes = false;
    if(data.active){ return inspector.selected.pop(); }
    const key = data.content.split(' ');
    const findObject = Composite.allBodies(composite).find((val)=>{
      if(val.id == key[0]){
        return val
      }
    });
    inspector.selected[0]={ data: findObject}
  };
  //add Body mouse Event
  const addBodyMouseEvent = (obj) =>{
    inspector.selected.pop();
    inspector.selected[0]={ data: {type: 'mousePosition', mouse: { x: obj.x, y: obj.y }}}
  };
  const updateBodyMouseEvent = (x,y) =>{
    const position = inspector.selected[0];
    inspector.selected[0].data.mouse.x = x === false ? position.data.mouse.x : x;
    inspector.selected[0].data.mouse.y = y === false  ? position.data.mouse.y : y;
  };
  //Get active constraint
  const activateConstraint = (data, composite) => {
    if(data.active){ return inspector.selected.pop(); }
    const key = data.content.split(' ');
    const findObject = Composite.allConstraints(composite).find((val)=>{
      if(val.id == key[0]){
        return val
      }
    });
    inspector.selected[0]={ data: findObject}
  };
  //List of bodies
  const LevelBodies = (bodies, composite) => {
    bodies = bodies.map(val => {
      return {
        key: `body-${val.id}`,
        title: `${val.id} ${val.label}`,
        content: {
          content: <MenageElements obj={val}/>
        }
      }
    });
    return (
      <div>
        <Accordion.Accordion  onTitleClick={(event,data) => { activateBody(data, composite)}} panels={bodies}/>
      </div>
    );
  };
  //List of constraints
  const LevelConstraints = (constraints, composite) => {
    constraints = constraints.map(val => {
      return {
        key: `constaraint-${val.id}`,
        title: `${val.id} ${val.label}`,
        content: {
          content: <MenageElements obj={val}/>
        }
      }
    });
    return (
      <div>
        <Accordion.Accordion onTitleClick={(event,data) => { activateConstraint(data, composite)}} panels={constraints}/>
      </div>
    );
  };
  // List of composites
  const LevelComposites = (composites) => {
    composites = composites.map(val => {
      return {
        key: `composites-${val.id}`,
        title: `${val.id} ${val.label}`,
        content: {
          content: (<div><MenageElements obj={val}/>  {AccordionExampleNested(val)}</div>)
        }
      }
    });
    return (
      <div>
        <Accordion.Accordion panels={composites}/>
      </div>
    );
  };


  // Main Accordion
  const AccordionExampleNested = (general) => {

    const bodiesState = general.bodies || [];
    const constraintState = general.constraints || [];
    const compositesState  = general.composites || [];
    const rootPanels = [
      { key: 'bodies', title: `Bodies (${bodiesState.length})`, content: {content: LevelBodies(bodiesState, general) } },
      { key: 'composites', title: `Composites (${compositesState.length})`, content: { content: LevelComposites(compositesState) } },
      { key: 'constraints', title: `Constraints (${constraintState.length})`, content: { content: LevelConstraints(constraintState, general) } },
    ];

    return (<Accordion panels={rootPanels} styled />)
  };

  // Get info fromChild component
  const afterRender = function (param) {
    var renderController = inspector.render.controller,
      context = inspector.render.context;
    if (renderController.inspector) renderController.inspector(inspector, context);
  };

  const childrenWithProps = React.Children.map(props.children, child => {
      return React.cloneElement(child, { runInspector: runInspector })
    }
  );

  const changeOptions = (value, name) => {
    inspector.render.options[name] = value;
    //console.log(inspector.render.options);
  };

  const [open, setOpen] = useState(1);

  const openMenuContent = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = open === index ? -1 : index;
    setOpen(newIndex);
  };


  useEffect( () => {
    addOptions(inspector.options || {})
  });

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
        {AccordionExampleNested(general)}
        <Accordion  styled>
            <Accordion.Title
              active={open === 0}
              content='General Setting'
              onClick={openMenuContent}
              index={0}
            />
            <Accordion.Content
              active={open === 0}
              content={
                inspector.options && <MatterForm changeOptions={changeOptions} inspectorOptions={inspector.options} />
              }
            />
            <Accordion.Title
              active={open === 1}
              content='Add bodies'
              onClick={openMenuContent}
              index={1}
            />
            <Accordion.Content
              active={open === 1}
              content={
                inspector.options &&
                <AddBodies
                  addBodyMouseEvent={addBodyMouseEvent}
                  updateBodyMouseEvent={updateBodyMouseEvent}
                  addBody={addBody}
                />
              }
            />
        </Accordion>
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
