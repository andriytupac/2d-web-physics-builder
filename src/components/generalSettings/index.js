import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { connect } from 'react-redux'
import {Icon, Label, Segment, Form, Button, Popup} from "semantic-ui-react";


import reduxInput from '../../common/reduxInputs';
import InputFields from '../../common/reduxInputs/InputFields';

const listOfCheckbox = [
    { name: 'wireframes', value: false },
    { name: 'showDebug', value: true },
    { name: 'showPositions', value: false },
    { name: 'showBroadphase', value: false },
    { name: 'showBounds', value: false },
    { name: 'showVelocity', value: false },
    { name: 'showCollisions', value: false },
    { name: 'showSeparations', value: false },
    { name: 'showAxes', value: false },
    { name: 'showAngleIndicator', value: false },
    { name: 'showSleeping', value: false },
    { name: 'showIds', value: false },
    { name: 'showVertexNumbers', value: false },
    { name: 'showConvexHulls', value: false },
    { name: 'showInternalEdges', value: false },
    { name: 'enabled', value: false },
];
const colorPick = [
  { name: 'background', key: 'background', label: 'background' },
  { name: 'wireframeBackground', key: 'wireframeBackground', label: 'wireframeBackground' },
]
const selector = formValueSelector('generalSettings');

let GeneralSettings = props => {
  const { changeOptions, reloadCanvas, clearCanvas } = props;
  const { renderCheckbox, renderTextInput } = reduxInput;
  const { colorField } = InputFields;

  const { chaneSize } = useStoreActions(
    actions => actions.general
  );

  const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'width', 'height', 'background', 'wireframeBackground'
    );
    return {
      ...allFields
    }
  });
  const saveParams = () => {
    console.log(allFields)
    chaneSize({ width: allFields.width, height: allFields.height})
    onchange(allFields.width,'width')
    onchange(allFields.height,'height')
  };

  const runBodyEvent = (event, props) => {
    const { key_event } = props;
    console.log(allFields,allFields[key_event],key_event);

    onchange(allFields[key_event],key_event)


    /* modifyBody(allFields[key_event], key_event);
     if(key_event === 'scale'){
       handlerGetBounds()
     }*/
  };
  const  onchange = (val,name) => {
    changeOptions(val,name);
  };

  return (
    <Form className='edit-bodies'>
      <Popup
        trigger={
          <Button icon primary>
            <Icon name='code' />
          </Button>
        }
        content='get code'
        position='top center'
        size='tiny'
        inverted
      />
      <Popup
        trigger={
          <Button icon primary onClick={reloadCanvas}>
            <Icon name='refresh' />
          </Button>
        }
        content='reload'
        position='top center'
        size='tiny'
        inverted
      />
      <Popup
        trigger={
          <Button icon primary onClick={clearCanvas}>
            <Icon name='erase' />
          </Button>
        }
        content='Clear'
        position='top center'
        size='tiny'
        inverted
      />
      <Segment color="green">
        <Label>size:</Label>
        <Form.Button type="button" key_event="width" onClick={saveParams} size="mini" icon primary width={2} inline>
          <Icon name='save' />
        </Form.Button>
        <Form.Group className="items-end">
          <Field
            parse={Number}
            width={6}
            name="width"
            component={renderTextInput}
            type="number"
            label="width:"
            placeholder="width"
            size="mini"
            simple={true}
          />
          <Field
            parse={Number}
            width={6}
            name="height"
            component={renderTextInput}
            type="number"
            label="height:"
            placeholder="height"
            size="mini"
            simple={true}
          />
        </Form.Group>
      </Segment>
      {
        colorPick.map((val, index) => {
          return colorField(val, runBodyEvent)
        })
      }
      <div>
        {
          listOfCheckbox.map((val, index) => {
            return (
              <Field
                value={val.values}
                key={index}
                name={val.name}
                component={renderCheckbox}
                type="checkbox"
                label={val.name}
                onChange={(value) => {onchange(value,val.name)}}
              />
            )
          })
        }
      </div>
    </Form>
  )
};

GeneralSettings = reduxForm({
    form: 'generalSettings',
    enableReinitialize : true,
    keepDirtyOnReinitialize:true,
})(GeneralSettings);

GeneralSettings = connect(
  (state,props) => {
    return {
      initialValues: props.inspectorOptions
    }
  },
)(GeneralSettings);

export default GeneralSettings
