import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';
import MatterWrap from 'matter-wrap'
import decomp from 'poly-decomp';

import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';
import Ball from '../img/ball.png';
import Box from '../img/box.png';
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

const Sprites = props => {

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
    Composites = Matter.Composites,
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
        wireframes: false,
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

    world.bodies = [];

    const stack = Composites.stack(20, 20, 10, 4, 0, 0, function(x, y) {
      if (Common.random() > 0.35) {
        return Bodies.rectangle(x, y, 64, 64, {
          render: {
            strokeStyle: '#ffffff',
            sprite: {
              texture: Box
            }
          }
        });
      } else {
        return Bodies.circle(x, y, 46, {
          density: 0.0005,
          frictionAir: 0.06,
          restitution: 0.3,
          friction: 0.01,
          render: {
            sprite: {
              texture: Ball
            }
          }
        });
      }
    });

    World.add(world, stack);

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
export default Sprites
