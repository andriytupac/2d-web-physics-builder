import React from 'react'
import { Button, Header, Icon, Modal, Message } from 'semantic-ui-react'

const circleBody = obj => {
  return (
    <pre>
{`const ${obj.options.label.replace(/\s/g, '')} = Bodies.circle(${obj.x}, ${obj.y}, ${obj.radius},
  ${JSON.stringify(obj.options, null, '\t')}
);
`}
    </pre>
  )
};
const polygonBody = obj => {
  return (
    <pre>
{`const ${obj.options.label.replace(/\s/g, '')} = Bodies.polygon(${obj.x}, ${obj.y}, ${obj.sides}, ${obj.radius},
  ${JSON.stringify(obj.options, null, '\t')}
);
`}
    </pre>
  )
};
const rectangleBody = obj => {
  return (
    <pre>
{`const ${obj.options.label.replace(/\s/g, '')} = Bodies.rectangle(${obj.x}, ${obj.y}, ${obj.width}, ${obj.height},
  ${JSON.stringify(obj.options, null, '\t')}
);
`}
    </pre>
  )
};
const trapezoidBody = obj => {
  return (
    <pre>
{`const ${obj.options.label.replace(/\s/g, '')} = Bodies.trapezoid(${obj.x}, ${obj.y}, ${obj.width}, ${obj.height}, ${obj.slope},
  ${JSON.stringify(obj.options, null, '\t')}
);
`}
    </pre>
  )
};
const fromVerticesBody = obj => {
  return (
    <pre>
{`const ${obj.options.label.replace(/\s/g, '')} = Bodies.fromVertices(${obj.x}, ${obj.y},
  ${JSON.stringify(obj.vertices, null, '\t')},
  ${JSON.stringify(obj.options, null, '\t')}
);
`}
    </pre>
  )
};
const carComposite = obj => {
  const label = obj.options ? obj.options.label : obj.label;
  return (
    <pre>
{`const ${label.replace(/\s/g, '')} = Composites.car(${obj.x}, ${obj.y}, ${obj.width}, ${obj.height}, ${obj.wheelSize});`}
    </pre>
  )
};
const softBodyComposite = obj => {
  const label = obj.options ? obj.options.label : obj.label;
  return (
    <pre>
{`const ${label.replace(/\s/g, '')} = Composites.softBody(${obj.x}, ${obj.y}, ${obj.columns}, ${obj.rows}, ${obj.columnGap}, ${obj.rowGap}, ${obj.crossBrace}, ${obj.particleRadius});`}
    </pre>
  )
};
const pyramidComposite = obj => {
  const label = obj.options ? obj.options.label : obj.label;
  return (
    <pre>
{`const ${label.replace(/\s/g, '')} = Composites.pyramid(${obj.x}, ${obj.y}, ${obj.columns}, ${obj.rows}, ${obj.columnGap}, ${obj.rowGap},
  (x, y) => {
    return Bodies.rectangle(x, y, ${obj.rectWidth}, ${obj.rectHeight})
  }
);`}
    </pre>
  )
};
const stackComposite = obj => {
  const label = obj.options ? obj.options.label : obj.label;
  return (
    <pre>
{`const ${label.replace(/\s/g, '')} = Composites.stack(${obj.x}, ${obj.y}, ${obj.columns}, ${obj.rows}, ${obj.columnGap}, ${obj.rowGap},
  (x, y) => {
    return Bodies.rectangle(x, y, ${obj.rectWidth}, ${obj.rectHeight})
  }
);`}
    </pre>
  )
};
const newtonsCradleComposite = obj => {
  const label = obj.options ? obj.options.label : obj.label;
  return (
    <pre>
{`const ${label.replace(/\s/g, '')} = Composites.newtonsCradle(${obj.x}, ${obj.y}, ${obj.number}, ${obj.size}, ${obj.length});`}
    </pre>
  )
};
const customComposite = obj => {
  const label = obj.options ? obj.options.label : obj.label;
  return (
    <pre>
{`const ${label.replace(/\s/g, '')} = Composite.create({ label: ${label} });`}
    </pre>
  )
};

const GeneralBodies = props => {
  const {
    handlerClose,
    objectData,
    element
  } = props;
  console.log(objectData)
  const label = (objectData.options && objectData.options.label) ? objectData.options.label : objectData.label;
  return (
    <Modal
      open={true}
      onClose={handlerClose}
      closeIcon>
      <Header icon='male' content={`${objectData.body} -> ${label} `} />
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
          </code>
        </Message>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red'>
          <Icon name='remove' /> No
        </Button>
        <Button color='green'>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  )};

export default GeneralBodies
