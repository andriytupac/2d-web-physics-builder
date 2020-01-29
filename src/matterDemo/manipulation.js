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

const Manipulation = props => {

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
    Body = Matter.Body,
    Events = Matter.Events,
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
    const bodyA = Bodies.rectangle(100, 200, 50, 50, { isStatic: true }),
      bodyB = Bodies.rectangle(200, 200, 50, 50),
      bodyC = Bodies.rectangle(300, 200, 50, 50),
      bodyD = Bodies.rectangle(400, 200, 50, 50),
      bodyE = Bodies.rectangle(550, 200, 50, 50),
      bodyF = Bodies.rectangle(700, 200, 50, 50),
      bodyG = Bodies.circle(400, 100, 25),
      partA = Bodies.rectangle(600, 200, 120, 50),
      partB = Bodies.rectangle(660, 200, 50, 190),
      compound = Body.create({
        parts: [partA, partB],
        isStatic: true
      });

    World.add(world, [bodyA, bodyB, bodyC, bodyD, bodyE, bodyF, bodyG, compound]);

    let counter = 0,
      scaleFactor = 1.01;

    Events.on(engine, 'beforeUpdate', function(event) {
      counter += 1;

      if (counter === 40)
        Body.setStatic(bodyG, true);

      if (scaleFactor > 1) {
        Body.scale(bodyF, scaleFactor, scaleFactor);
        Body.scale(compound, 0.995, 0.995);

        // modify bodyE vertices
        bodyE.vertices[0].x -= 0.2;
        bodyE.vertices[0].y -= 0.2;
        bodyE.vertices[1].x += 0.2;
        bodyE.vertices[1].y -= 0.2;
        Body.setVertices(bodyE, bodyE.vertices);
      }

      // make bodyA move up and down
      // body is static so must manually update velocity for friction to work
      const py = 300 + 100 * Math.sin(engine.timing.timestamp * 0.002);
      Body.setVelocity(bodyA, { x: 0, y: py - bodyA.position.y });
      Body.setPosition(bodyA, { x: 100, y: py });

      // make compound body move up and down and rotate constantly
      Body.setVelocity(compound, { x: 0, y: py - compound.position.y });
      Body.setAngularVelocity(compound, 0.02);
      Body.setPosition(compound, { x: 600, y: py });
      Body.rotate(compound, 0.02);

      // every 1.5 sec
      if (counter >= 60 * 1.5) {
        Body.setVelocity(bodyB, { x: 0, y: -10 });
        Body.setAngle(bodyC, -Math.PI * 0.26);
        Body.setAngularVelocity(bodyD, 0.2);

        // reset counter
        counter = 0;
        scaleFactor = 1;
      }
    });

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

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // keep the mouse in sync with rendering
    render.mouse = mouse;


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
export default Manipulation
