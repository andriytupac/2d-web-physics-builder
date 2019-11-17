import React, { useEffect } from 'react';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {Label, Button, Form, Icon} from "semantic-ui-react";

import reduxInput from '../../common/reduxInputs';

const selector = formValueSelector('addBodyForm');

const validate = values => {
  const errors = {};
  if (!values.body) {
    errors.body = 'Required'
  } else if (values.body === 'choose') {
    errors.body = 'You must choose a body'
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
    chamfer: 0,
  }
};

const generalFields = [
  { name: 'density', start: 0.001, min: 0, max: 0.01, step: 0.001 },
  { name: 'friction', start: 0.1, min: 0, max: 1, step: 0.05 },
  { name: 'frictionStatic', start: 0.5, min: 0, max: 10, step: 0.1 },
  { name: 'frictionAir', start: 0.01, min: 0, max: 0.1, step: 0.001 },
  { name: 'restitution', start: 0, min: 0, max: 0.1, step: 0.1 },
  { name: 'chamfer', start: 0, min: 0, max: 30, step: 1 },
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
];
const rectangle = [
  { name: 'x' },
  { name: 'y' },
  { name: 'width' },
  { name: 'height' },
];
const trapezoid = [
  { name: 'x' },
  { name: 'y' },
  { name: 'width' },
  { name: 'height' },
  { name: 'slope' },
];
const fromVertices = [
  { name: 'x' },
  { name: 'y'},
];

const renderVertices = (props) => {
  const { renderTextInput } = reduxInput;
  const { fields } = props;
  console.log(fields)
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
      <Button
        type="button"
        color="orange"
        size='mini'
        onClick={() => fields.push({})}
      >
        Add item
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
    pristine
  } = props;
  const { renderSelect, renderRange, renderTextInput } = reduxInput;
  const options = useStoreState(state => state.matterOptions.options);


  const addOptions = useStoreActions(
    actions => actions.matterOptions.addOptions
  );

  const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'body', 'density'
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
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
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
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
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
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
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
                />
              </div>
            )
          })
        }
        <FieldArray name="members" component={renderVertices} />
      </div>
    )
  };

  const  onchange = (val,name) => {
    let data = {};
    if(name === 'circle'){
      data = {x: options.width / 2, y: options.height / 2, radius: 30 };
    }else if(name === 'polygon'){
      data = {x: options.width / 2, y: options.height / 2, radius: 30, sides: 5 };
    }else if(name === 'rectangle'){
      data = {x: options.width / 2, y: options.height / 2, width: 50, height: 50 };
    }else if(name === 'trapezoid'){
      data = {x: options.width / 2, y: options.height / 2, width: 50, height: 50, slope: 1 };
    }else if(name === 'fromVertices'){
      data = {x: options.width / 2, y: options.height / 2 };
    }

    initialize({
      ...initialVal,
      ...data
    });
    addBodyMouseEvent(data)
  };

  const sendFormToAddBody = (value,next,third) => {
    console.log(value,next,third)
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
