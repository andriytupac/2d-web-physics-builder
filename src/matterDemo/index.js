import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';

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
        Common = Matter.Common,
        Runner = Matter.Runner,
      Body = Matter.Body,
      Composites = Matter.Composites,
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
        showBounds: false
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
    const Car = Composites.car(400, 300, 200, 30, 30);
    Body.setStatic(Car.bodies[0],true)
    Body.setStatic(Car.bodies[1],true)
    Body.setStatic(Car.bodies[2],true)
    Car.constraints[0].pointA.y = 50
    console.log(Car)
    const car1 = Composites.car(400, 300, 200, 30, 30);

    const { width, height } = render.options;

    World.add(world, [
      Car,
      car1,
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
export default MatterDemo
