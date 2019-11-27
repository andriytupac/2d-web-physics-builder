import React, {useEffect, useState} from 'react'
import { Header, Accordion, Menu, Segment, Sidebar, Icon, Button } from 'semantic-ui-react'
import { useStoreState, useStoreActions } from 'easy-peasy';
import MatterForm from '../matterForm';
import AddBodies from '../addBodies';
import AddComposites from '../addComposites';
import AddConstraints from '../addConstraints';
import EditBody from '../editBody';
import Matter from 'matter-js';

import './style.scss'
import {Slider} from "react-semantic-ui-range";

const World = Matter.World;
const Events = Matter.Events;
const Composite = Matter.Composite;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Constraint = Matter.Constraint;
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
  const modifyBody = (data,key) => {
    if(key === 'rotate'){
      Body.rotate(obj, +data.angle,{ x: obj.position.x + +data.x, y: obj.position.y+ +data.y })
    }else if(key === 'scale'){
      Body.scale(obj,data.scaleX,data.scaleY,{x: obj.position.x + +data.x,y: obj.position.y+ +data.y})
    }else{
      Body.set(obj,key,data)
    }
    console.log('modify',obj)
    //Body.setAngle(obj,50)
    //Body.setAngularVelocity(obj,0.5)
    //Body.setDensity(obj,100)
    //Body.setInertia(obj,4)
    //Body.setMass(obj,90)
    //Body.setPosition(obj,{x:100,y:100})
    //Body.setStatic(obj,true)
    //Body.set(obj,'width',50)
    console.log('modify',obj)


    /*Body.translate(obj,{x:100,y:100})*/
    /*Body.setVelocity(obj,{x:300,y:300})*/
    /*Body.applyForce(obj,{x:0,y:0},{x:300,y:300})*/
  };
  return (
    <div>
      <Button icon onClick={deleteObj}>
        <Icon name='trash' />
      </Button>
      <Button icon primary onClick={deleteObj}>
        <Icon name='pencil' />
      </Button>
      <div className="edit-form">
        <EditBody modifyBody={modifyBody} />
      </div>
    </div>
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
    var particleOptions = {
      friction: 0.05,
      frictionStatic: 0.1,
      render: { visible: true }
    };
    if(obj.body === 'circle'){
      dataObj = Bodies.circle(+obj.x, +obj.y, +obj.radius, obj.options)
    }else if(obj.body === 'polygon'){
      dataObj = Bodies.polygon(+obj.x, +obj.y,+obj.sides, +obj.radius, obj.options)
    }else if(obj.body === 'rectangle'){
      dataObj = Bodies.rectangle(+obj.x, +obj.y,+obj.width, +obj.height, obj.options)
    }else if(obj.body === 'trapezoid'){
      dataObj = Bodies.trapezoid(+obj.x, +obj.y,+obj.width, +obj.height,+obj.slope, obj.options)
    }else if(obj.body === 'fromVertices'){
      const newVertices = obj.vertices.map((val, index) => {
        val.body = undefined;
        val.index = index;
        val.isInternal = false;
        val.x = +val.x;
        val.y = +val.y;
        return val
      });
      dataObj = Bodies.fromVertices(+obj.x, +obj.y, newVertices, obj.options)
    }else if(obj.body === 'pyramid'){
      dataObj = Composites.pyramid(+obj.x, +obj.y, +obj.columns, +obj.rows, +obj.columnGap, +obj.rowGap , (x, y) => {
        return Bodies.rectangle(x, y,+obj.rectWidth, +obj.rectHeight, obj.options)
      })
    }else if(obj.body === 'stack'){
      dataObj = Composites.stack(+obj.x, +obj.y, +obj.columns, +obj.rows, +obj.columnGap, +obj.rowGap , (x, y) => {
        return Bodies.rectangle(x, y,+obj.rectWidth, +obj.rectHeight, obj.options)
      })
    }else if(obj.body === 'newtonsCradle'){
      dataObj = Composites.newtonsCradle(+obj.x, +obj.y, +obj.number, +obj.size, +obj.length )
    }else if(obj.body === 'softBody'){
      dataObj = Composites.softBody(+obj.x, +obj.y, +obj.columns, +obj.rows, +obj.columnGap, +obj.rowGap, true, +obj.particleRadius, particleOptions)
    }else if(obj.body === 'car'){
      dataObj = Composites.car(+obj.x, +obj.y, +obj.width, +obj.height, +obj.wheelSize )
    }

    World.add(general, [dataObj])
  };

  const addConstraint = obj =>{
    const constraint = Constraint.create(obj);
    World.add(general, [constraint])
  };

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
  const activateBodyConstraint = (body,item) => {
    inspector.selected[item]={ data: body}
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

  const [open, setOpen] = useState(3);

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
                inspector.options && open === 1 &&
                <AddBodies
                  addBodyMouseEvent={addBodyMouseEvent}
                  updateBodyMouseEvent={updateBodyMouseEvent}
                  addBody={addBody}
                />
              }
            />
            <Accordion.Title
              active={open === 2}
              content='Add Composites'
              onClick={openMenuContent}
              index={2}
            />
            <Accordion.Content
              active={open === 2}
              content={
                inspector.options &&
                <AddComposites
                  addBodyMouseEvent={addBodyMouseEvent}
                  updateBodyMouseEvent={updateBodyMouseEvent}
                  addBody={addBody}
                />
              }
            />
            <Accordion.Title
              active={open === 3}
              content='Add Constraint'
              onClick={openMenuContent}
              index={3}
            />
            <Accordion.Content
              active={open === 3}
              content={
                inspector.options &&
                <AddConstraints
                  inspectorOptions={general}
                  activateBodyConstraint={activateBodyConstraint}
                  addConstraint={addConstraint}
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
