import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';

import decomp from 'poly-decomp';
import wheel from './images/excavator/wheel.png';
import imgTrackFrame from './images/excavator/trackFrame.png';
import imgCab from './images/excavator/cab.png';
import imgBoom from './images/excavator/boom.png';
import imgArm from './images/excavator/arm.png';
import imgBucket from './images/excavator/bucket.png';
import imgArmConnector from './images/excavator/armConnector.png';
import imgBucketConnector from './images/excavator/bucketConnector.png';

import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';
import ConstraintScale from '../mattetPlugins/ConstraintScale';
import RenderBodies from '../mattetPlugins/RenderBodies';

import tractorJson from './json/tractor.json';

window.decomp = decomp;

// import Ball from "../img/ball.png";

Matter.Plugin.register(IndexPosition);
Matter.Plugin.register(ConstraintInspector);
Matter.Plugin.register(ConstraintScale);
Matter.Plugin.register(RenderBodies);
Matter.use('matter-zIndex-plugin', 'constraint-inspector', 'matter-scale-plugin', 'matter-texture-from-vertices');

let render;

const keyboard = [
	{ name: 'Right', description: 'Wheels move right' },
	{ name: 'Left', description: 'Wheels move Left' },
	{ name: 'Up', description: 'Boom move up' },
	{ name: 'Down', description: 'Boom move down' },
	{ name: 'D', description: 'Arm move up' },
	{ name: 'A', description: 'Arm move down' },
	{ name: 'W', description: 'Bucket move up' },
	{ name: 'S', description: 'Bucket move Down' },
];

function Tractor(props) {
	const { runInspector } = props;

	const { restart } = useStoreState(state => state.general);
	const sceneEl = useRef(null);

	const { Engine, Render, Runner, World, Bodies, Constraint, Composite, Common, Body, Events } = Matter;

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
				width: 1400,
				height: 630,
				wireframes: true,
				showBounds: false,
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
			keyboard,
		};
		runInspector(inspector);
		/** ***** connect inspector ***** */

		/** ******** key events ********* */
		const keys = [];
		document.body.addEventListener('keydown', function(e) {
			keys[e.code] = true;
			const drivingMode = localStorage.getItem('drivingMode') === 'true';
			if (drivingMode) {
				e.preventDefault();
			}
			// e.preventDefault();
			// console.log(e)
		});
		document.body.addEventListener('keyup', function(e) {
			keys[e.code] = false;
			const drivingMode = localStorage.getItem('drivingMode') === 'true';
			if (drivingMode) {
				e.preventDefault();
			}
		});
		/** ******** key events ********* */

		/** ***** Body ***** */

		const carTractor = (x = 0, y = 0, scaleX = 1, scaleY = 1, staticParam = false) => {
			const group = Body.nextGroup(true);
			// add bodies

			const frontTrackWheel = Bodies.circle(600, 375, 60, {
				collisionFilter: { group },
				label: 'frontTrackWheel',
				friction: 1,
				render: {
					sprite: {
						// texture: wheel,
						xScale: 1,
						yScale: 1,
					},
				},
			});

			const backTrackWheel = Bodies.circle(850, 345, 90, {
				collisionFilter: { group },
				label: 'backTrackWheel',
				friction: 1,
				render: {
					sprite: {
						// texture: wheel,
						xScale: 1,
						yScale: 1,
					},
				},
			});

			const cab = Bodies.fromVertices(770, 270, tractorJson.cab, {
				collisionFilter: { group },
				label: 'cab',
				render: {
					zIndex: 1,
					visible: false,
					sprite: {
						/* texture: imgBoom,
						xScale: 1,
						yScale: 1,
						xOffset: 0,
						yOffset: -0.1, */
					},
				},
			});
			cab.render.visible = true;

			const CabWithFrontTrackWheel = Constraint.create({
				bodyA: cab,
				bodyB: frontTrackWheel,
				pointA: {
					x: -170,
					y: 105,
				},
				length: 0,
				label: 'cabWithFrontTrackWheel',
				stiffness: 0.06,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					strokeStyle: '#ffffff',
					type: 'spring',
					anchors: true,
				},
			});
			const CabWithBackTrackWheel = Constraint.create({
				bodyA: cab,
				bodyB: backTrackWheel,
				pointA: {
					x: 80,
					y: 75,
				},
				length: 0,
				label: 'cabWithBackTrackWheel',
				stiffness: 0.06,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					strokeStyle: '#ffffff',
					type: 'spring',
					anchors: true,
				},
			});

			const TractorComposite = Composite.create({ label: 'TractorComposite' });

			Composite.add(TractorComposite, [
				cab,
				frontTrackWheel,
				backTrackWheel
			]);

			Body.setStatic(cab, staticParam);
			Body.setStatic(frontTrackWheel, staticParam);
			Body.setStatic(backTrackWheel, staticParam);

			Composite.add(TractorComposite, [
				CabWithFrontTrackWheel,
				CabWithBackTrackWheel,
			]);

			const position = Composite.bounds(TractorComposite);
			const positionX = (position.max.x + position.min.x) / 2;
			const positionY = (position.max.y + position.min.y) / 2;

			Composite.scale(TractorComposite, scaleX, scaleY, { x: positionX + x, y: positionY + y });

			Events.on(engine, 'beforeUpdate', function() {
				if (keys.ArrowRight) {
					Body.setAngularVelocity(frontTrackWheel, 0.1);
					Body.setAngularVelocity(backTrackWheel, 0.1);
				} else if (keys.ArrowLeft) {
					Body.setAngularVelocity(frontTrackWheel, -0.1);
					Body.setAngularVelocity(backTrackWheel, -0.1);
				}
			});

			return TractorComposite;
		};
		World.add(world, carTractor(400, 200, 1, 1, false));

		const { width, height } = render.options;

		World.add(world, [
			// walls
			Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true, label: 'Top wall' }),
			Bodies.rectangle(width / 2, height, width, 50, { isStatic: true, label: 'Bottom wall' }),
			Bodies.rectangle(width, height / 2, 50, height, { isStatic: true, label: 'Right wall' }),
			Bodies.rectangle(0, height / 2, 50, height, { isStatic: true, label: 'Left wall' }),
		]);
		/** ***** Body ***** */
		// eslint-disable-next-line
	},[restart]);
	return <div ref={sceneEl} />;
}
export default Tractor;
