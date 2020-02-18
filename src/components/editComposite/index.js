import React from 'react';
import { Field, reduxForm, formValueSelector, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import { Form, Icon, Label, Segment } from 'semantic-ui-react';

import { useStoreState } from 'easy-peasy';
import reduxInput from '../../common/reduxInputs';

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

let EditCompositeContainer = props => {
	const { modifyComposite, formName } = props;

	const selector = formValueSelector(formName);

	const { renderTextInput } = reduxInput;

	const allFields = useStoreState(state => {
		const fields = selector(state, 'rotate', 'scale', 'label');
		return {
			...fields,
		};
	});

	const syncErrors = useStoreState(state => {
		return getFormSyncErrors(formName)(state);
	});

	const runBodyEvent = (event, params) => {
		const { keyevent } = params;
		console.log(allFields, allFields[keyevent], keyevent);

		modifyComposite(allFields[keyevent], keyevent);
		if (keyevent === 'scale') {
			// handlerGetBounds()
		}
	};

	return (
		<Form className="edit-bodies">
			{/* Rotation */}
			<Segment color="green">
				<Label>Label:</Label>
				<Form.Button
					type="button"
					keyevent="label"
					disabled={!!syncErrors.label}
					onClick={runBodyEvent}
					size="mini"
					icon
					primary
					width={2}
					inline
				>
					<Icon name="save" />
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
						simple
					/>
				</Form.Group>
			</Segment>
			<Segment color="green">
				<Label>Rotate:</Label>
				<Form.Button
					type="button"
					keyevent="rotate"
					onClick={runBodyEvent}
					size="mini"
					icon
					primary
					width={2}
					inline
				>
					<Icon name="save" />
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
						simple
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
						simple
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
						simple
					/>
				</Form.Group>
			</Segment>
			{/* Scale */}
			<Segment color="green">
				<Label>Scale:</Label>
				<Form.Button
					type="button"
					keyevent="scale"
					onClick={runBodyEvent}
					size="mini"
					icon
					primary
					width={2}
					inline
				>
					<Icon name="save" />
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
						simple
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
						simple
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
						simple
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
						simple
					/>
				</Form.Group>
				{/* <Message positive>
          <Message.Header>
            <Button type="button" onClick={handlerGetBounds} size="mini" icon primary width={2}>
              <Icon name='redo' />
            </Button>
            Width and Height:
          </Message.Header>
          <p>
            {`{ width: ${objBounds.width.toFixed()}, height: ${objBounds.height.toFixed()} }`}
          </p>
        </Message> */}
			</Segment>
		</Form>
	);
};

EditCompositeContainer = reduxForm({
	initialValues: {
		...initialVal,
		// body: 'choose',
	},
	validate,
	// form: 'editCompositeForm',
	enableReinitialize: true,
	keepDirtyOnReinitialize: true,
})(EditCompositeContainer);

const EditComposite = connect((state, props) => {
	// console.log('props', props.objectData)
	const composite = props.objectData;
	const bodyThings = {
		...initialVal,
		label: composite.label,
	};
	// console.log(getFormSyncErrors('editCompositeForm')(state))
	return {
		initialValues: bodyThings,
		form: props.formName,
	};
})(EditCompositeContainer);

export default EditComposite;
