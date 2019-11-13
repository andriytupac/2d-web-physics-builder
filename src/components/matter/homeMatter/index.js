import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreActions, useStoreState } from 'easy-peasy';

import IndexPosition from '../../../mattetPlugins/IndexPosition';

Matter.Plugin.register(IndexPosition);
Matter.use(
  'matter-zIndex-plugin',
);


function HomeMatter(props){

  const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint;

  const engine = Engine.create({
    // positionIterations: 20
  });
  Events.on(engine.world, "afterAdd", () => {
    addRender({...engine.world})
  });
  Events.on(engine.world, "afterRemove", () => {
    addRender({...engine.world})
  });

  const addRender = useStoreActions(
    actions => actions.general.addRender
  );
  const addGlobalRender = useStoreActions(
    actions => actions.general.addGlobalRender
  );

  const sceneEl = useRef(null);

  useEffect(() => {

    const render = Render.create({
      element: sceneEl.current,
      engine: engine,
      options: {
        width: 600,
        height: 600,
        wireframes: true,
        showBounds: false
      }
    });
    let inspector = {
      engine: engine,
      render: render,
      options: render.options,
      selectStart: null,
      selectBounds: render.bounds,
      selected: []

    };
    props.runInspector(inspector)

    const ballA = Bodies.circle(210, 100, 30, { restitution: 0.5 , render:{ zIndex: -1 }});
    const ballB = Bodies.circle(110, 50, 30, { restitution: 0.5, render:{ zIndex: -1} });

    World.add(engine.world, [
      // walls
      Bodies.rectangle(200, 0, 600, 50, { isStatic: true }),
      Bodies.rectangle(200, 600, 600, 50, { isStatic: true }),
      Bodies.rectangle(260, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

    World.add(engine.world, [ballA, ballB]);
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
      World.add(engine.world, Bodies.circle(150, 50, 30, { restitution: 0.7 }));
    });

    Engine.run(engine);

    Render.run(render);
  },[]);
  return (
    <div ref={sceneEl} />
  )
}
export default HomeMatter
