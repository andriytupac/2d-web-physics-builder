import React, { useState } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { connect } from 'react-redux';
import { Icon, Label, Segment, Form, Button, Popup } from 'semantic-ui-react';

import reduxInput from '../../common/reduxInputs';
import InputFields from '../../common/reduxInputs/InputFields';
import CodeModal from '../codeModal';

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
];
const selector = formValueSelector('generalSettings');

let GeneralSettingsContainer = props => {
	const { changeOptions, reloadCanvas, clearCanvas } = props;
	const { renderCheckbox, renderTextInput } = reduxInput;
	const { colorField } = InputFields;

	const { chaneSize } = useStoreActions(actions => actions.general);
	const [code, setCode] = useState(false);

	const allFields = useStoreState(state => {
		const fields = selector(
			state,
			'width',
			'height',
			'background',
			'wireframeBackground',
			'wireframes',
			'showDebug',
			'showPositions',
			'showBroadphase',
			'showBounds',
			'showVelocity',
			'showCollisions',
			'showSeparations',
			'showAxes',
			'showAngleIndicator',
			'showSleeping',
			'showIds',
			'showVertexNumbers',
			'showConvexHulls',
			'showInternalEdges',
			'enabled',
		);
		return {
			...fields,
		};
	});
	const onchange = (val, name) => {
		changeOptions(val, name);
	};
	const saveParams = () => {
		console.log(allFields);
		chaneSize({ width: allFields.width, height: allFields.height });
		onchange(allFields.width, 'width');
		onchange(allFields.height, 'height');
	};

	const runBodyEvent = (event, params) => {
		const { keyevent } = params;
		console.log(allFields, allFields[keyevent], keyevent);

		onchange(allFields[keyevent], keyevent);
	};

	return (
		<Form className="edit-bodies">
			<Popup
				trigger={
					<Button
						icon
						color="green"
						onClick={() => {
							setCode(!code);
						}}
					>
						<Icon name="code" />
					</Button>
				}
				content="get code"
				position="top center"
				size="tiny"
				inverted
			/>
			<Popup
				trigger={
					<Button icon primary onClick={reloadCanvas}>
						<Icon name="refresh" />
					</Button>
				}
				content="reload"
				position="top center"
				size="tiny"
				inverted
			/>
			<Popup
				trigger={
					<Button icon color="orange" onClick={clearCanvas}>
						<Icon name="erase" />
					</Button>
				}
				content="Clear"
				position="top center"
				size="tiny"
				inverted
			/>
			<Segment color="green">
				<Label>size:</Label>
				<Form.Button
					type="button"
					keyevent="width"
					onClick={saveParams}
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
						name="width"
						component={renderTextInput}
						type="number"
						label="width:"
						placeholder="width"
						size="mini"
						simple
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
						simple
					/>
				</Form.Group>
			</Segment>
			{colorPick.map(val => {
				return colorField(val, runBodyEvent);
			})}
			<div>
				{listOfCheckbox.map((val, index) => {
					return (
						<Field
							value={val.values}
							key={index}
							name={val.name}
							component={renderCheckbox}
							type="checkbox"
							label={val.name}
							onChange={value => {
								onchange(value, val.name);
							}}
						/>
					);
				})}
			</div>
			{code && (
				<CodeModal
					element="general"
					objectData={{ ...allFields, id: '', label: 'General' }}
					handlerClose={() => {
						setCode(!code);
					}}
				/>
			)}
		</Form>
	);
};

GeneralSettingsContainer = reduxForm({
	form: 'generalSettings',
	enableReinitialize: true,
	keepDirtyOnReinitialize: true,
})(GeneralSettingsContainer);

const GeneralSettings = connect((state, props) => {
	return {
		initialValues: props.inspectorOptions,
	};
})(GeneralSettingsContainer);

export default GeneralSettings;
