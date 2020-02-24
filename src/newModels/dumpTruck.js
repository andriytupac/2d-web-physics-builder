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

import tractorJson from './json/dumpTruck.json';

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

function DumpTruck(props) {
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

		const carDumpTruck = (x = 0, y = 0, scaleX = 1, scaleY = 1, staticParam = false) => {
			const group = Body.nextGroup(true);
			// add bodies

			const positionWheelY = 320;

			const frontTrackWheel = Bodies.circle(645, positionWheelY, 45, {
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

			const backTrackWheel = Bodies.circle(930, positionWheelY, 45, {
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
			const backTrackWheelSecond = Bodies.circle(1050, positionWheelY, 45, {
				collisionFilter: { group },
				label: 'backTrackWheelSecond',
				friction: 1,
				render: {
					sprite: {
						// texture: wheel,
						xScale: 1,
						yScale: 1,
					},
				},
			});
			const backDumpBody = Bodies.rectangle(1140, 180, 10, 140, {
				collisionFilter: { group },
				label: 'backTrackWheelSecond',
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
			const dumpBody = Bodies.fromVertices(840, 215, tractorJson.dumpBody, {
				collisionFilter: { group },
				label: 'dumpBody',
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
			dumpBody.render.visible = true;

			const CabWithFrontTrackWheel = Constraint.create({
				bodyA: cab,
				bodyB: frontTrackWheel,
				pointA: {
					x: -125,
					y: 50,
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
					x: 160,
					y: 50,
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
			const CabWithBackTrackWheelSec = Constraint.create({
				bodyA: cab,
				bodyB: backTrackWheelSecond,
				pointA: {
					x: 280,
					y: 50,
				},
				length: 0,
				label: 'CabWithBackTrackWheelSec',
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
			const fixCabWithDumpBody = Constraint.create({
				bodyA: cab,
				bodyB: dumpBody,
				pointA: {
					x: 345,
					y: -14,
				},
				pointB: {
					x: 275,
					y: 42,
				},
				length: 0,
				label: 'fixCabWithDumpBody',
				stiffness: 0.2,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					strokeStyle: '#ffffff',
					type: 'line',
					anchors: true,
				},
			});
			const mobileCabWithDumpBody = Constraint.create({
				bodyA: cab,
				bodyB: dumpBody,
				pointA: {
					x: 80,
					y: -5,
				},
				pointB: {
					x: 10,
					y: 42,
				},
				length: 10,
				label: 'mobileCabWithDumpBody',
				stiffness: 0.2,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					strokeStyle: '#ffffff',
					type: 'line',
					anchors: true,
				},
			});
			const fixDumpBodyWithBack = Constraint.create({
				bodyA: dumpBody,
				bodyB: backDumpBody,
				pointA: {
					x: 300,
					y: -95,
				},
				pointB: {
					x: 0,
					y: -60,
				},
				length: 0,
				label: 'fixDumpBodyWithBack',
				stiffness: 0.2,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					strokeStyle: '#ffffff',
					type: 'line',
					anchors: true,
				},
			});
			const mobileDumpBodyWithBack = Constraint.create({
				bodyA: dumpBody,
				bodyB: backDumpBody,
				pointA: {
					x: 290,
					y: 42,
				},
				pointB: {
					x: 0,
					y: 65,
				},
				length: 20,
				label: 'mobileDumpBodyWithBack',
				stiffness: 0.2,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					strokeStyle: '#ffffff',
					type: 'line',
					anchors: true,
				},
			});


			const DumpTruckComposite = Composite.create({ label: 'DumpTruckComposite' });

			Composite.add(DumpTruckComposite, [
				cab,
				frontTrackWheel,
				backTrackWheel,
				backTrackWheelSecond,
				dumpBody,
				backDumpBody,
			]);

			Body.setStatic(cab, staticParam);
			Body.setStatic(dumpBody, staticParam);
			Body.setStatic(frontTrackWheel, staticParam);
			Body.setStatic(backTrackWheel, staticParam);
			Body.setStatic(backTrackWheelSecond, staticParam);
			Body.setStatic(backDumpBody, staticParam);

			Composite.add(DumpTruckComposite, [
				CabWithFrontTrackWheel,
				CabWithBackTrackWheel,
				CabWithBackTrackWheelSec,
				fixCabWithDumpBody,
				mobileCabWithDumpBody,
				fixDumpBodyWithBack,
				mobileDumpBodyWithBack,
			]);

			const position = Composite.bounds(DumpTruckComposite);
			const positionX = (position.max.x + position.min.x) / 2;
			const positionY = (position.max.y + position.min.y) / 2;

			Composite.scale(DumpTruckComposite, scaleX, scaleY, { x: positionX + x, y: positionY + y });
			// Composite.scale(DumpTruckComposite, -1, 1, { x: positionX + x, y: positionY + y },true);

			Events.on(engine, 'beforeUpdate', function() {
				if (keys.ArrowRight) {
					Body.setAngularVelocity(frontTrackWheel, 0.1);
					Body.setAngularVelocity(backTrackWheel, 0.1);
					Body.setAngularVelocity(backTrackWheelSecond, 0.1);
				} else if (keys.ArrowLeft) {
					Body.setAngularVelocity(frontTrackWheel, -0.1);
					Body.setAngularVelocity(backTrackWheel, -0.1);
					Body.setAngularVelocity(backTrackWheelSecond, -0.1);
				}
				if (keys.ArrowUp) {
					mobileCabWithDumpBody.length += mobileCabWithDumpBody.length < 220 * scaleX ? 0.4 : 0;
				} else if (keys.ArrowDown) {
					mobileCabWithDumpBody.length -= mobileCabWithDumpBody.length > 10 * scaleX ? 0.4 : 0;
				}

				if (keys.KeyW) {
					mobileDumpBodyWithBack.length += mobileDumpBodyWithBack.length < 150 * scaleX ? 0.4 : 0;
				} else if (keys.KeyS) {
					mobileDumpBodyWithBack.length -= mobileDumpBodyWithBack.length > 20 * scaleX ? 0.4 : 0;
				}

			});

			return DumpTruckComposite;
		};
		World.add(world, carDumpTruck(100, 200, 1, 1, false));

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
export default DumpTruck;
