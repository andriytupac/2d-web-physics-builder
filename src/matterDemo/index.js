import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';

import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';
import rect from '../img/block.png'
import decomp from 'poly-decomp';
window.decomp = decomp;

Matter.Plugin.register(IndexPosition);
Matter.Plugin.register(ConstraintInspector);
//Matter.Plugin.register(decomp);
Matter.use(
  'matter-zIndex-plugin',
  'constraint-inspector',
);

let render;

function MatterDemo(props){

  const { runInspector } = props;

  const { restart } = useStoreState(
    state => state.general
  );
  const sceneEl = useRef(null);

  const Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Mouse = Matter.Mouse,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint;

  useEffect(() => {
    const engine = Engine.create({
      // positionIterations: 20
    });

    render = Render.create({
      element: sceneEl.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        showBounds: false
      }
    });

    /******* connect inspector ******/
    let inspector = {
      //engine: engine,
      sceneElement: sceneEl.current,
      render: render,
      options: render.options,
      selectStart: null,
      selectBounds: render.bounds,
      selected: []
    };
    runInspector(inspector);
    /******* connect inspector ******/


    const ballA = Bodies.rectangle(310, 100, 30,30, { restitution: 0.5 , isStatic: true, render:{ zIndex: -1 }});
    const ballC = Bodies.rectangle(310, 100, 30,30, { restitution: 0.5 , isStatic: false, render:{ zIndex: -1 }});
    const ballB = Bodies.circle(110, 50, 30, { restitution: 0.5, render:{ zIndex: -1} });

    const constraintAB = Matter.Constraint.create({
      pointA: {x:400,y:100},
      //pointB: {x:15,y:15},
      //bodyA: ballA,
      bodyB: ballB
    });
    //////r
    const fromVertices1 = Bodies.fromVertices(400, 500,
      [
        {
          "x": 0,
          "y": 0,
          "index": 0,
          "isInternal": false
        },
        {
          "x": 40,
          "y": 0,
          "index": 1,
          "isInternal": false
        },
        {
          "x": 40,
          "y": 20,
          "index": 2,
          "isInternal": false
        },
        {
          "x": 20,
          "y": 20,
          "index": 3,
          "isInternal": false
        },
        {
          "x": 20,
          "y": 40,
          "index": 4,
          "isInternal": false
        },
        {
          "x": 0,
          "y": 40,
          "index": 5,
          "isInternal": false
        }
      ],
      {
        isStatic: true,
        "density": 0.001,
        "friction": 0.1,
        "frictionStatic": 0.5,
        "frictionAir": 0.01,
        "restitution": 0,
        "label": "fromVertices",
        /*render: {
          "sprite": {
            "xScale": 1,
            "yScale": 1,
            "xOffset": 0.41666666666666663,
            "yOffset": 0.41666666666666663,
            texture: rect
          },
        }*/
      },
      true
    );
    fromVertices1.parts[1].render ={
      ...fromVertices1.parts[1].render,
      "sprite": {
        "xScale": 1,
        "yScale": 1,
        "xOffset": 0.41666666666666663,
        "yOffset": 0.41666666666666663,
        texture: rect
      },
    };
    //////r

    const scale = 1;
    const { width, height } = render.options;
    World.add(engine.world, [
      // walls
      Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true, label: 'Top wall' }),
      Bodies.rectangle(width / 2, height, width, 50, { isStatic: true, label: 'Bottom wall'  }),
      Bodies.rectangle(width , height / 2, 50, height, { isStatic: true, label: 'Right wall' }),
      Bodies.rectangle(0, height / 2, 50, height, { isStatic: true, label: 'Left wall' }),
      Composites.car(150, 300, 150 * scale, 30 * scale, 30 * scale),
      fromVertices1
      //Composites.car(200, 200, 200, 30, {xx:50,yy: 100, width: 100,height: 100,wheelSize: 30 }),
    ]);

    World.add(engine.world, [ballA, ballB,ballC,constraintAB]);
    Matter.Bounds.create(ballB.bounds)


    // add mouse control
    const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });
    World.add(engine.world, mouseConstraint);

    Matter.Events.on(mouseConstraint, "mousedown", function(event) {
      //World.add(engine.world, Bodies.circle(150, 50, 30, { restitution: 0.7 }));
    });

    Engine.run(engine);

    Render.run(render);
  // eslint-disable-next-line
  },[restart]);
  return (
    <div ref={sceneEl} />
  )
}
export default MatterDemo
