import React, { useState } from "react";
import { Form, Label, Input, Dropdown } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import { SketchPicker } from 'react-color';

const renderCheckbox = field => {
  return (
    <Form.Checkbox
      checked={field.input.value  ? true : false}
      //toggle={true}
      //defaultChecked={field.input.value  ? true : false}
      name={field.input.name}
      label={field.label}
      onBlur={field.input.onBlur}
      onFocus={field.input.onFocus}
      onChange={(e, { checked }) => field.input.onChange(checked)}
    />
)};

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
    props.error =  error
  }
  {/*<label className={field.simple ? '' : 'modify-label ui label'}>{field.label}</label>*/}
  {/*<Form.Field
      inline={field.simple ? false : true}
      width={field.width}
    >*/}
  // </Form.Field>

  return (
      <Form.Input
        inline={field.simple ? false : true}
        width={field.width}
        label={{ className: field.simple ? '' : 'modify-label ui label',   children: field.label}}
        {...props}
        //error={{ content: 'Please enter your first name', pointing: 'above' }}
        size={field.size}
        {...field.input}
        type={field.type}
        placeholder={field.placeholder}
      />
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
      {field.label && (<Label>{field.label}</Label>)}
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

const ColorPicker = field => {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(field.input.value);

  const handleOpen = () => {
    setOpen(!open)
  };
  const handleClose = () => {
    setOpen(false)
  };

  const handleChange = color => {
    setColor(color.hex);
    field.input.onChange(color.hex);
  };


  return (
    <div className="picker-block field">
      <label className={field.simple ? '' : 'modify-label ui label'}>{field.label}:</label>
      <div className="picker-click" onClick={handleOpen}>
        <div className="picker-color" style={{backgroundColor: color}}/>
      </div>
      {
        open && (
          <div>
            <div className="picker-cover" onClick={ handleClose }/>
            <SketchPicker color={ color } onChange={ handleChange }  />
          </div>
        )
      }
    </div>
  )
};

const reduxInputs = {
  renderCheckbox,
  renderRadio,
  renderSelect,
  renderDropdown,
  renderTextArea,
  renderRange,
  renderTextInput,
  ColorPicker
}
export default reduxInputs;
