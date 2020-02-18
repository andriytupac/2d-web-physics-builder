import React, { useRef, useState } from 'react';
import { Button, Header, Icon, Modal, Message } from 'semantic-ui-react';
import { bodyElement } from '.';

let textAreaRef;

const generateCode = textCode => (
	<pre>
		{textCode}
		<textarea className="hide-textarea" ref={textAreaRef} defaultValue={textCode} />
	</pre>
);

const circleBody = obj => {
	const textCode = `const ${obj.options.label.replace(/\s/g, '')} = Bodies.circle(${obj.x}, ${obj.y}, ${obj.radius},
  ${JSON.stringify(obj.options, null, '\t')}
);`;
	return generateCode(textCode);
};

const polygonBody = obj => {
	const textCode = `const ${obj.options.label.replace(/\s/g, '')} = Bodies.polygon(${obj.x}, ${obj.y}, ${
		obj.sides
	}, ${obj.radius},
  ${JSON.stringify(obj.options, null, '\t')}
);`;
	return generateCode(textCode);
};

const rectangleBody = obj => {
	const textCode = `const ${obj.options.label.replace(/\s/g, '')} = Bodies.rectangle(${obj.x}, ${obj.y}, ${
		obj.width
	}, ${obj.height},
  ${JSON.stringify(obj.options, null, '\t')}
);`;
	return generateCode(textCode);
};

const trapezoidBody = obj => {
	const textCode = `const ${obj.options.label.replace(/\s/g, '')} = Bodies.trapezoid(${obj.x}, ${obj.y}, ${
		obj.width
	}, ${obj.height}, ${obj.slope},
  ${JSON.stringify(obj.options, null, '\t')}
);
`;
	return generateCode(textCode);
};

const fromVerticesBody = obj => {
	const textCode = `const ${obj.options.label.replace(/\s/g, '')} = Bodies.fromVertices(${obj.x}, ${obj.y},
  ${JSON.stringify(obj.vertices, null, '\t')},
  ${JSON.stringify(obj.options, null, '\t')}
);`;
	return generateCode(textCode);
};

const carComposite = obj => {
	const label = obj.options ? obj.options.label : obj.label;
	const textCode = `const ${label.replace(/\s/g, '')} = Composites.car(${obj.x}, ${obj.y}, ${obj.width}, ${
		obj.height
	}, ${obj.wheelSize});`;
	return generateCode(textCode);
};

const softBodyComposite = obj => {
	const label = obj.options ? obj.options.label : obj.label;
	const textCode = `const ${label.replace(/\s/g, '')} = Composites.softBody(${obj.x}, ${obj.y}, ${obj.columns}, ${
		obj.rows
	}, ${obj.columnGap}, ${obj.rowGap}, ${obj.crossBrace}, ${obj.particleRadius});`;
	return generateCode(textCode);
};

const pyramidComposite = obj => {
	const label = obj.options ? obj.options.label : obj.label;
	const textCode = `const ${label.replace(/\s/g, '')} = Composites.pyramid(${obj.x}, ${obj.y}, ${obj.columns}, ${
		obj.rows
	}, ${obj.columnGap}, ${obj.rowGap},
  (x, y) => {
    return Bodies.rectangle(x, y, ${obj.rectWidth}, ${obj.rectHeight})
  }
);`;
	return generateCode(textCode);
};

const stackComposite = obj => {
	const label = obj.options ? obj.options.label : obj.label;
	const textCode = `const ${label.replace(/\s/g, '')} = Composites.stack(${obj.x}, ${obj.y}, ${obj.columns}, ${
		obj.rows
	}, ${obj.columnGap}, ${obj.rowGap},
  (x, y) => {
    return Bodies.rectangle(x, y, ${obj.rectWidth}, ${obj.rectHeight})
  }
);`;
	return generateCode(textCode);
};

const newtonsCradleComposite = obj => {
	const label = obj.options ? obj.options.label : obj.label;
	const textCode = `const ${label.replace(/\s/g, '')} = Composites.newtonsCradle(${obj.x}, ${obj.y}, ${obj.number}, ${
		obj.size
	}, ${obj.length});`;
	return generateCode(textCode);
};

const customComposite = obj => {
	const label = obj.options ? obj.options.label : obj.label;
	const textCode = `const ${label.replace(/\s/g, '')} = Composite.create({ label: '${label}' });`;
	return generateCode(textCode);
};

const constraintCon = (obj, getBody) => {
	const label = obj.options && obj.options.label ? obj.options.label : obj.label;
	const generalParams = { ...obj.options };

	generalParams.label = label;
	generalParams.pointA = obj.pointA;
	generalParams.pointB = obj.pointB;
	generalParams.length = obj.length;
	generalParams.stiffness = obj.stiffness;
	generalParams.damping = obj.damping;
	generalParams.render = obj.render;

	let bodyA = {};
	let bodyB = {};
	let textCode = '';

	if (obj.bodyA) {
		bodyA = getBody(obj.bodyA);
		generalParams.bodyA = bodyA.label.replace(/\s/g, '') + bodyA.id;
	}
	if (obj.bodyB) {
		bodyB = getBody(obj.bodyB);
		generalParams.bodyB = bodyB.label.replace(/\s/g, '') + bodyB.id;
	}

	let finalJSON = JSON.stringify(generalParams, null, '\t');
	if (obj.bodyA) {
		finalJSON = finalJSON.replace(`"${generalParams.bodyA}"`, generalParams.bodyA);
	}
	if (obj.bodyB) {
		finalJSON = finalJSON.replace(`"${generalParams.bodyB}"`, generalParams.bodyB);
	}

	textCode += obj.bodyA !== 0 ? bodyElement(bodyA, true) : '';
	textCode += obj.bodyB !== 0 ? bodyElement(bodyB, true) : '';
	textCode += `const ${label.replace(/\s/g, '')} = Constraint.create( ${finalJSON} );`;

	return generateCode(textCode);
};

const GeneralBodies = props => {
	const { handlerClose, objectData, getBody } = props;

	const [copySuccess, setCopySuccess] = useState(false);
	textAreaRef = useRef(null);

	const handlerCopy = e => {
		textAreaRef.current.select();
		document.execCommand('copy');
		e.target.focus();
		setCopySuccess(true);
	};

	console.log(objectData);
	const label = objectData.options && objectData.options.label ? objectData.options.label : objectData.label;
	return (
		<Modal open onClose={handlerClose} closeIcon>
			<Header icon="male" content={`${objectData.body} -> ${label} `} />
			<Modal.Content scrolling>
				<Message positive>
					<code>
						{objectData.body === 'circle' && circleBody(objectData)}
						{objectData.body === 'polygon' && polygonBody(objectData)}
						{objectData.body === 'rectangle' && rectangleBody(objectData)}
						{objectData.body === 'trapezoid' && trapezoidBody(objectData)}
						{objectData.body === 'fromVertices' && fromVerticesBody(objectData)}
						{objectData.body === 'car' && carComposite(objectData)}
						{objectData.body === 'softBody' && softBodyComposite(objectData)}
						{objectData.body === 'newtonsCradle' && newtonsCradleComposite(objectData)}
						{objectData.body === 'custom' && customComposite(objectData)}
						{objectData.body === 'pyramid' && pyramidComposite(objectData)}
						{objectData.body === 'stack' && stackComposite(objectData)}
						{objectData.body === 'constraint' && constraintCon(objectData, getBody)}
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

export default GeneralBodies;
