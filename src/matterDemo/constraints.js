import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';
import MatterWrap from 'matter-wrap'

import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';
import decomp from 'poly-decomp';
window.decomp = decomp;

Matter.Plugin.register(IndexPosition);
Matter.Plugin.register(ConstraintInspector);
//Matter.Plugin.register(decomp);
Matter.use(
  'matter-zIndex-plugin',
  'constraint-inspector',
  MatterWrap
);

let render;

const Constraints = props => {

  const { runInspector } = props;

  const { restart } = useStoreState(
    state => state.general
  );
  const sceneEl = useRef(null);

  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    Constraint = Matter.Constraint,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint;

  useEffect(() => {
    Common._nextId = 0;
    Common._seed = 0;
    const engine = Engine.create();
    const world = engine.world;

    render = Render.create({
      element: sceneEl.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: true,
        showAngleIndicator: true
      }
    });

    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    /******* connect inspector ******/
    let inspector = {
      runner,
      world: engine.world,
      sceneElement: sceneEl.current,
      render: render,
      options: render.options,
      selectStart: null,
      selectBounds: render.bounds,
      selected: [],
    };
    runInspector(inspector);
    /******* connect inspector ******/

    /******* Body ******/
    // add bodies
    let body = Bodies.polygon(150, 200, 5, 30);

    let constraint = Constraint.create({
      pointA: { x: 150, y: 100 },
      bodyB: body,
      pointB: { x: -10, y: -10 }
    });

    World.add(world, [body, constraint]);

    // add soft global constraint
    body = Bodies.polygon(280, 100, 3, 30);

    constraint = Constraint.create({
      pointA: { x: 280, y: 120 },
      bodyB: body,
      pointB: { x: -10, y: -7 },
      stiffness: 0.001
    });

    World.add(world, [body, constraint]);

    // add damped soft global constraint
    body = Bodies.polygon(400, 100, 4, 30);

    constraint = Constraint.create({
      pointA: { x: 400, y: 120 },
      bodyB: body,
      pointB: { x: -10, y: -10 },
      stiffness: 0.001,
      damping: 0.05
    });

    World.add(world, [body, constraint]);

    // add revolute constraint
    body = Bodies.rectangle(600, 200, 200, 20);
    let ball = Bodies.circle(550, 150, 20);

    constraint = Constraint.create({
      pointA: { x: 600, y: 200 },
      bodyB: body,
      length: 0
    });

    World.add(world, [body, ball, constraint]);

    // add revolute multi-body constraint
    body = Bodies.rectangle(500, 400, 100, 20, { collisionFilter: { group: -1 } });
    ball = Bodies.circle(600, 400, 20, { collisionFilter: { group: -1 } });

    constraint = Constraint.create({
      bodyA: body,
      bodyB: ball
    });

    World.add(world, [body, ball, constraint]);

    // add stiff multi-body constraint
    let bodyA = Bodies.polygon(100, 400, 6, 20);
    let bodyB = Bodies.polygon(200, 400, 1, 50);

    constraint = Constraint.create({
      bodyA: bodyA,
      pointA: { x: -10, y: -10 },
      bodyB: bodyB,
      pointB: { x: -10, y: -10 }
    });

    World.add(world, [bodyA, bodyB, constraint]);

    // add soft global constraint
    bodyA = Bodies.polygon(300, 400, 4, 20);
    bodyB = Bodies.polygon(400, 400, 3, 30);

    constraint = Constraint.create({
      bodyA: bodyA,
      pointA: { x: -10, y: -10 },
      bodyB: bodyB,
      pointB: { x: -10, y: -7 },
      stiffness: 0.001
    });

    World.add(world, [bodyA, bodyB, constraint]);

    // add damped soft global constraint
    bodyA = Bodies.polygon(500, 400, 6, 30);
    bodyB = Bodies.polygon(600, 400, 7, 60);

    constraint = Constraint.create({
      bodyA: bodyA,
      pointA: { x: -10, y: -10 },
      bodyB: bodyB,
      pointB: { x: -10, y: -10 },
      stiffness: 0.001,
      damping: 0.1
    });

    World.add(world, [bodyA, bodyB, constraint]);


    const { width, height } = render.options;

    World.add(world, [
      // walls
      Bodies.rectangle(width / 2, 0, width , 50, { isStatic: true, label: 'Top wall' }),
      Bodies.rectangle(width / 2, height, width , 50, { isStatic: true, label: 'Bottom wall'  }),
      Bodies.rectangle(width , height / 2, 50, height, { isStatic: true, label: 'Right wall' }),
      Bodies.rectangle(0, height / 2, 50, height, { isStatic: true, label: 'Left wall' }),
    ]);
    /******* Body ******/

    // eslint-disable-next-line
  },[restart]);
  return (
    <div ref={sceneEl} />
  )
}
export default Constraints
