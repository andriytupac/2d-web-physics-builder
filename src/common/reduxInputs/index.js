import React, { useState } from 'react';
import { Form, Label, Dropdown, Button } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';
import { SketchPicker } from 'react-color';

const renderCheckbox = field => {
	return (
		<Form.Checkbox
			checked={!!field.input.value}
			toggle={field.toggle}
			// defaultChecked={field.input.value  ? true : false}
			name={field.input.name}
			label={field.label}
			onBlur={field.input.onBlur}
			onFocus={field.input.onFocus}
			onChange={(e, { checked }) => field.input.onChange(checked)}
		/>
	);
};

const renderRadio = field => (
	<Form.Radio
		checked={field.input.value === field.radioValue}
		label={field.label}
		name={field.input.name}
		/* eslint-disable-next-line no-unused-vars */
		onChange={(e, { checked }) => field.input.onChange(field.radioValue)}
	/>
);
const renderSelect = field => {
	const {
		meta: { touched, error },
		input,
	} = field;
	const props = {};
	if (error && touched) {
		props.error = { content: error, pointing: 'below' };
	}
	return (
		<Form.Select
			{...input}
			label={field.label}
			name={field.input.name}
			onBlur={field.input.onBlur}
			onFocus={field.input.onFocus}
			onChange={(e, { value }) => field.input.onChange(value)}
			options={field.options}
			placeholder={field.placeholder}
			value={field.input.value}
			{...props}
		/>
	);
};

const renderTextArea = field => <Form.TextArea {...field.input} label={field.label} placeholder={field.placeholder} />;
const renderTextInput = field => {
	const {
		meta: { touched, error },
	} = field;
	const props = {};
	if (error && touched) {
		props.error = error;
	}

	return (
		<Form.Input
			inline={!field.simple}
			width={field.width}
			label={{ className: field.simple ? '' : 'modify-label ui label', children: field.label }}
			{...props}
			// error={{ content: 'Please enter your first name', pointing: 'above' }}
			size={field.size}
			{...field.input}
			type={field.type}
			placeholder={field.placeholder}
		/>
	);
};

const renderRange = field => {
	const settings = {
		...field.settings,
		onChange: value => {
			// eslint-disable-next-line no-restricted-globals
			if (!isNaN(value)) {
				field.input.onChange(value);
			}
		},
	};
	return (
		<div className="range-block">
			{field.label && <Label>{field.label}</Label>}
			<Slider className="slider-range" color="red" value={field.input.value} settings={settings} />
			<Label color="red">{field.input.value || 0}</Label>
		</div>
	);
};

const renderDropdown = field => {
	const {
		meta: { touched, error },
	} = field;
	const props = {};
	if (error && touched) {
		props.error = true;
	}
	return (
		<Form.Field inline={!field.simple} width={field.width} {...props}>
			{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
			<label className={field.simple ? '' : 'modify-label ui label'}>{field.label}</label>
			<Dropdown
				// size={field.size}
				className={field.size}
				// {...field.input}
				// onBlur={field.input.onBlur}
				onFocus={field.input.onFocus}
				defaultValue={field.input.value}
				placeholder={field.placeholder}
				search
				selection
				options={field.options}
				onChange={(event, obj) => {
					field.input.onChange(obj.value);
				}}
			/>
		</Form.Field>
	);
};

const ColorPicker = field => {
	const [open, setOpen] = useState(false);
	const [color, setColor] = useState(field.input.value);

	const handleOpen = () => {
		field.input.onBlur();
		field.input.onFocus();
		setOpen(true);
	};
	/* const handleClose = () => {
    setOpen(false)
  }; */

	const handleChange = colorHex => {
		setColor(colorHex.hex);
		// /field.input.onChange(color.hex);
	};
	const cancelPick = () => {
		setColor(field.input.value);
		setOpen(false);
	};
	const confirmPick = () => {
		console.log(color);
		field.input.onChange(color);
		setOpen(false);
	};

	return (
		<div className="picker-block field">
			{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
			<label className={field.simple ? '' : 'modify-label ui label'}>{field.label}:</label>
			<div className="picker-click">
				{/* eslint-disable-next-line max-len */}
				{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
				<div className="picker-color" onClick={handleOpen} style={{ backgroundColor: color }} />
				{open && (
					<>
						<Button color="green" size="mini" onClick={confirmPick}>
							Choose
						</Button>
						<Button color="orange" size="mini" onClick={cancelPick}>
							Cancel
						</Button>
					</>
				)}
			</div>
			{open && (
				<div>
					{/* <div className="picker-cover" onClick={ handleClose }/> */}
					<SketchPicker color={color} onChange={handleChange} />
				</div>
			)}
		</div>
	);
};

const reduxInputs = {
	renderCheckbox,
	renderRadio,
	renderSelect,
	renderDropdown,
	renderTextArea,
	renderRange,
	renderTextInput,
	ColorPicker,
};
export default reduxInputs;
