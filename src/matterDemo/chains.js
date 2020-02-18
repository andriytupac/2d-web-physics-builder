import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';
import MatterWrap from 'matter-wrap';

import decomp from 'poly-decomp';
import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';

window.decomp = decomp;

Matter.Plugin.register(IndexPosition);
Matter.Plugin.register(ConstraintInspector);
Matter.use('matter-zIndex-plugin', 'constraint-inspector', MatterWrap);

let render;

const Chains = props => {
	const { runInspector } = props;

	const { restart } = useStoreState(state => state.general);
	const sceneEl = useRef(null);

	const { Engine, Render, Runner, World, Bodies, Composites, Body, Common, Constraint, Composite } = Matter;

	useEffect(() => {
		// eslint-disable-next-line no-underscore-dangle
		Common._nextId = 0;
		// eslint-disable-next-line no-underscore-dangle
		Common._seed = 0;
		const engine = Engine.create();
		const { world } = engine;

		render = Render.create({
			element: sceneEl.current,
			engine,
			options: {
				width: 800,
				height: 600,
				wireframes: true,
				showAngleIndicator: true,
			},
		});

		Render.run(render);

		// create runner
		const runner = Runner.create();
		Runner.run(runner, engine);

		/** ***** connect inspector ***** */
		const inspector = {
			runner,
			world: engine.world,
			sceneElement: sceneEl.current,
			render,
			options: render.options,
			selectStart: null,
			selectBounds: render.bounds,
			selected: [],
		};
		runInspector(inspector);
		/** ***** connect inspector ***** */

		/** ***** Body ***** */
		// add bodies
		let group = Body.nextGroup(true);

		const ropeA = Composites.stack(100, 50, 8, 1, 10, 10, function(x, y) {
			return Bodies.rectangle(x, y, 50, 20, { collisionFilter: { group } });
		});

		Composites.chain(ropeA, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
		Composite.add(
			ropeA,
			Constraint.create({
				bodyB: ropeA.bodies[0],
				pointB: { x: -25, y: 0 },
				pointA: { x: ropeA.bodies[0].position.x, y: ropeA.bodies[0].position.y },
				stiffness: 0.5,
			}),
		);

		group = Body.nextGroup(true);

		const ropeB = Composites.stack(350, 50, 10, 1, 10, 10, function(x, y) {
			return Bodies.circle(x, y, 20, { collisionFilter: { group } });
		});

		Composites.chain(ropeB, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
		Composite.add(
			ropeB,
			Constraint.create({
				bodyB: ropeB.bodies[0],
				pointB: { x: -20, y: 0 },
				pointA: { x: ropeB.bodies[0].position.x, y: ropeB.bodies[0].position.y },
				stiffness: 0.5,
			}),
		);

		group = Body.nextGroup(true);

		const ropeC = Composites.stack(600, 50, 13, 1, 10, 10, function(x, y) {
			return Bodies.rectangle(x - 20, y, 50, 20, { collisionFilter: { group }, chamfer: 5 });
		});

		Composites.chain(ropeC, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 });
		Composite.add(
			ropeC,
			Constraint.create({
				bodyB: ropeC.bodies[0],
				pointB: { x: -20, y: 0 },
				pointA: { x: ropeC.bodies[0].position.x, y: ropeC.bodies[0].position.y },
				stiffness: 0.5,
			}),
		);

		World.add(world, [ropeA, ropeB, ropeC, Bodies.rectangle(400, 600, 1200, 50.5, { isStatic: true })]);

		const { width, height } = render.options;

		World.add(world, [
			// walls
			Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true, label: 'Top wall' }),
			Bodies.rectangle(width / 2, height, width, 50, { isStatic: true, label: 'Bottom wall' }),
			// Bodies.rectangle(width , height / 2, 50, height, { isStatic: true, label: 'Right wall' }),
			// Bodies.rectangle(0, height / 2, 50, height, { isStatic: true, label: 'Left wall' }),
		]);
		/** ***** Body ***** */

		// eslint-disable-next-line
  },[restart]);
	return <div ref={sceneEl} />;
};
export default Chains;
