import React, { useRef, useState } from 'react';
import { Button, Header, Icon, Modal, Message } from 'semantic-ui-react';

let multiplyElements = [];
let textAreaRef;

const generateCode = textCode => (
	<pre>
		{textCode}
		<textarea className="hide-textarea" ref={textAreaRef} defaultValue={textCode} />
	</pre>
);

export const bodyElement = (obj, getCode) => {
	const width = Math.abs(obj.bounds.max.x - obj.bounds.min.x).toFixed();
	const height = Math.abs(obj.bounds.max.y - obj.bounds.min.y).toFixed();
	const vector = [];
	const { render } = obj;
	// delete render.sprite;
	const generalParams = {};
	generalParams.isStatic = obj.isStatic;
	generalParams.label = obj.label;
	generalParams.density = obj.density;
	generalParams.friction = obj.friction;
	generalParams.frictionStatic = obj.frictionStatic;
	generalParams.frictionAir = obj.frictionAir;
	generalParams.restitution = obj.restitution;
	generalParams.mass = obj.mass;
	generalParams.render = render;
	generalParams.collisionFilter = obj.collisionFilter;
	obj.vertices.forEach(val => {
		vector.push({ x: +val.x.toFixed(), y: +val.y.toFixed() });
	});

	if (obj.circleRadius) {
		const textCode = `const ${obj.label.replace(/\s/g, '')}${
			obj.id
		} = Bodies.circle(${obj.position.x.toFixed()}, ${obj.position.y.toFixed()}, ${(width / 2).toFixed()},
  ${JSON.stringify(generalParams, null, '\t')}
);
`;
		if (getCode) return textCode;

		return generateCode(textCode);
	}
	if (obj.vertices.length === 4) {
		const textCode = `const ${obj.label.replace(/\s/g, '')}${
			obj.id
		} = Bodies.rectangle(${obj.position.x.toFixed()}, ${obj.position.y.toFixed()}, ${width}, ${height},
  ${JSON.stringify(generalParams, null, '\t')}
);
`;
		if (getCode) return textCode;

		return generateCode(textCode);
	}
	const textCode = `const ${obj.label.replace(/\s/g, '')}${
		obj.id
	} = Bodies.fromVertices(${obj.position.x.toFixed()}, ${obj.position.y.toFixed()},
  ${JSON.stringify(vector, null, '\t')},
  ${JSON.stringify(generalParams, null, '\t')}
);
`;
	if (getCode) return textCode;

	return generateCode(textCode);
};

const constraintElement = (obj, getCode) => {
	const generalParams = {};
	let textCode = '';

	if (obj.bodyA) {
		generalParams.bodyA = obj.bodyA.label.replace(/\s/g, '') + obj.bodyA.id;
	}
	if (obj.bodyB) {
		generalParams.bodyB = obj.bodyB.label.replace(/\s/g, '') + obj.bodyB.id;
	}
	generalParams.pointA = obj.pointA;
	generalParams.pointB = obj.pointB;
	generalParams.length = +obj.length.toFixed();
	generalParams.label = obj.label;
	generalParams.stiffness = obj.stiffness;
	generalParams.damping = obj.damping;
	generalParams.render = obj.render;
	// generalParams.render = obj.render;
	console.log(obj, generalParams);
	let finalJSON = JSON.stringify(generalParams, null, '\t');
	if (obj.bodyA) {
		finalJSON = finalJSON.replace(`"${generalParams.bodyA}"`, generalParams.bodyA);
	}
	if (obj.bodyB) {
		finalJSON = finalJSON.replace(`"${generalParams.bodyB}"`, generalParams.bodyB);
	}

	textCode += obj.bodyA && !multiplyElements.includes(obj.bodyA.id) ? bodyElement(obj.bodyA, true) : '';
	textCode += obj.bodyB && !multiplyElements.includes(obj.bodyB.id) ? bodyElement(obj.bodyB, true) : '';
	textCode += `
const ${obj.label.replace(/\s/g, '')}${obj.id} = Constraint.create(
  ${finalJSON}
);
`;

	if (getCode) return textCode;

	return generateCode(textCode);
};

const compositeElement = obj => {
	multiplyElements = [];
	let textCode = '';

	textCode += `const ${obj.label.replace(/\s/g, '')}${obj.id} = Composite.create({ label:"${obj.label}" });
`;
	obj.bodies.forEach(val => {
		multiplyElements.push(val.id);
		textCode += bodyElement(val, true);
	});
	obj.constraints.forEach(val => {
		textCode += constraintElement(val, true);
	});
	textCode += `Composite.add(${obj.label.replace(/\\s/g, '')}${obj.id} , object)`;

	return generateCode(textCode);
};

const generalElement = generalParams => {
	console.log(generalParams);

	let textCode = '';
	// eslint-disable-next-line no-param-reassign
	delete generalParams.id;
	// eslint-disable-next-line no-param-reassign
	delete generalParams.label;
	const finalJSON = JSON.stringify(generalParams, null, '\t');

	textCode += `const engine = Engine.create();
`;
	textCode += `const render = Render.create({
      element: sceneEl.current,
      engine: engine,
      options:
        ${finalJSON}
});
    `;
	return generateCode(textCode);
};

const CodeModal = props => {
	const { handlerClose, objectData, element } = props;

	const [copySuccess, setCopySuccess] = useState(false);
	textAreaRef = useRef(null);

	const handlerCopy = e => {
		textAreaRef.current.select();
		document.execCommand('copy');
		e.target.focus();
		setCopySuccess(true);
	};

	return (
		<Modal open onClose={handlerClose} closeIcon>
			<Header icon="male" content={`${objectData.id} ${objectData.label}`} />
			<Modal.Content scrolling>
				<Message positive>
					<code>
						{element === 'body' && bodyElement(objectData, false)}
						{element === 'constraint' && constraintElement(objectData, false)}
						{element === 'composite' && compositeElement(objectData)}
						{element === 'general' && generalElement(objectData)}
					</code>
				</Message>
			</Modal.Content>
			<Modal.Actions>
				<Button color="green" onClick={handlerCopy}>
					<Icon name={copySuccess ? 'checkmark' : 'copy'} /> Copy
				</Button>
			</Modal.Actions>
		</Modal>
	);
};
export default CodeModal;
