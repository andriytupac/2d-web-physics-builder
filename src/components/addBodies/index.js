import React, { useState } from 'react';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { useStoreState } from 'easy-peasy';
import { Button, Form, Icon, Message } from "semantic-ui-react";

import reduxInput from '../../common/reduxInputs';
import GeneralBodies from '../codeModal/generalBodies';

const selector = formValueSelector('addBodyForm');

const validate = values => {
  const errors = {};
  if (!values.body) {
    errors.body = 'Required'
  } else if (values.body === 'choose') {
    errors.body = 'You must choose a body'
  }
  if(values.options && typeof values.options.label !== "undefined" && values.options.label.length < 3){
    errors.options = {label: 'Should be at least 3 characters'}
  }
  if(values.body === 'fromVertices'){
    if (!values.vertices || values.vertices.length < 3) {
      errors.vertices = { _error: 'At least three vertices must be entered' }
    } else {
      const membersArrayErrors = [];
      values.vertices.forEach((member, memberIndex) => {
        const memberErrors = {};
        if (!member || typeof member.x == "undefined") {
          memberErrors.x = 'Required';
          membersArrayErrors[memberIndex] = memberErrors
        }
        if (!member || typeof member.y == "undefined") {
          memberErrors.y = 'Required';
          membersArrayErrors[memberIndex] = memberErrors
        }
      });
      if (membersArrayErrors.length) {
        errors.vertices = membersArrayErrors
      }
    }
    //return errors
  }
  return errors
};

const initialVal = {
  options: {
    density: 0.001,
    friction: 0.1,
    frictionStatic: 0.5,
    frictionAir: 0.01,
    restitution: 0,
    label: 'label',
    isStatic: false
  },
  composite: 0
};

const generalFields = [
  { name: 'density', start: 0.001, min: 0, max: 0.01, step: 0.001 },
  { name: 'friction', start: 0.1, min: 0, max: 1, step: 0.05 },
  { name: 'frictionStatic', start: 0.5, min: 0, max: 10, step: 0.1 },
  { name: 'frictionAir', start: 0.01, min: 0, max: 0.1, step: 0.001 },
  { name: 'restitution', start: 0, min: 0, max: 0.1, step: 0.1 },
];
const circle = [
  { name: 'x' },
  { name: 'y' },
  { name: 'radius' },
];
const polygon = [
  { name: 'x' },
  { name: 'y' },
  { name: 'sides' },
  { name: 'radius' },
  { name: 'chamfer.radius' },
];
const rectangle = [
  { name: 'x' },
  { name: 'y' },
  { name: 'width' },
  { name: 'height' },
  { name: 'chamfer.radius' },
];
const trapezoid = [
  { name: 'x' },
  { name: 'y' },
  { name: 'width' },
  { name: 'height' },
  { name: 'slope' },
  { name: 'chamfer.radius' },
];
const fromVertices = [
  { name: 'x' },
  { name: 'y'},
];

const renderVertices = (props) => {
  const { renderTextInput } = reduxInput;
  const { fields, meta: { error, submitFailed } } = props;
  return (
    <React.Fragment>
      { fields.map((vertices, index) => (
        <Form.Group inline key={index} >
          <Field
            width={6}
            simple={true}
            label="x:"
            name={`${vertices}.x`}
            component={renderTextInput}
            type="number"
            placeholder="x"
            size="mini"
          />
          <Field
            width={6}
            simple={true}
            label="y:"
            name={`${vertices}.y`}
            component={renderTextInput}
            type="number"
            placeholder="y"
            size="mini"
          />
          <Form.Button
            type="button"
            width={4}
            color="red"
            size='mini'
            content={<Icon name='trash' />}
            onClick={() => fields.remove(index)}
          />
        </Form.Group>
      ))}
      { submitFailed && error &&
        (
          <Message negative>
            <Message.Header>Error</Message.Header>
            <p>{error}</p>
          </Message>
        )
      }
      <Button
        type="button"
        color="orange"
        size='mini'
        onClick={() => fields.push({})}
      >
        Add vertices
      </Button>
    </React.Fragment>
  )
}

let AddBodies = props => {
  const {
    addBodyMouseEvent,
    initialize,
    updateBodyMouseEvent,
    invalid,
    handleSubmit,
    addBody,
    getAllComposites,
  } = props;

  const { renderSelect, renderRange, renderTextInput, renderDropdown, renderCheckbox } = reduxInput;
  const options = useStoreState(state => state.matterOptions.options);

  const compositeOptions = [{ key: 0, value: 0, text: 'Stage' }];
  getAllComposites.forEach(obj => {
    compositeOptions.push({ key: obj.id, value: obj.id, text: `${obj.id} ${obj.label}` })
  });

  const [code, setCode] = useState(false);

  const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'body', 'options', 'x', 'y', 'radius', 'sides', 'width', 'height', 'slope','vertices', 'chamfer'
    );
    return {
      ...allFields
    }
  });

  const changeEvent = (event, value, prevValue, name) => {
    if(name === 'x'){
      updateBodyMouseEvent(+value, false)
    } else if (name === 'y'){
      updateBodyMouseEvent(false,+value)
    }
  };

  const circleForm = () => {
    return (
      <div className="bodiesForms">
        {
          circle.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
                  size="mini"
                />
              </div>
            )
          })
        }
      </div>
    )
  };
  const polygonForm = () => {
    return (
      <div className="bodiesForms">
        {
          polygon.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  parse={Number}
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
                  size="mini"
                />
              </div>
            )
          })
        }
      </div>
    )
  };
  const rectangleForm = () => {
    return (
      <div className="bodiesForms">
        {
          rectangle.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  parse={Number}
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
                  size="mini"
                />
              </div>
            )
          })
        }
      </div>
    )
  };
  const trapezoidForm = () => {
    return (
      <div className="bodiesForms">
        {
          trapezoid.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  parse={Number}
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
                  size="mini"
                />
              </div>
            )
          })
        }
      </div>
    )
  };
  const fromVerticesForm = () => {
    return (
      <div className="bodiesForms">
        {
          fromVertices.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
                  size="mini"
                />
              </div>
            )
          })
        }
        <FieldArray name="vertices" component={renderVertices} />
      </div>
    )
  };

  const  onchange = (val,name) => {
    let data = {};
    if(name === 'circle'){
      data = {x: options.width / 2, y: options.height / 2, radius: 30 };
      data.options = { ...initialVal.options, label: 'circle'};
    }else if(name === 'polygon'){
      data = {x: options.width / 2, y: options.height / 2, radius: 30, sides: 5, chamfer: { radius: 0 } };
      data.options = { ...initialVal.options, label: 'polygon'};
    }else if(name === 'rectangle'){
      data = {x: options.width / 2, y: options.height / 2, width: 50, height: 50, chamfer: { radius: 0 } };
      data.options = { ...initialVal.options, label: 'rectangle'};
    }else if(name === 'trapezoid'){
      data = {x: options.width / 2, y: options.height / 2, width: 50, height: 50, slope: 1, chamfer: { radius: 0 } };
      data.options = { ...initialVal.options, label: 'trapezoid'};
    }else if(name === 'fromVertices'){
      data = {x: options.width / 2, y: options.height / 2, vertices:[
          {x:0,y:0},
          {x:30,y:30},
          {x:-30,y:30},
        ]};
      data.options = { ...initialVal.options, label: 'fromVertices'};
    }

    initialize({
      ...initialVal,
      ...data
    });
    addBodyMouseEvent(data)
  };

  const sendFormToAddBody = (value,next,third) => {
    // console.log(value,next,third)
    addBody(value)
  };

  return (
    <Form onSubmit={handleSubmit(sendFormToAddBody)}>
      <div>
        <Field
          name="body"
          type="text"
          component={renderSelect}
          onChange={onchange}
          options={[
            { key: 'choose', value: 'choose', text: 'Select body' },
            { key: 'circle', value: 'circle', text: 'circle' },
            { key: 'polygon', value: 'polygon', text: 'polygon' },
            { key: 'rectangle', value: 'rectangle', text: 'rectangle' },
            { key: 'trapezoid', value: 'trapezoid', text: 'trapezoid' },
            { key: 'fromVertices', value: 'fromVertices', text: 'fromVertices' },
          ]}
          label="Choose body"
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
          name={`options.label`}
          component={renderTextInput}
          type="text"
          label={`label:`}
          placeholder={`label`}
          size="mini"
        />
        <Field
          name={`options.isStatic`}
          component={renderCheckbox}
          toggle
          type="text"
          label={`isStatic`}
          placeholder={`isStatic`}
          size="mini"
        />
        {allFields.body === 'circle' && circleForm()}
        {allFields.body === 'polygon' && polygonForm()}
        {allFields.body === 'rectangle' && rectangleForm()}
        {allFields.body === 'trapezoid' && trapezoidForm()}
        {allFields.body === 'fromVertices' && fromVerticesForm()}
        {
          generalFields.map((value, index) => {
            return (
              <Field
                settings={{...value}}
                key={index}
                name={`options.${value.name}`}
                component={renderRange}
                type="text"
                label={value.name}
              />
            )
          })
        }
        <Button primary={!invalid} type="submit" >Add</Button>
        <Button
          type={!invalid ? 'button' :'submit'}
          icon
          color={!invalid ? 'green' : 'grey'}
          onClick={() => {if(!invalid){setCode(!code)}}}
        >
          <Icon name='code' />
        </Button>
        {code && <GeneralBodies element="composite" objectData={allFields} handlerClose={() => {setCode(!code)}}/>}

      </div>
    </Form>
  )
};

AddBodies = reduxForm({
  initialValues: {
    ...initialVal,
    body: 'choose',
  },
  validate,
  form: 'addBodyForm',
  enableReinitialize : true,
  keepDirtyOnReinitialize:true,
})(AddBodies);


export default AddBodies
