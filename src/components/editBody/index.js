import React, { useState } from 'react';
import { Field, reduxForm, formValueSelector, getFormSyncErrors } from 'redux-form';
import { useStoreState } from 'easy-peasy';
import { Label, Button, Form, Icon, Message, Segment, Popup } from "semantic-ui-react";
import { connect } from 'react-redux'
import InputFields from '../../common/reduxInputs/InputFields'
import reduxInput from '../../common/reduxInputs';

import ball from '../../img/ball.png'
import block from '../../img/block.png'
import block2 from '../../img/block-2.png'
import box from '../../img/box.png'
import rock from '../../img/rock.png'
const { numberField, selectField, colorField, rangeField  } = InputFields;

const selector = formValueSelector('editBodyForm');

const initialVal = {
  rotate: {
    angle: 0.3,
    x: 0,
    y: 0,
  },
  scale: {
    scaleX: 1.1,
    scaleY: 1.1,
    x:0,
    y:0
  },
  position:{
    y:100,
    x:100
  },
  velocity:{
    y: -10,
    x: 10
  },
  applyForce: {
    x:0,
    y:-0.05
  },
  angle: 0.3,
  angularVelocity: 0.6,
  isStatic: false,
  density: 0.1,
  inertia: 0.1,
  mass: 0.1,
};
const info = {
  isStaticFalse: (<><b>Bodies --> isStatic</b> should be <b>false</b></>),
  wireframes: (<><b>General Setting --> wireframes</b> should be <b>false</b></>)
}

const generalFields = [
  { name: 'label', key: 'label', label: 'label', type: 'text' },
  { name: 'angle', key: 'angle', label: 'setAngle', type: 'number' },
  { name: 'angularVelocity', key: 'angularVelocity', label: 'setAngularVelocity', type: 'number', info: info.isStaticFalse },
  { name: 'inertia', key: 'inertia', label: 'setInertia', type: 'number', info: info.isStaticFalse },
  { name: 'mass', key: 'mass', label: 'setMass', type: 'number', info: info.isStaticFalse },
  { name: 'render.zIndex', key: 'render', label: 'zIndex', type: 'number', info: info.wireframes },
  { name: 'render.lineWidth', key: 'render', label: 'lineWidth', type: 'number', info: info.wireframes },
  { name: 'render.opacity', key: 'render', label: 'opacity', type: 'number', info: info.wireframes },
  { name: 'render.strokeStyle', key: 'render', label: 'lineWidth', type: 'color', info: info.wireframes },
  { name: 'render.fillStyle', key: 'render', label: 'fillStyle', type: 'color', info: info.wireframes },
  { name: 'render.sprite.texture', key: 'render', label: 'sprite.texture', type: 'dropdown', info: info.wireframes },
  { name: 'collisionFilter.group', key: 'collisionFilter', label: 'group', type: 'number'},
  { name: 'collisionFilter.category', key: 'collisionFilter', label: 'category', type: 'select'},
  { name: 'collisionFilter.mask', key: 'collisionFilter', label: 'mask', type: 'select'},
  { name: 'density', key: 'density', label: 'density', type: 'range', settings: { min: 0, max: 0.1, step: 0.001 }, info: info.isStaticFalse },
  { name: 'friction', key: 'friction', label: 'friction', type: 'range', settings: { min: 0, max: 1, step: 0.05 }},
  { name: 'frictionStatic', key: 'frictionStatic', label: 'frictionStatic', type: 'range', settings: {  min: 0, max: 10, step: 0.1 }, info: info.isStaticFalse },
  { name: 'frictionAir', key: 'frictionAir', label: 'frictionAir', type: 'range', settings: { min: 0, max: 0.1, step: 0.01 }, info: info.isStaticFalse },
  { name: 'restitution', key: 'restitution', label: 'restitution', type: 'range', settings: { min: 0, max: 1, step: 0.1  }, info: info.isStaticFalse },
];

const textureOptions = [
  {
    key: 'none',
    text: 'none',
    value: 'none',
    //image: { avatar: true, src: ball },
  },
  {
    key: 'ball',
    text: 'ball',
    value: ball,
    image: { avatar: true, src: ball },
  },
  {
    key: 'block',
    text: 'block',
    value: block,
    image: { avatar: true, src: block },
  },
  {
    key: 'block2',
    text: 'block2',
    value: block2,
    image: { avatar: true, src: block2 },
  },
  {
    key: 'box',
    text: 'box',
    value: box,
    image: { avatar: true, src: box },
  },
  {
    key: 'rock',
    text: 'rock',
    value: rock,
    image: { avatar: true, src: rock },
  }
];

const validate = values => {
  const errors = {};
  if (typeof values.label !== 'undefined' && values.label.length <3) {
    errors.label = 'Should be at least 3 characters'
  }
  return errors
};

let EditBody = (props) => {
  const {
    modifyBody,
    objectData,
    allCategories,
  } =  props;


  const { renderTextInput, renderCheckbox } = reduxInput;
  // let allBodies = [];
  // let allBodiesSelect = [];

  const [objPosition, setObjPosition] = useState(props.objectData.position);

  const handlerGetLastPosition = () => {
    setObjPosition({...objectData.position})
  };

  const WandH = {
    width: objectData.bounds.max.x - objectData.bounds.min.x,
    height: objectData.bounds.max.y - objectData.bounds.min.y,
  };
  const [objBounds, setObjBounds] = useState(WandH);

  const handlerGetBounds = () => {
    const HandW = {
      width: objectData.bounds.max.x - objectData.bounds.min.x,
      height: objectData.bounds.max.y - objectData.bounds.min.y,
    };
    setObjBounds({...HandW})
  };

  const syncErrors = useStoreState(state => {
    return getFormSyncErrors('editBodyForm')(state)
  });

  const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'bodyA', 'rotate', 'scale', 'position', 'isStatic', 'angle', 'angularVelocity', 'density', 'inertia',
      'mass', 'render', 'collisionFilter', 'velocity', 'applyForce', 'label', 'friction', 'frictionStatic','frictionAir',
      'restitution', 'chamfer'
    );
    return {
      ...allFields
    }
  });

  /* const getAllBodies = constraint => {
    constraint.bodies.forEach((val) => {
      allBodies.push(val);
      allBodiesSelect.push({ key: val.id, value: val.id, text: `${val.id} ${val.label}` })
    });
    if(constraint.composites.length){
      constraint.composites.forEach(val => {
        getAllBodies(val);
      });
    }
  }; */

  const runBodyEvent = (event, props) => {
    const { key_event } = props;
    console.log(allFields,allFields[key_event],key_event);

    modifyBody(allFields[key_event], key_event);
    if(key_event === 'scale'){
      handlerGetBounds()
    }
  };

  return(
    <Form className="edit-bodies">
      {/*Rotation*/}
      <Segment color="green">
        <Label>Rotate:</Label>
        <Form.Button type="button" key_event="rotate" onClick={runBodyEvent} size="mini" icon primary width={2} inline>
            <Icon name='save' />
        </Form.Button>
        <Form.Group className="items-end">
          <Field
            parse={Number}
            width={6}
            name="rotate.angle"
            component={renderTextInput}
            type="number"
            label="rotation:"
            placeholder="rotation"
            size="mini"
            simple={true}
          />
          <Field
            parse={Number}
            width={5}
            name="rotate.x"
            component={renderTextInput}
            type="number"
            label="x:"
            placeholder="x"
            size="mini"
            simple={true}
          />
          <Field
            parse={Number}
            width={5}
            name="rotate.y"
            component={renderTextInput}
            type="number"
            label="y:"
            placeholder="y"
            size="mini"
            simple={true}
          />
        </Form.Group>
      </Segment>
      {/*Scale*/}
      <Segment color="green">
        <Label>Scale:</Label>
        <Form.Button type="button" key_event="scale" onClick={runBodyEvent} size="mini" icon primary width={2} inline>
            <Icon name='save' />
        </Form.Button>
        <Form.Group className="items-end">
          <Field
            parse={Number}
            width={8}
            name="scale.scaleX"
            component={renderTextInput}
            type="number"
            label="scaleX:"
            placeholder="scaleX"
            size="mini"
            simple={true}
          />
          <Field
            parse={Number}
            width={8}
            name="scale.scaleY"
            component={renderTextInput}
            type="number"
            label="scaleY:"
            placeholder="scaleY"
            size="mini"
            simple={true}
          />
        </Form.Group>
        <Form.Group className="items-end">
          <Field
            parse={Number}
            width={8}
            name="scale.x"
            component={renderTextInput}
            type="number"
            label="x:"
            placeholder="x"
            size="mini"
            simple={true}
          />
          <Field
            parse={Number}
            width={8}
            name="scale.y"
            component={renderTextInput}
            type="number"
            label="y:"
            placeholder="y"
            size="mini"
            simple={true}
          />
        </Form.Group>
        <Message positive>
          <Message.Header>
            <Button type="button" onClick={handlerGetBounds} size="mini" icon primary width={2}>
              <Icon name='redo' />
            </Button>
            Width and Height:
          </Message.Header>
          <p>
            {`{ width: ${objBounds.width.toFixed()}, height: ${objBounds.height.toFixed()} }`}
          </p>
        </Message>
      </Segment>
      {/*position*/}
      <Segment color="green">
        <Label>setPosition:</Label>
        <Form.Button type="button" key_event="position" onClick={runBodyEvent} size="mini" icon primary width={2} inline>
            <Icon name='save' />
        </Form.Button>
        <Form.Group className="items-end">
          <Field
            parse={Number}
            width={8}
            name="position.x"
            component={renderTextInput}
            type="number"
            label="x:"
            placeholder="x"
            size="mini"
            simple={true}
          />
          <Field
            parse={Number}
            width={8}
            name="position.y"
            component={renderTextInput}
            type="number"
            label="y:"
            placeholder="y"
            size="mini"
            simple={true}
          />
        </Form.Group>
        <Message positive>
          <Message.Header>
            <Button type="button" onClick={handlerGetLastPosition} size="mini" icon primary width={2}>
              <Icon name='redo' />
            </Button>
            Position:
          </Message.Header>
          <p>
            {`{ x: ${objPosition.x.toFixed()}, y: ${objPosition.y.toFixed()} }`}
          </p>
        </Message>
      </Segment>
      {/*velocity*/}
      <Segment color="green">
        <Label>setVelocity:</Label>
        <Form.Button type="button" key_event="velocity" onClick={runBodyEvent} size="mini" icon primary width={2} inline>
            <Icon name='save' />
        </Form.Button>
        <div className="popup-info">
          <Popup
            trigger={<Icon name='question circle' color='orange' size='small' circular />}
            content={info.isStaticFalse}
            position='top right'
          />
        </div>

        <Form.Group className="items-end">
          <Field
            parse={Number}
            width={8}
            name="velocity.x"
            component={renderTextInput}
            type="number"
            label="x:"
            placeholder="x"
            size="mini"
            simple={true}
          />
          <Field
            parse={Number}
            width={8}
            name="velocity.y"
            component={renderTextInput}
            type="number"
            label="y:"
            placeholder="y"
            size="mini"
            simple={true}
          />
        </Form.Group>
      </Segment>
      {/*applyForce*/}
      <Segment color="green">
        <Label>applyForce:</Label>
        <Form.Button type="button" key_event="applyForce" onClick={runBodyEvent} size="mini" icon primary width={2} inline>
            <Icon name='save' />
        </Form.Button>
        <div className="popup-info">
          <Popup
            trigger={<Icon name='question circle' color='orange' size='small' circular />}
            content={info.isStaticFalse}
            position='top right'
          />
        </div>
        <Form.Group className="items-end">
          <Field
            parse={Number}
            width={8}
            name="applyForce.x"
            component={renderTextInput}
            type="number"
            label="x:"
            placeholder="x"
            size="mini"
            simple={true}
          />
          <Field
            parse={Number}
            width={8}
            name="applyForce.y"
            component={renderTextInput}
            type="number"
            label="y:"
            placeholder="y"
            size="mini"
            simple={true}
          />
        </Form.Group>
      </Segment>
      {/*static*/}
     <Segment color="green">
        <Label>isStatic:</Label>
        <Form.Button type="button" key_event="isStatic" onClick={runBodyEvent} size="mini" icon primary width={2} inline>
          <Icon name='save' />
        </Form.Button>
        <Form.Group className="items-end">
          <Field
            width={16}
            name="isStatic"
            component={renderCheckbox}
            type="checkbox"
            label="isStatic"
            placeholder="isStatic"
            size="mini"
            simple={true}
          />
        </Form.Group>
      </Segment>
      {generalFields.map(val => {
        if(val.type === 'number'){
          return numberField(val, runBodyEvent)
        } else if (val.type === 'select'){
          return selectField(val, runBodyEvent, [{ key: 1, value: 1, text: '1'},...allCategories])
        } else if (val.type === 'color'){
          return colorField(val, runBodyEvent)
        }else if (val.type === 'text'){
          return numberField(val, runBodyEvent, true, syncErrors[val.name])
        }else if (val.type === 'range'){
          return rangeField(val, runBodyEvent)
        }else if (val.type === 'dropdown'){
          return selectField(val, runBodyEvent, textureOptions, true);
        }
        return ''

      })}
    </Form>
  )
};

EditBody = reduxForm({
  initialValues: {
    ...initialVal,
    //body: 'choose',
  },
  validate,
  form: 'editBodyForm',
  enableReinitialize : true,
  //keepDirtyOnReinitialize:true,
})(EditBody);

EditBody = connect(
  (state,props) => {
    const body = props.objectData;
    console.log('props', body);
    const bodyThings = {
      ...initialVal,
      isStatic: body.isStatic,
      label: body.label,
      density: body.density,
      frictionStatic: body.frictionStatic,
      friction: body.friction,
      frictionAir: body.frictionAir,
      restitution: body.restitution,
      chamfer: body.chamfer,
      mass: body.mass,
      render: {
        zIndex: body.render.zIndex,
        strokeStyle: body.render.strokeStyle,
        fillStyle: body.render.fillStyle,
        lineWidth: body.render.lineWidth,
        opacity: body.render.opacity,
        sprite:{
          ...body.render.sprite
        }
      },
      collisionFilter: {
        group: body.collisionFilter.group,
        category: body.collisionFilter.category,
        mask: body.collisionFilter.mask
      }
    };
    return {
      initialValues: bodyThings
    }
  },
)(EditBody);


export default EditBody
