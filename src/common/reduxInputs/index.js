import React, { useState } from "react";
import { Form, Label, Input } from "semantic-ui-react";
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
  const { meta: { touched, error, warning }, input } = field;
  const props = {}
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
const renderTextInput = field => (
  <Form.Field
    inline={field.simple ? false : true}
    width={field.width}
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
      <Slider className="slider-range" value color="red" value={field.input.value || 0} settings={settings} />
      <Label color="red">{field.input.value || 0}</Label>
    </div>
  )
};

const reduxInputs = {
  renderCheckbox,
  renderRadio,
  renderSelect,
  renderTextArea,
  renderRange,
  renderTextInput
}
export default reduxInputs;
