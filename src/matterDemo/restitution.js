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

const Restitution = props => {

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
    const rest = 0.9,
      space = 600 / 5;

    World.add(world, [
      Bodies.rectangle(100 + space * 0, 150, 50, 50, { restitution: rest }),
      Bodies.rectangle(100 + space * 1, 150, 50, 50, { restitution: rest, angle: -Math.PI * 0.15 }),
      Bodies.rectangle(100 + space * 2, 150, 50, 50, { restitution: rest, angle: -Math.PI * 0.25 }),
      Bodies.circle(100 + space * 3, 150, 25, { restitution: rest }),
      Bodies.rectangle(100 + space * 5, 150, 180, 20, { restitution: rest, angle: -Math.PI * 0.5 }),
    ]);

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
export default Restitution