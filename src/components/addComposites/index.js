import React, { useState } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { useStoreState } from 'easy-peasy';
import { Button, Form, Icon } from "semantic-ui-react";

import reduxInput from '../../common/reduxInputs';
import GeneralBodies from "../codeModal/generalBodies";


const selector = formValueSelector('addCompositeForm');

const validate = values => {
  const errors = {};
  if (!values.body) {
    errors.body = 'Required'
  } else if (values.body === 'choose') {
    errors.body = 'You must choose a composite'
  }

  if(typeof values.label !== "undefined" && values.label.length < 3){
    errors.label = 'Should be at least 3 characters'
  }

  /*if(values.body === 'custom'){
    if (!values.label || values.label.length < 3) {
      errors.label = 'At least three characters must be entered'
    }

    return errors
  }*/
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
  },
  composite: 0
};

const pyramid = [
  { name: 'label' },
  { name: 'x' },
  { name: 'y' },
  { name: 'columns' },
  { name: 'rows' },
  { name: 'columnGap' },
  { name: 'rowGap' },
  { name: 'rectWidth' },
  { name: 'rectHeight' },
];
const stack = [
  { name: 'label' },
  { name: 'x' },
  { name: 'y' },
  { name: 'columns' },
  { name: 'rows' },
  { name: 'columnGap' },
  { name: 'rowGap' },
  { name: 'rectWidth' },
  { name: 'rectHeight' },
];
const newtonsCradle = [
  { name: 'label' },
  { name: 'x' },
  { name: 'y' },
  { name: 'number' },
  { name: 'size' },
  { name: 'length' },
];
const softBody = [
  { name: 'label' },
  { name: 'x' },
  { name: 'y' },
  { name: 'columns' },
  { name: 'rows' },
  { name: 'columnGap' },
  { name: 'rowGap' },
  { name: 'crossBrace' },
  { name: 'particleRadius' },
];
const car = [
  { name: 'label' },
  { name: 'x' },
  { name: 'y'},
  { name: 'width'},
  { name: 'height'},
  { name: 'wheelSize'},
];
const custom = [
  { name: 'label' },
];

let AddComposites = props => {
  const {
    addBodyMouseEvent,
    initialize,
    updateBodyMouseEvent,
    invalid,
    handleSubmit,
    addBody,
    getAllComposites,
  } = props;
  const { renderSelect, renderDropdown, renderTextInput } = reduxInput;
  const options = useStoreState(state => state.matterOptions.options);

  const compositeOptions = [{ key: 0, value: 0, text: 'Stage' }];
  getAllComposites.forEach(obj => {
    compositeOptions.push({ key: obj.id, value: obj.id, text: `${obj.id} ${obj.label}` })
  });

  // const general = useStoreState(state => state.general.render);

  const [code, setCode] = useState(false);

  const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'body', 'label', 'x', 'y', 'columns', 'rows', 'columnGap', 'rowGap', 'number', 'size', 'length',
      'wheelSize', 'crossBrace', 'particleRadius', 'rectWidth', 'rectHeight','width','height'
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

  const pyramidForm = () => {
    return (
      <div className="bodiesForms">
        {
          pyramid.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type={value.name === 'label' ? 'text' : 'number'}
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
  const stackForm = () => {
    return (
      <div className="bodiesForms">
        {
          stack.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type={value.name === 'label' ? 'text' : 'number'}
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
  const newtonsCradleForm = () => {
    return (
      <div className="bodiesForms">
        {
          newtonsCradle.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type={value.name === 'label' ? 'text' : 'number'}
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
  const softBodyForm = () => {
    return (
      <div className="bodiesForms">
        {
          softBody.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type={value.name === 'label' ? 'text' : 'number'}
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
  const carForm = () => {
    return (
      <div className="bodiesForms">
        {
          car.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type={value.name === 'label' ? 'text' : 'number'}
                  placeholder={value.name}
                  size="mini"
                />
              </div>
            )
          })
        }
        {/*<FieldArray name="vertices" component={renderVertices} />*/}
      </div>
    )
  };

  const customForm = () => {
    return (
      <div className="bodiesForms">
        {
          custom.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="text"
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

  const  onchange = (val,name) => {
    let data = {};
    if(name === 'pyramid'){
      data = {
        label: 'Pyramid',
        x: options.width / 2,
        y: options.height / 2,
        columns: 10,
        rows: 10,
        columnGap: 0,
        rowGap:0,
        rectWidth: 30,
        rectHeight: 30
      };
    }else if(name === 'stack'){
      data = {
        label: 'Stack',
        x: options.width / 2,
        y: options.height / 2,
        columns: 6,
        rows: 10,
        columnGap: 0,
        rowGap:0,
        rectWidth: 30,
        rectHeight: 30
      };
    }else if(name === 'newtonsCradle'){
      data = {
        label: 'NewtonsCradle',
        x: options.width / 2,
        y: options.height / 2,
        number: 10,
        size: 10,
        length: 100
      };
    }else if(name === 'softBody'){
      data = {
        label: 'SoftBody',
        x: options.width / 2,
        y: options.height / 2,
        columns: 5,
        rows: 5,
        columnGap: 0,
        rowGap: 0,
        crossBrace: 1,
        particleRadius: 18,
        //particleOptions: 1,
      };
    }else if(name === 'car') {
      data = { label: 'Car', x: options.width / 2, y: options.height / 2, width:200, height:30, wheelSize: 30}
    }else if(name === 'custom') {
      data = { label: 'Custom' }
    }

    initialize({
      ...initialVal,
      ...data
    });
    addBodyMouseEvent(data)
  };

  const sendFormToAddBody = (value,next,third) => {
    console.log(value,next,third);
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
            { key: 'custom', value: 'custom', text: 'custom' },
            { key: 'pyramid', value: 'pyramid', text: 'pyramid' },
            { key: 'stack', value: 'stack', text: 'stack' },
            { key: 'newtonsCradle', value: 'newtonsCradle', text: 'newtonsCradle' },
            { key: 'softBody', value: 'softBody', text: 'softBody' },
            { key: 'car', value: 'car', text: 'car' },
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
        {allFields.body === 'pyramid' && pyramidForm()}
        {allFields.body === 'stack' && stackForm()}
        {allFields.body === 'newtonsCradle' && newtonsCradleForm()}
        {allFields.body === 'softBody' && softBodyForm()}
        {allFields.body === 'car' && carForm()}
        {allFields.body === 'custom' && customForm()}
        {
         /* generalFields.map((value, index) => {
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
          })*/
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
        {code && <GeneralBodies objectData={allFields} handlerClose={() => {setCode(!code)}}/>}
      </div>
    </Form>
  )
};

AddComposites = reduxForm({
  initialValues: {
    ...initialVal,
    body: 'choose',
  },
  validate,
  form: 'addCompositeForm',
  enableReinitialize : true,
  keepDirtyOnReinitialize:true,
})(AddComposites);


export default AddComposites
