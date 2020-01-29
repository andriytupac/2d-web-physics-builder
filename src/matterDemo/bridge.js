import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';

import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';
import decomp from 'poly-decomp';
window.decomp = decomp;

Matter.Plugin.register(IndexPosition);
Matter.Plugin.register(ConstraintInspector);
Matter.use(
  'matter-zIndex-plugin',
  'constraint-inspector',
);

let render;

const Bridge = props => {

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
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint;

  useEffect(() => {
    /******* General connection ******/
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
    /******* General connection ******/

    /******* Connect inspector ******/
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
    /******* Connect inspector ******/

    /******* Body ******/

    // add bodies
    const group = Body.nextGroup(true);

    const bridge = Composites.stack(160, 290, 15, 1, 0, 0, function(x, y) {
      return Bodies.rectangle(x - 20, y, 53, 20, {
        collisionFilter: { group: group },
        chamfer: 5,
        density: 0.005,
        frictionAir: 0.05,
        render: {
          fillStyle: '#575375'
        }
      });
    });

    Composites.chain(bridge, 0.3, 0, -0.3, 0, {
      stiffness: 1,
      length: 0,
      render: {
        visible: false
      }
    });

    const stack = Composites.stack(250, 50, 6, 3, 0, 0, function(x, y) {
      return Bodies.rectangle(x, y, 50, 50, Common.random(20, 40));
    });

    World.add(world, [
      bridge,
      stack,
      Bodies.rectangle(30, 490, 220, 380, {
        isStatic: true,
        chamfer: { radius: 20 }
      }),
      Bodies.rectangle(770, 490, 220, 380, {
        isStatic: true,
        chamfer: { radius: 20 }
      }),
      Constraint.create({
        pointA: { x: 140, y: 300 },
        bodyB: bridge.bodies[0],
        pointB: { x: -25, y: 0 },
        length: 2,
        stiffness: 0.9
      }),
      Constraint.create({
        pointA: { x: 660, y: 300 },
        bodyB: bridge.bodies[bridge.bodies.length - 1],
        pointB: { x: 25, y: 0 },
        length: 2,
        stiffness: 0.9
      })
    ]);

    // add mouse control
    const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.1,
          render: {
            visible: false
          }
        }
      });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    /******* Body ******/

    // eslint-disable-next-line
  },[restart]);
  return (
    <div ref={sceneEl} />
  )
}
export default Bridge
