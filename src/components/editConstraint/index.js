import React from 'react';
import { reduxForm, formValueSelector, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import { useStoreState } from 'easy-peasy';

import InputFields from '../../common/reduxInputs/InputFields';

const { numberField, selectField, colorField, coordinateField, rangeField, checkboxField } = InputFields;

const initialVal = {
	rotate: {
		angle: 0.3,
		x: 0,
		y: 0,
	},
	scale: {
		scaleX: 1.1,
		scaleY: 1.1,
		x: 0,
		y: 0,
	},
};

const validate = values => {
	const errors = {};
	if (typeof values.label !== 'undefined' && values.label.length < 3) {
		errors.label = 'Should be at least 3 characters';
	}
	return errors;
};

const generalFields = [
	{ name: 'label', key: 'label', label: 'label', type: 'text' },
	{ name: 'bodyA', key: 'bodyA', label: 'bodyA', type: 'select' },
	{ name: 'pointA', key: 'pointA', label: 'pointA', type: 'coordinate' },
	{ name: 'bodyB', key: 'bodyB', label: 'bodyB', type: 'select' },
	{ name: 'pointB', key: 'pointB', label: 'pointB', type: 'coordinate' },
	{ name: 'length', key: 'length', label: 'length', type: 'number' },
	{
		name: 'stiffness',
		key: 'stiffness',
		label: 'stiffness',
		type: 'range',
		settings: { min: 0, max: 1, step: 0.01 },
	},
	{ name: 'damping', key: 'damping', label: 'damping', type: 'range', settings: { min: 0, max: 0.1, step: 0.01 } },
	{ name: 'render.lineWidth', key: 'render', label: 'lineWidth', type: 'number' },
	{ name: 'render.strokeStyle', key: 'render', label: 'strokeStyle', type: 'color' },
	{ name: 'render.type', key: 'render', label: 'type', type: 'select' },
	{ name: 'render.visible', key: 'render', label: 'visible', type: 'checkbox' },
	{ name: 'render.anchors', key: 'render', label: 'anchors', type: 'checkbox' },
];

let EditConstraintContainer = props => {
	const { objectData, modifyConstraint, inspectorOptions, formName } = props;

	const selectOptions = {};

	const selector = formValueSelector(formName);

	console.log(objectData);
	const allBodies = [];
	const allBodiesSelect = [];

	const getAllBodies = constraint => {
		constraint.bodies.forEach(val => {
			allBodies.push(val);
			allBodiesSelect.push({ key: val.id, value: val.id, text: `${val.id} ${val.label}`, body: val });
		});
		if (constraint.composites.length) {
			constraint.composites.forEach(val => {
				getAllBodies(val);
			});
		}
	};

	const syncErrors = useStoreState(state => {
		return getFormSyncErrors(formName)(state);
	});

	getAllBodies(inspectorOptions);

	selectOptions.bodyA = [{ key: 0, value: 0, text: 'Stage' }, ...allBodiesSelect];
	selectOptions.bodyB = [{ key: 0, value: 0, text: 'Stage' }, ...allBodiesSelect];
	selectOptions.type = [
		{ key: 'line', value: 'line', text: 'line' },
		{ key: 'pin', value: 'pin', text: 'pin' },
		{ key: 'spring', value: 'spring', text: 'spring' },
	];

	const allFields = useStoreState(state => {
		const fields = selector(
			state,
			'bodyA',
			'pointA',
			'bodyB',
			'pointB',
			'length',
			'stiffness',
			'damping',
			'render',
			'label',
		);
		return {
			...fields,
		};
	});

	const runBodyEvent = (event, params) => {
		const { keyevent } = params;
		console.log(allFields, allFields[keyevent], keyevent);
		if (keyevent === 'bodyA' || keyevent === 'bodyB') {
			const obj = allBodiesSelect.find(val => val.key === allFields[keyevent]);
			modifyConstraint(obj.body, keyevent);
		} else {
			modifyConstraint(allFields[keyevent], keyevent);
		}
	};

	return (
		<Form className="edit-bodies">
			{generalFields.map(val => {
				if (val.type === 'number') {
					return numberField(val, runBodyEvent);
				}
				if (val.type === 'select') {
					return selectField(val, runBodyEvent, selectOptions[val.label]);
				}
				if (val.type === 'text') {
					return numberField(val, runBodyEvent, true, syncErrors[val.name]);
				}
				if (val.type === 'color') {
					return colorField(val, runBodyEvent);
				}
				if (val.type === 'coordinate') {
					return coordinateField(val, runBodyEvent);
				}
				if (val.type === 'range') {
					return rangeField(val, runBodyEvent);
				}
				if (val.type === 'checkbox') {
					return checkboxField(val, runBodyEvent);
				}
				return '';
			})}
		</Form>
	);
};

EditConstraintContainer = reduxForm({
	initialValues: {
		...initialVal,
		// body: 'choose',
	},
	validate,
	// form: 'editConstraintForm',
	enableReinitialize: true,
	keepDirtyOnReinitialize: true,
})(EditConstraintContainer);

const EditConstraint = connect((state, props) => {
	// console.log('props', props.objectData)
	const constraint = props.objectData;
	const bodyThings = {
		...initialVal,
		bodyA: constraint.bodyA ? constraint.bodyA.id : 0,
		bodyB: constraint.bodyB ? constraint.bodyB.id : 0,
		length: constraint.length,
		label: constraint.label,
		stiffness: constraint.stiffness,
		damping: constraint.damping,
		pointA: { ...constraint.pointA },
		pointB: { ...constraint.pointB },
		render: {
			lineWidth: constraint.render.lineWidth,
			strokeStyle: constraint.render.strokeStyle,
			type: constraint.render.type,
			visible: constraint.render.visible,
			anchors: constraint.render.anchors,
		},
	};
	return {
		initialValues: bodyThings,
		form: props.formName,
	};
})(EditConstraintContainer);

export default EditConstraint;
