import React, {useEffect, useState} from 'react';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {Label, Button, Form, Icon, Message, Dropdown, Segment, Input} from "semantic-ui-react";
import { connect } from 'react-redux'
import InputFields from './InputFields'
import reduxInput from '../../common/reduxInputs';

const { numberField, selectField, colorField } = InputFields;

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
const generalFields = [
  { name: 'label', key: 'label', label: 'label', type: 'text'},
  { name: 'angle', key: 'angle', label: 'setAngle', type: 'number'},
  { name: 'angularVelocity', key: 'angularVelocity', label: 'setAngularVelocity', type: 'number'},
  { name: 'density', key: 'density', label: 'setDensity', type: 'number'},
  { name: 'inertia', key: 'inertia', label: 'setInertia', type: 'number'},
  { name: 'mass', key: 'mass', label: 'setMass', type: 'number'},
  { name: 'render.zIndex', key: 'render', label: 'zIndex', type: 'number'},
  { name: 'render.lineWidth', key: 'render', label: 'lineWidth', type: 'number'},
  { name: 'render.opacity', key: 'render', label: 'opacity', type: 'number'},
  { name: 'render.strokeStyle', key: 'render', label: 'lineWidth', type: 'color'},
  { name: 'render.fillStyle', key: 'render', label: 'fillStyle', type: 'color'},
  { name: 'collisionFilter.group', key: 'collisionFilter', label: 'group', type: 'number'},
  { name: 'collisionFilter.category', key: 'collisionFilter', label: 'category', type: 'select'},
  { name: 'collisionFilter.mask', key: 'collisionFilter', label: 'mask', type: 'select'},

];

const validate = values => {
  const errors = {};
  if (!values.bodyA) {
    errors.bodyA = 'You must choose a bodyA'
  }
  if (!values.bodyB) {
    errors.bodyB = 'You must choose a bodyB'
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
  let allBodies = [];
  let allBodiesSelect = [];

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

  const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'bodyA', 'rotate', 'scale', 'position', 'isStatic', 'angle', 'angularVelocity', 'density', 'inertia',
      'mass', 'render', 'collisionFilter', 'velocity', 'applyForce', 'label'
    );
    return {
      ...allFields
    }
  });

  const getAllBodies = constraint => {
    constraint.bodies.forEach((val) => {
      allBodies.push(val);
      allBodiesSelect.push({ key: val.id, value: val.id, text: `${val.id} ${val.label}` })
    });
    if(constraint.composites.length){
      constraint.composites.forEach(val => {
        getAllBodies(val);
      });
    }
  };

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
        <Form.Group className="items-end">
          <Field
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
        <Form.Group className="items-end">
          <Field
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
            type="text"
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
          return numberField(val, runBodyEvent, true)
        }

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
  keepDirtyOnReinitialize:true,
})(EditBody);

EditBody = connect(
  (state,props) => {
    console.log('props', props.objectData);
    const body = props.objectData;
    const bodyThings = {
      ...initialVal,
      isStatic: body.isStatic,
      label: body.label,
      render: {
        zIndex: body.render.zIndex,
        strokeStyle: body.render.strokeStyle,
        fillStyle: body.render.fillStyle,
        lineWidth: body.render.lineWidth,
        opacity: body.render.opacity,
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
