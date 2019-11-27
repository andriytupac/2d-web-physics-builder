import React, { useState } from "react";
import { Form, Label, Input, Dropdown } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";

const renderCheckbox = field => (
  <Form.Checkbox
    checked={!!field.input.value}
    name={field.input.name}
    label={field.label}
    onChange={(e, { checked }) => field.input.onChange(checked)}
  />
);

const renderRadio = field => (
  <Form.Radio
    checked={field.input.value === field.radioValue}
    label={field.label}
    name={field.input.name}
    onChange={(e, { checked }) => field.input.onChange(field.radioValue)}
  />
);

const renderSelect = field => {
  const { meta: { touched, error }, input } = field;
  const props = {};
  if(error && touched){
    props.error = {content: error, pointing: 'below'}
  }
  return (
    <Form.Select
      {...input}
      label={field.label}
      name={field.input.name}
      onChange={(e, {value}) => field.input.onChange(value)}
      options={field.options}
      placeholder={field.placeholder}
      value={field.input.value}
      {...props}
    />
  );
}

const renderTextArea = field => (
  <Form.TextArea
    {...field.input}
    label={field.label}
    placeholder={field.placeholder}
  />
);
const renderTextInput = field => {
  const { meta: { touched, error } } = field;
  const props = {};
  if(error && touched){
    props.error = true
  }
  return (
    <Form.Field
      inline={field.simple ? false : true}
      width={field.width}
      {...props}
    >
      <label className={field.simple ? '' : 'modify-label ui label'}>{field.label}</label>
      <Input
        size={field.size}
        {...field.input}
        type={field.type}
        placeholder={field.placeholder}
      />
    </Form.Field>
  );
}

const renderRange = field => {
  const settings = {
    ...field.settings,
    onChange: value => {
      if(!isNaN(value)){
        field.input.onChange(value);
      }
    }
  };
  return (
    <div className="range-block">
      <Label>{field.label}</Label>
      <Slider className="slider-range" color="red" value={field.input.value} settings={settings} />
      <Label color="red">{field.input.value || 0}</Label>
    </div>
  )
};

const renderDropdown = field => {
  const { meta: { touched, error } } = field;
  const props = {};
  if(error && touched){
    props.error = true
  }
  return (
    <Form.Field
      inline={field.simple ? false : true}
      width={field.width}
      {...props}
    >
      <label className={field.simple ? '' : 'modify-label ui label'}>{field.label}</label>
      <Dropdown
        //size={field.size}
        className={field.size}
        //{...field.input}
        defaultValue={field.input.value}
        placeholder={field.placeholder}
        search
        selection
        options={field.options}
        onChange={(event,obj) => {field.input.onChange(obj.value)}}
      />

    </Form.Field>
  )
};

const reduxInputs = {
  renderCheckbox,
  renderRadio,
  renderSelect,
  renderDropdown,
  renderTextArea,
  renderRange,
  renderTextInput
}
export default reduxInputs;
