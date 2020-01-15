import React, {useEffect, useState} from 'react'
import { Header, Accordion, Menu, Segment, Sidebar, Icon, Button, Popup } from 'semantic-ui-react'
import { useStoreState, useStoreActions } from 'easy-peasy';
import MatterForm from '../matterForm';
import AddBodies from '../addBodies';
import AddComposites from '../addComposites';
import AddConstraints from '../addConstraints';
import EditBody from '../editBody';
import CodeModal from '../codeModal';
import EditComposite from "../editComposite";
import EditConstraint from "../editConstraint";
import Matter from 'matter-js';

import './style.scss'

const World = Matter.World;
const Events = Matter.Events;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Composite = Matter.Composite;
const Composites = Matter.Composites;
const Constraint = Matter.Constraint;
let inspector = {};
let allCategories = [];
for(let i = 0; i<=28; i++){
  let cat = Body.nextCategory();
  allCategories.push({value: cat, key: cat, text: cat})
}

// List of bodies
const MenageElements = props => {
  const { obj } = props;
  const world = useStoreState(state => state.general.render);
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(false);

  const addRender = useStoreActions(
    actions => actions.general.addRender
  );

//Delete obj
  const deleteObj = () =>{
    World.remove(world, obj, true);
    inspector.selected.pop();
  };
  const modifyBody = (data,key) => {
    //console.log(Composite.get(world,obj.id, 'body'))
    if(key === 'rotate'){
      Body.rotate(obj, +data.angle,{ x: obj.position.x + +data.x, y: obj.position.y+ +data.y })
    }else if(key === 'scale'){
      Body.scale(obj,data.scaleX,data.scaleY,{x: obj.position.x + +data.x,y: obj.position.y+ +data.y})
    }else if(key === 'render'){
      console.log('key',key,data);
      let newData = data;
      if(newData.sprite && newData.sprite.texture === 'none'){
        delete newData.sprite.texture
      }
      const render = { ...obj.render, ...data}
      Body.set(obj,key,render)
    }else if(key === 'collisionFilter'){
      console.log('key',key,data);
      const render = { ...obj.collisionFilter, ...data}
      Body.set(obj,key,render)
    }else if(key === 'applyForce'){
      Body.applyForce(obj,{ x: obj.position.x, y: obj.position.y },data)
    }else{
      console.log('key',key,data)
      Body.set(obj,key,data)
    }
    if(key === 'label'){
      addRender(world)
    }

  };
  return (
    <div>
      <Popup
        trigger={
          <Button color="red" icon onClick={deleteObj}>
            <Icon  name='trash' />
          </Button>
        }
        content='Delete Body'
        position='top center'
        size='tiny'
        inverted
      />
      <Popup
        trigger={
          <Button icon primary onClick={ () => {setEdit(!edit)}}>
            <Icon name='pencil' />
          </Button>
        }
        content='Edit Body'
        position='top center'
        size='tiny'
        inverted
      />
      <Popup
        trigger={
          <Button icon color={"green"} onClick={ () => {setCode(!code)}}>
            <Icon name='code' />
          </Button>
        }
        content='Get Code'
        position='top center'
        size='tiny'
        inverted
      />
      {code && <CodeModal element="body" objectData={obj} handlerClose={() => {setCode(!code)}}/>}
      <div className="edit-form">
        {edit && (
          <EditBody
            objectData={obj}
            modifyBody={modifyBody}
            allCategories={allCategories}
          />
        )}
      </div>
    </div>
  )
};

const MenageElementsComposite = props => {
  const { obj } = props;
  const world = useStoreState(state => state.general.render);

  const addRender = useStoreActions(
    actions => actions.general.addRender
  );

  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(false);

  const clearObj = () => {
    Composite.clear(obj, false, true);
    //Composite.setModified(obj, true, true, true);
    addRender({...world})

  };

  const deleteObj = () => {

    Composite.clear(obj, false, true);
    Composite.remove(world, obj, true );
    Composite.setModified(obj, true, true, true);
    //World.remove(world, obj, true);
  };

  const modifyComposite = (data,key) => {
    const position =  Composite.bounds(obj);

    const positionX = (position.max.x+position.min.x)/2
    const positionY = (position.max.y+position.min.y)/2

    if(key === 'rotate'){
      const width = position.max.x-position.min.x;
      const height = position.max.y-position.min.y;
      Composite.rotate(obj, +data.angle,{ x: positionX + +data.x, y: positionY+ +data.y })
    }else if(key === 'scale'){
      Composite.scale(obj,data.scaleX,data.scaleY,{x: positionX + +data.x,y: positionY+ +data.y})
    }else if(key === 'label'){
      obj.label = data;
      addRender(world)
    }

  };

  return (
    <div>
      <Popup
        trigger={
          <Button icon color='orange' onClick={clearObj}>
            <Icon name='eraser' />
          </Button>
        }
        content='Clear Bodies inside Composite'
        position='top left'
        size='tiny'
        inverted
      />
      <Popup
        trigger={
          <Button icon color='red' onClick={deleteObj}>
            <Icon name='trash' />
          </Button>
        }
        content='Delete Composite'
        position='top center'
        size='tiny'
        inverted
      />
      <Popup
        trigger={
          <Button icon primary onClick={ () => {setEdit(!edit)}}>
            <Icon name='pencil' />
          </Button>
        }
        content='Edit Composite'
        position='top center'
        size='tiny'
        inverted
      />
      <Popup
        trigger={
          <Button icon color={"green"} onClick={ () => {setCode(!code)}}>
            <Icon name='code' />
          </Button>
        }
        content='Get Code'
        position='top center'
        size='tiny'
        inverted
      />
      {code && <CodeModal element="composite" objectData={obj} handlerClose={() => {setCode(!code)}}/>}
      <div className="edit-form">
        {edit && (
          <EditComposite
            objectData={obj}
            modifyComposite={modifyComposite}
          />
        )}
      </div>
    </div>
  )
};

const MenageElementsConstraint = props => {
  const { obj, general } = props;
  const world = useStoreState(state => state.general.render);

  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(false);

  const addRender = useStoreActions(
    actions => actions.general.addRender
  );

  const deleteObj = () => {
    World.remove(world, obj, true);
  };

  const modifyConstraint = (data,key) => {
      obj[key] = data;
      if(key==='label'){
        addRender({...world})
      }
  };

  return (
    <div>
      <Popup
        trigger={
          <Button icon color='red' onClick={deleteObj}>
            <Icon name='trash' />
          </Button>
        }
        content='Delete Constraint'
        position='top center'
        size='tiny'
        inverted
      />
      <Popup
        trigger={
          <Button icon primary onClick={ () => {setEdit(!edit)}}>
            <Icon name='pencil' />
          </Button>
        }
        content='Edit Constraint'
        position='top center'
        size='tiny'
        inverted
      />
      <Popup
        trigger={
          <Button icon color={"green"} onClick={ () => {setCode(!code)}}>
            <Icon name='code' />
          </Button>
        }
        content='Get Code'
        position='top center'
        size='tiny'
        inverted
      />
      {code && <CodeModal element="constraint" objectData={obj} handlerClose={() => {setCode(!code)}}/>}
      <div className="edit-form">
        {edit && (
          <EditConstraint
            objectData={obj}
            modifyConstraint={modifyConstraint}
            inspectorOptions={general}
          />
        )}
      </div>
    </div>
  )
};

const SidebarExampleSidebar = (props) => {
  //Store
  //const world = useStoreState(state => state.general.render);
  const menuLeft = useStoreState(state => state.general.menuLeft);
  const general = useStoreState(state => state.general.render);
  let getAllComposites = [];

  //const getAllComposites = Composite.allComposites(general);
  if(general.type){
    getAllComposites = Composite.allComposites(general);
    console.log(getAllComposites)
  }


  const addOptions = useStoreActions(
    actions => actions.matterOptions.addOptions
  );

  const addRender = useStoreActions(
    actions => actions.general.addRender
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
      console.log(obj)
      dataObj = Bodies.polygon(+obj.x, +obj.y,+obj.sides, +obj.radius, {...obj.options, chamfer: obj.chamfer})
    }else if(obj.body === 'rectangle'){
      dataObj = Bodies.rectangle(+obj.x, +obj.y,+obj.width, +obj.height, {...obj.options, chamfer: obj.chamfer})
    }else if(obj.body === 'trapezoid'){
      dataObj = Bodies.trapezoid(+obj.x, +obj.y,+obj.width, +obj.height,+obj.slope, {...obj.options, chamfer: obj.chamfer})
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
      });
      dataObj.label = obj.label;
    }else if(obj.body === 'stack'){
      dataObj = Composites.stack(+obj.x, +obj.y, +obj.columns, +obj.rows, +obj.columnGap, +obj.rowGap , (x, y) => {
        return Bodies.rectangle(x, y,+obj.rectWidth, +obj.rectHeight, obj.options)
      });
      dataObj.label = obj.label;
    }else if(obj.body === 'newtonsCradle'){
      dataObj = Composites.newtonsCradle(+obj.x, +obj.y, +obj.number, +obj.size, +obj.length );
      dataObj.label = obj.label;
    }else if(obj.body === 'softBody'){
      dataObj = Composites.softBody(+obj.x, +obj.y, +obj.columns, +obj.rows, +obj.columnGap, +obj.rowGap, true, +obj.particleRadius, particleOptions);
      dataObj.label = obj.Composites;
    }else if(obj.body === 'car'){
      dataObj = Composites.car(+obj.x, +obj.y, +obj.width, +obj.height, +obj.wheelSize );
      dataObj.label = obj.label;
    }else if(obj.body === 'custom'){
      dataObj = Composite.create({label:obj.label})
      console.log(dataObj)
    }
    if(obj.composite === 0){
      World.add(general, [dataObj]);
    }else{
      const compositeObj = Composite.get(general, obj.composite, 'composite');
      World.add(compositeObj, [dataObj]);
      addRender({...general})
    }
  };

  const addConstraint = obj =>{
    const constraint = Constraint.create(obj);
    if(obj.composite === 0){
      World.add(general, [constraint])
    }else{
      const compositeObj = Composite.get(general, obj.composite, 'composite');
      World.add(compositeObj, [constraint])
      addRender({...general})
    }
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
          content: <MenageElementsConstraint obj={val} general={general}/>
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
          content: (<div><MenageElementsComposite obj={val}/>  {AccordionExampleNested(val)}</div>)
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

  const [open, setOpen] = useState();

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
        <Accordion styled>
            <Accordion.Title
              active={open === 0}
              content='General Setting'
              onClick={openMenuContent}
              index={0}
            />
          <Accordion.Content
              active={open === 0}
              content={
                inspector.options  && <MatterForm changeOptions={changeOptions} inspectorOptions={inspector.options} />
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
                  getAllComposites={getAllComposites}
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
                inspector.options && open === 2 &&
                <AddComposites
                  getAllComposites={getAllComposites}
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
                inspector.options && open === 3 &&
                <AddConstraints
                  getAllComposites={getAllComposites}
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
