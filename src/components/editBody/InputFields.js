import React, { useState } from "react";
import {Icon, Label, Segment, Form} from "semantic-ui-react";
import {Field} from "redux-form";
import reduxInput from "../../common/reduxInputs";
const { renderDropdown, renderTextInput, ColorPicker, renderRange, renderCheckbox } = reduxInput;


const numberField = (val, callback, parse) => {
  return (
    <Segment color="green" key={val.name}>
      <Label>{val.label}:</Label>
      <Form.Button
        type="button"
        key_event={val.key}
        onClick={callback}
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
          parse={ parse ? String : Number }
          width={16}
          name={val.name}
          component={renderTextInput}
          type={ parse ? 'text' : 'number' }
          label={`${val.name}:`}
          placeholder={val.name}
          size="mini"
          simple={true}
        />
      </Form.Group>
    </Segment>
  )
};
const checkboxField = (val, callback) => {
  return (
    <Segment color="green" key={val.name}>
      <Label>{val.label}:</Label>
      <Form.Button type="button" key_event={val.key} onClick={callback} size="mini" icon primary width={2} inline>
        <Icon name='save' />
      </Form.Button>
      <Form.Group className="items-end">
        <Field
          width={16}
          name={val.name}
          component={renderCheckbox}
          type="text"
          label={val.label}
          placeholder={val.label}
          size="mini"
          simple={true}
        />
      </Form.Group>
    </Segment>
  )
};
const rangeField = (val, callback) => {
  return (
    <Segment color="green" key={val.name}>
      <Label>{val.label}:</Label>
      <Form.Button
        type="button"
        key_event={val.key}
        onClick={callback}
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
          settings={{...val.settings, name: val.name}}
          name={val.name}
          component={renderRange}
          type="number"
        />
      </Form.Group>
    </Segment>
  )
};
const coordinateField = (val, callback) => {
  return (
    <Segment color="green" key={val.name}>
      <Label>{val.label}:</Label>
      <Form.Button
        type="button"
        key_event={val.key}
        onClick={callback}
        size="mini"
        icon
        primary
        width={2}
        inline
      >
        <Icon name='save' />
      </Form.Button>
      <Form.Group className="items-end" widths='equal'>
        {/*<Label>pointA:</Label>*/}
        <Field
          parse={Number}
          width={16}
          name={`${val.name}.x`}
          component={renderTextInput}
          type="number"
          label={`x:`}
          placeholder={`x`}
          size="mini"
          simple={true}
        />
        <Field
          parse={Number}
          width={16}
          name={`${val.name}.y`}
          component={renderTextInput}
          type="number"
          label={`y:`}
          placeholder={`y`}
          size="mini"
          simple={true}
        />
      </Form.Group>
    </Segment>
  )
};
const selectField = (val, callback, allCategories) => {
  return (
    <Segment color="green" key={val.name}>
      <Label>{val.label}:</Label>
      <Form.Button
        type="button"
        key_event={val.key}
        onClick={callback}
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
          label={val.name}
          // onChange={changePositionA}
          simple={true}
          name={val.name}
          component={renderDropdown}
          type="number"
          placeholder={val.name}
          size="mini"
          options={[...allCategories]}
        />
      </Form.Group>
    </Segment>
  )
};
const colorField = (val, callback, allCategories) => {
  return (
    <Segment color="green" key={val.name}>
      <Label>{val.label}:</Label>
      <Form.Button
        type="button"
        key_event={val.key}
        onClick={callback}
        size="mini"
        icon
        primary
        width={2}
        inline
      >
        <Icon name='save' />
      </Form.Button>
      <Field
        label={val.name}
        //onChange={changePositionA}
        simple={true}
        name={val.name}
        component={ColorPicker}
        type="number"
        size="mini"
      />
    </Segment>
  )
};

const InputFields = {
  numberField,
  selectField,
  colorField,
  coordinateField,
  rangeField,
  checkboxField
};

export default InputFields
