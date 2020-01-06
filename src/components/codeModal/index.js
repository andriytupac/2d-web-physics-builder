import React from 'react'
import { Button, Header, Icon, Modal, Message } from 'semantic-ui-react'


let multiplyElements = [];

const bodyElement = obj => {
  const width = Math.abs(obj.bounds.max.x - obj.bounds.min.x).toFixed();
  const height = Math.abs(obj.bounds.max.y - obj.bounds.min.y).toFixed();
  const vector = [];
  const render = obj.render;
  delete render.sprite;
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
    vector.push({x: +val.x.toFixed(), y: +val.y.toFixed()})
  });

  if(obj.circleRadius) {
    return (
      <pre>
{`const ${obj.label.replace(/\s/g, '')}${obj.id} = Bodies.circle(${obj.position.x.toFixed()}, ${obj.position.y.toFixed()}, ${(width/2).toFixed()},
  ${JSON.stringify(generalParams, null, '\t')}
);
`}
    </pre>
    )
  } else if(obj.vertices.length === 4) {
    return (
      <pre>
{`const ${obj.label.replace(/\s/g, '')}${obj.id} = Bodies.rectangle(${obj.position.x.toFixed()}, ${obj.position.y.toFixed()}, ${width}, ${height},
  ${JSON.stringify(generalParams, null, '\t')}
);
`}
      </pre>
    )
  } else {
    return (
      <pre>
{`const ${obj.label.replace(/\s/g, '')}${obj.id} = Bodies.fromVertices(${obj.position.x.toFixed()}, ${obj.position.y.toFixed()},
  ${JSON.stringify(vector, null, '\t')},
  ${JSON.stringify(generalParams, null, '\t')}
);
`}
      </pre>
    )
  }
};

const constraintElement = obj => {
  const generalParams = {};
  if(obj.bodyA){
    generalParams.bodyA = obj.bodyA.label.replace(/\s/g, '')+obj.bodyA.id;
  }
  if(obj.bodyB){
    generalParams.bodyB = obj.bodyB.label.replace(/\s/g, '')+obj.bodyB.id;
  }
  generalParams.pointA = obj.pointA;
  generalParams.pointB = obj.pointB;
  generalParams.length = +obj.length.toFixed();
  generalParams.label = obj.label;
  generalParams.stiffness = obj.stiffness;
  generalParams.damping = obj.damping;
  generalParams.render = obj.render;
  //generalParams.render = obj.render;
  console.log(obj,generalParams)
  let finalJSON = JSON.stringify(generalParams, null, '\t');
  if(obj.bodyA){
    finalJSON = finalJSON.replace(`"${generalParams.bodyA}"`,generalParams.bodyA);
  }
  if(obj.bodyB){
    finalJSON = finalJSON.replace(`"${generalParams.bodyB}"`,generalParams.bodyB);
  }
  return (
    <>
    {obj.bodyA && !multiplyElements.includes(obj.bodyA.id) && bodyElement(obj.bodyA )}
    {obj.bodyB && !multiplyElements.includes(obj.bodyB.id) && bodyElement(obj.bodyB )}
    <pre>
{`const ${obj.label.replace(/\s/g, '')}${obj.id} = Constraint.create(
  ${finalJSON}
);
`}
    </pre>
    </>
  )
};

const compositeElement = obj => {
  multiplyElements = [];
  return (
    <>
    <pre>
{`const ${obj.label.replace(/\s/g, '')}${obj.id} = Composite.create({ label:"${obj.label}" });
`}
    </pre>
      {obj.bodies.map((val,index) => {
        multiplyElements.push(val.id)
        return (<div key={index}>{bodyElement(val)}</div>)
      })}
      {obj.constraints.map((val,index) => {
        return (<div key={index}>{constraintElement(val)}</div>)
      })}
    </>
  )
};

const CodeModal = props => {
  const {
    handlerClose,
    objectData,
    element
  } = props;
  return (
    <Modal
      open={true}
      onClose={handlerClose}
      closeIcon>
      <Header icon='male' content={`${objectData.id} ${objectData.label}`} />
      <Modal.Content scrolling>
        <Message positive>
          <code>
            {element === 'body' && bodyElement(objectData)}
            {element === 'constraint' && constraintElement(objectData)}
            {element === 'composite' && compositeElement(objectData)}
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

export default CodeModal
