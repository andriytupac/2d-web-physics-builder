import React, {useEffect, useState} from 'react';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { connect } from 'react-redux'
import { Button, Form, Icon, Label, Segment, Message } from "semantic-ui-react";
import {useStoreState} from "easy-peasy";

import reduxInput from '../../common/reduxInputs';
import InputFields from "../editBody/InputFields";

const { numberField, selectField, colorField, coordinateField, rangeField, checkboxField } = InputFields;


const selector = formValueSelector('editConstraintForm');

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
};
const generalFields = [
  { name: 'label', key: 'label', label: 'label', type: 'text' },
  { name: 'bodyA', key: 'bodyA', label: 'bodyA', type: 'select' },
  { name: 'pointA', key: 'pointA', label: 'pointA', type: 'coordinate' },
  { name: 'bodyB', key: 'bodyB', label: 'bodyB', type: 'select' },
  { name: 'pointB', key: 'pointB', label: 'pointB', type: 'coordinate' },
  { name: 'length', key: 'length', label: 'length', type: 'number' },
  { name: 'stiffness', key: 'stiffness', label: 'stiffness', type: 'range', settings:{ min: 0, max: 1, step: 0.01 }},
  { name: 'damping', key: 'damping', label: 'damping', type: 'range', settings:{ min: 0, max: 0.1, step: 0.01 }},
  { name: 'render.lineWidth', key: 'render', label: 'lineWidth', type: 'number' },
  { name: 'render.strokeStyle', key: 'render', label: 'strokeStyle', type: 'color' },
  { name: 'render.type', key: 'render', label: 'type', type: 'select' },
  { name: 'render.visible', key: 'render', label: 'visible', type: 'checkbox' },
  { name: 'render.anchors', key: 'render', label: 'anchors', type: 'checkbox' },
];

let EditConstraint = props => {
  const  { objectData, modifyConstraint, inspectorOptions } = props;

  const { renderDropdown, renderTextInput, renderCheckbox } = reduxInput;

  const selectOptions = {};


  let allBodies = [];
  let allBodiesSelect = [];

  const getAllBodies = constraint => {
    constraint.bodies.forEach((val) => {
      allBodies.push(val);
      allBodiesSelect.push({ key: val.id, value: val.id, text: `${val.id} ${val.label}`, body: val})
    });
    if(constraint.composites.length){
      constraint.composites.forEach(val => {
        getAllBodies(val);
      });
    }
  };
  getAllBodies(inspectorOptions);

  selectOptions.bodyA = allBodiesSelect;
  selectOptions.bodyB = allBodiesSelect;
  selectOptions.type = [
    { key: 'line', value: 'line', text: 'line'},
    { key: 'pin', value: 'pin', text: 'pin'},
    { key: 'spring', value: 'spring', text: 'spring'},
  ];


  const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'bodyA', 'pointA', 'bodyB', 'pointB', 'length', 'stiffness', 'damping', 'render', 'label'
    );
    return {
      ...allFields
    }
  });

  const runBodyEvent = (event, props) => {
    const { key_event } = props;
    console.log(allFields,allFields[key_event],key_event);
    if(key_event === 'bodyA' || key_event === 'bodyB') {
      const obj = allBodiesSelect.find(val => {
        if(val.key === allFields[key_event]) {
          return val
        }
      });
      modifyConstraint(obj.body, key_event);
    } else {
      modifyConstraint(allFields[key_event], key_event);
    }
  };



  return (
    <Form className="edit-bodies">
      {generalFields.map(val => {
        if(val.type === 'number'){
          return numberField(val, runBodyEvent)
        } else if (val.type === 'select'){
          return selectField(val, runBodyEvent, selectOptions[val.label])
        }  else if (val.type === 'text'){
          return numberField(val, runBodyEvent, true)
        } else if (val.type === 'color'){
          return colorField(val, runBodyEvent)
        } else if (val.type === 'coordinate'){
          return coordinateField(val, runBodyEvent)
        } else if (val.type === 'range'){
          return rangeField(val, runBodyEvent)
        } else if (val.type === 'checkbox'){
          return checkboxField(val, runBodyEvent)
        }
      })}
    </Form>
  )
};

EditConstraint = reduxForm({
  initialValues: {
    ...initialVal,
    //body: 'choose',
  },
  //validate,
  form: 'editConstraintForm',
  enableReinitialize : true,
  keepDirtyOnReinitialize:true,
})(EditConstraint);

EditConstraint = connect(
  (state,props) => {
    // console.log('props', props.objectData)
    const constraint = props.objectData;
    const bodyThings = {
      ...initialVal,
      bodyA: constraint.bodyA.id,
      bodyB: constraint.bodyB.id,
      length: constraint.length,
      label: constraint.label,
      stiffness: constraint.stiffness,
      damping: constraint.damping,
      pointA: {...constraint.pointA},
      pointB: {...constraint.pointB},
      render: {
        lineWidth: constraint.render.lineWidth,
        strokeStyle: constraint.render.strokeStyle,
        type: constraint.render.type,
        visible: constraint.render.visible,
        anchors: constraint.render.anchors,
      },
    }
    return {
      initialValues: bodyThings
    }
  },
)(EditConstraint);


export default EditConstraint
