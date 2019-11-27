import React, { useEffect } from 'react';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {Label, Button, Form, Icon, Message, Dropdown, Segment} from "semantic-ui-react";

import reduxInput from '../../common/reduxInputs';

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
  isStatic: false,
};
const generalFields = [
  { name: 'angle', key: 'angle', label: 'setAngle'},
  { name: 'angularVelocity', key: 'angularVelocity', label: 'setAngularVelocity'},
  { name: 'density', key: 'density', label: 'setDensity'},
  { name: 'inertia', key: 'inertia', label: 'setInertia'},
  { name: 'mass', key: 'mass', label: 'setMass'},
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
  const { inspectorOptions, activateBodyConstraint, handleSubmit, addConstraint, invalid, modifyBody } =  props;
  const { renderDropdown, renderTextInput, renderRange, renderCheckbox } = reduxInput;
  let allBodies = [];
  let allBodiesSelect = [];

  const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'bodyA', 'rotate', 'scale', 'position', 'isStatic'
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
  //getAllBodies(inspectorOptions);

  const  getBody = (value) => {
    return allBodies.find(obj => {
      if(obj.id == value){
        return obj
      }
    })
  };

  const changePositionA = (value) => {
    if(value === 0){
      activateBodyConstraint({},0)
    }else{
      activateBodyConstraint(getBody(value),0)
    }
  };
  const changePositionB = (value) => {
    //console.log(allFields)
    if(allFields.bodyA === 0){
      activateBodyConstraint({},0)
      activateBodyConstraint(getBody(value),1)
    }else {
      activateBodyConstraint(getBody(value),1)
    }
  };
  //console.log(allBodiesSelect);
  //console.log('inspectorOptions',inspectorOptions);
  const sendFormAddConstraintToBody = value => {
    addConstraint({ ...value, bodyA: getBody(value.bodyA), bodyB: getBody(value.bodyB)})
  };
  const runBodyEvent = (event, props) => {
    const { key_event } = props;
    console.log(allFields[key_event])
    modifyBody(allFields[key_event], key_event);
  }

  return(
    <Form className="edit-bodies" onSubmit={handleSubmit(sendFormAddConstraintToBody)}>
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
         return (
           <Segment color="green" key={val.key}>
            <Label>{val.label}:</Label>
            <Form.Button
              type="button"
              key_event={val.key}
              onClick={runBodyEvent}
              size="mini"
              icon
              primary
              width={2}
              inline
            >
              <Icon name='save' />
            </Form.Button>
            <Form.Group className="items-end">
              <Field
                width={16}
                name={val.name}
                component={renderTextInput}
                type="number"
                label={`${val.name}:`}
                placeholder={val.name}
                size="mini"
                simple={true}
              />
            </Form.Group>
          </Segment>
         )
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


export default EditBody
