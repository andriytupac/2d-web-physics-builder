import React, {useEffect, useState} from 'react';
import { Field, reduxForm, formValueSelector, FieldArray, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux'
import { Button, Form, Icon, Label, Segment, Message } from "semantic-ui-react";

import reduxInput from '../../common/reduxInputs';
import { useStoreState } from "easy-peasy";

const selector = formValueSelector('editCompositeForm');

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

const validate = values => {
  const errors = {};
  if (typeof values.label !== 'undefined' && values.label.length <3) {
    errors.label = 'Should be at least 3 characters'
  }
  return errors
};

let EditComposite = props => {
  const  { objectData, modifyComposite, invalid } = props;

  const { renderDropdown, renderTextInput, renderCheckbox } = reduxInput;

  const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'rotate', 'scale', 'label'
    );
    return {
      ...allFields
    }
  });

  const syncErrors = useStoreState(state => {
    return getFormSyncErrors('editCompositeForm')(state)
  });

  const runBodyEvent = (event, props) => {
    const { key_event } = props;
    console.log(allFields,allFields[key_event],key_event);

    modifyComposite(allFields[key_event], key_event);
    if(key_event === 'scale'){
      //handlerGetBounds()
    }
  };


  console.log(objectData)

  return (
    <Form className="edit-bodies">
      {/*Rotation*/}
      <Segment color="green">
        <Label>Label:</Label>
        <Form.Button type="button" key_event="label" disabled={syncErrors.label ? true : false} onClick={runBodyEvent} size="mini" icon primary width={2} inline>
          <Icon name='save' />
        </Form.Button>
        <Form.Group className="items-end">
          <Field
            width={16}
            name="label"
            component={renderTextInput}
            type="text"
            label="label:"
            placeholder="label"
            size="mini"
            simple={true}
          />
        </Form.Group>
      </Segment>
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
        {/*<Message positive>
          <Message.Header>
            <Button type="button" onClick={handlerGetBounds} size="mini" icon primary width={2}>
              <Icon name='redo' />
            </Button>
            Width and Height:
          </Message.Header>
          <p>
            {`{ width: ${objBounds.width.toFixed()}, height: ${objBounds.height.toFixed()} }`}
          </p>
        </Message>*/}
      </Segment>
    </Form>
    )
};

EditComposite = reduxForm({
  initialValues: {
    ...initialVal,
    //body: 'choose',
  },
  validate,
  form: 'editCompositeForm',
  enableReinitialize : true,
  keepDirtyOnReinitialize:true,
})(EditComposite);

EditComposite = connect(
  (state,props) => {
   // console.log('props', props.objectData)
    const composite = props.objectData;
    const bodyThings = {
      ...initialVal,
      label: composite.label
    };
    //console.log(getFormSyncErrors('editCompositeForm')(state))
    return {
      initialValues: bodyThings
    }
  },
)(EditComposite);


export default EditComposite
