import React, {useEffect} from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { connect } from 'react-redux'


import reduxInput from '../../common/reduxInputs';

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
const selector = formValueSelector('redForm');

let MatterForm1 = props => {
  const { changeOptions, inspectorOptions } = props;
  const { renderCheckbox } = reduxInput;

  const addOptions = useStoreActions(
    actions => actions.matterOptions.addOptions
  );

  /*const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'showDebug', 'showPositions', 'showBroadphase', 'showBounds', 'showVelocity', 'showCollisions',
      'showSeparations', 'showAxes', 'showAngleIndicator', 'showSleeping', 'showIds', 'showVertexNumbers',
      'showConvexHulls', 'showInternalEdges', 'enabled'
    );
    return {
      ...allFields
    }
  });*/

  const  onchange = (val,name) => {
    changeOptions(val,name);
  };
  return (
    <form>
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
    </form>
  )
};

let MatterForm = reduxForm({
    form: 'redForm',
    enableReinitialize : true,
    keepDirtyOnReinitialize:true,
})(MatterForm1);

MatterForm = connect(
  (state,props) => {
    return {
      initialValues: props.inspectorOptions
    }
  },
)(MatterForm);

export default MatterForm
