import React, { useEffect } from 'react';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {Label, Button, Form, Icon, Message, Dropdown} from "semantic-ui-react";

import reduxInput from '../../common/reduxInputs';

const selector = formValueSelector('addConstraintsForm');

const initialVal = {
  bodyA: 0,
  length: 0,
  pointA:{
    x: 0,
    y: 0,
  },
  pointB:{
    x: 0,
    y: 0,
  },
  options: {
    stiffness: 0.001,
    damping: 0.1
  }
};
const generalFields = {
  stiffness: { name: 'stiffness', start: 0.001, min: 0, max: 0.1, step: 0.001 },
  damping: { name: 'damping', start: 0.1, min: 0, max: 1, step: 0.1 },
};

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

let AddConstraints = (props) => {
  const { inspectorOptions, activateBodyConstraint, handleSubmit, addConstraint, invalid } =  props;
  const { renderDropdown, renderTextInput, renderRange } = reduxInput;
  let allBodies = [];
  let allBodiesSelect = [];

  const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'bodyA', 'bodyB'
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
  getAllBodies(inspectorOptions);

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

  return(
    <Form onSubmit={handleSubmit(sendFormAddConstraintToBody)}>
      <Field
        label="bodyA:"
        onChange={changePositionA}
        name="bodyA"
        component={renderDropdown}
        type="number"
        placeholder="bodyA"
        size="mini"
        options={[{ key: 0, value: 0, text: 'Stage'}, ...allBodiesSelect]}
      />
      <Form.Group widths='equal'>
        <Label>pointA:</Label>
        <Field
          label="x:"
          // onChange={changeEvent}
          name="pointA.x"
          component={renderTextInput}
          type="number"
          placeholder="x"
          size="mini"
          simple={true}
          width={6}
        />
        <Field
          label="y:"
          // onChange={changeEvent}
          name="pointA.y"
          component={renderTextInput}
          type="number"
          placeholder="y"
          size="mini"
          simple={true}
          width={6}
        />
      </Form.Group>
      <Field
        label="bodyB:"
        onChange={changePositionB}
        name="bodyB"
        component={renderDropdown}
        type="number"
        placeholder="bodyB"
        size="mini"
        options={allBodiesSelect}
      />
      <Form.Group widths='equal'>
        <Label>pointB:</Label>
        <Field
          label="x:"
          // onChange={changeEvent}
          name="pointB.x"
          component={renderTextInput}
          type="number"
          placeholder="x"
          size="mini"
          simple={true}
          width={8}
        />
        <Field
          label="y:"
          // onChange={changeEvent}
          name="pointB.y"
          component={renderTextInput}
          type="number"
          placeholder="y"
          size="mini"
          simple={true}
          width={8}
        />
      </Form.Group>
      <Field
        label="Length"
        // onChange={changeEvent}
        name="length"
        component={renderTextInput}
        type="number"
        placeholder="length"
        size="mini"
      />
      <Field
        settings={{...generalFields.stiffness}}
        name="options.stiffness"
        component={renderRange}
        type="text"
        label="stiffness"
      />
      <Field
        settings={{...generalFields.damping}}
        name="options.damping"
        component={renderRange}
        type="text"
        label="damping"
      />
      <Button primary={!invalid} type="submit" >Add</Button>
    </Form>
  )
};

AddConstraints = reduxForm({
  initialValues: {
    ...initialVal,
    //body: 'choose',
  },
  validate,
  form: 'addConstraintsForm',
  enableReinitialize : true,
  keepDirtyOnReinitialize:true,
})(AddConstraints);


export default AddConstraints
