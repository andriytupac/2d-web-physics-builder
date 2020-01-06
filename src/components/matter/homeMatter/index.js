import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreActions, useStoreState } from 'easy-peasy';

import IndexPosition from '../../../mattetPlugins/IndexPosition';
import ConstraintInspector from '../../../mattetPlugins/ConstraintInspector';
import decomp from 'poly-decomp';
window.decomp = decomp;

Matter.Plugin.register(IndexPosition);
Matter.Plugin.register(ConstraintInspector);
Matter.Plugin.register(decomp);
Matter.use(
  'matter-zIndex-plugin',
  'constraint-inspector',
);


function HomeMatter(props){

  const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    Composites = Matter.Composites,
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
        width: 800,
        height: 600,
        wireframes: true,
        showBounds: false
      }
    });
    //render.options.showBounds = true;
    //console.log('render',render);
    let inspector = {
      engine: engine,
      render: render,
      options: render.options,
      selectStart: null,
      selectBounds: render.bounds,
      selected: []

    };
    props.runInspector(inspector)

    const ballA = Bodies.rectangle(310, 100, 30,30, { restitution: 0.5 , isStatic: true, render:{ zIndex: -1 }});
    const ballB = Bodies.circle(110, 50, 30, { restitution: 0.5, render:{ zIndex: -1} });

    const constraintAB = Matter.Constraint.create({
      pointA: {x:400,y:100},
      //pointB: {x:15,y:15},
      //bodyA: ballA,
      bodyB: ballB
    });

    const scale = 1;
    World.add(engine.world, [
      // walls
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
      Composites.car(150, 300, 150 * scale, 30 * scale, 30 * scale),
      //Composites.car(200, 200, 200, 30, {xx:50,yy: 100, width: 100,height: 100,wheelSize: 30 }),
      //constraintAB
    ]);

    World.add(engine.world, [ballA, ballB,constraintAB]);
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
  },[]);
  return (
    <div ref={sceneEl} />
  )
}
export default HomeMatter
