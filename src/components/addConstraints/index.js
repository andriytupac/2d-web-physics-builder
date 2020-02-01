import React, { useState } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { useStoreState } from 'easy-peasy';
import { Label, Button, Form, Icon } from "semantic-ui-react";

import reduxInput from '../../common/reduxInputs';
import GeneralBodies from "../codeModal/generalBodies";

const selector = formValueSelector('addConstraintsForm');

const initialVal = {
  label: 'Constraint',
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
  stiffness: 0.1,
  damping: 0.1,
  render: {
    type: 'line'
  },
  composite: 0
};
const generalFields = {
  stiffness: { name: 'stiffness', start: 0.1, min: 0, max: 1, step: 0.1 },
  damping: { name: 'damping', start: 0.1, min: 0, max: 0.1, step: 0.01 },
};
const renderTypeOptions = [
  { key: 'line', value: 'line', text: 'line'},
  { key: 'pin', value: 'pin', text: 'pin'},
  { key: 'spring', value: 'spring', text: 'spring'},
];

const validate = values => {
  const errors = {};
  /*if (!values.bodyA) {
    errors.bodyA = 'You must choose a bodyA'
  }*/
  if(typeof values.label !== "undefined" && values.label.length < 3){
    errors.label = 'Should be at least 3 characters'
  }
  if (!values.bodyB) {
    errors.bodyB = 'You must choose a bodyB'
  }
  return errors
};

let AddConstraints = (props) => {
  const { inspectorOptions, activateBodyConstraint, handleSubmit, addConstraint, invalid, getAllComposites } =  props;
  const { renderDropdown, renderTextInput, renderRange } = reduxInput;
  let allBodies = [];
  let allBodiesSelect = [];

  const compositeOptions = [{ key: 0, value: 0, text: 'Stage' }];
  getAllComposites.forEach(obj => {
    compositeOptions.push({ key: obj.id, value: obj.id, text: `${obj.id} ${obj.label}` })
  });

  const [code, setCode] = useState(false);

  const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'bodyA', 'bodyB', 'pointA', 'pointB', 'label', 'length', 'body', 'render', 'stiffness', 'damping'
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
    return allBodies.find(obj => obj.id === value)
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
  //console.log('inspectorOptions',inspectorOptions);
  const sendFormAddConstraintToBody = value => {
    addConstraint({ ...value, bodyA: getBody(value.bodyA), bodyB: getBody(value.bodyB)})
  };

  return(
    <Form onSubmit={handleSubmit(sendFormAddConstraintToBody)}>
      <Field
        label="label:"
        // onChange={changeEvent}
        name="label"
        component={renderTextInput}
        type="text"
        placeholder="label"
        size="mini"
      />
      <Field
        name="composite"
        type="text"
        component={renderDropdown}
        // onChange={onchange}
        options={compositeOptions}
        label="composite"
        size="mini"
      />
      <Field
        name="render.type"
        type="text"
        component={renderDropdown}
        options={renderTypeOptions}
        label="render.type"
        size="mini"
      />
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
        name="stiffness"
        component={renderRange}
        type="text"
        label="stiffness"
      />
      <Field
        settings={{...generalFields.damping}}
        name="damping"
        component={renderRange}
        type="text"
        label="damping"
      />
      <Field
        name="body"
        type="hidden"
        component="input"
      />
      <Button primary={!invalid} type="submit" >Add</Button>
      <Button
        type={!invalid ? 'button' :'submit'}
        icon
        color={!invalid ? 'green' : 'grey'}
        onClick={() => {if(!invalid){setCode(!code)}}}
      >
        <Icon name='code' />
      </Button>
      {code && <GeneralBodies getBody={getBody} objectData={allFields} handlerClose={() => {setCode(!code)}}/>}
    </Form>
  )
};

AddConstraints = reduxForm({
  initialValues: {
    ...initialVal,
    body: 'constraint',
  },
  validate,
  form: 'addConstraintsForm',
  enableReinitialize : true,
  keepDirtyOnReinitialize:true,
})(AddConstraints);


export default AddConstraints
