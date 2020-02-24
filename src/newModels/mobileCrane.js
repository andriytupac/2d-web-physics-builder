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

import mobileСrane from './json/mobileСrane.json';

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

function MobileCrane(props) {
	const { runInspector } = props;

	const { restart } = useStoreState(state => state.general);
	const sceneEl = useRef(null);

	const { Engine, Render, Runner, World, Bodies, Constraint, Composite, Common, Body, Events, Bounds, Vertices } = Matter;

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

		const carMobileCrane = (x = 0, y = 0, scaleX = 1, scaleY = 1, staticParam = false) => {
			const group = Body.nextGroup(true);
			const globalPos = { x: 750 + x, y: 400 + y };
			// add bodies

			const positionWheelY = globalPos.y - 65;

			const frontTrackWheel = Bodies.circle(globalPos.x - 190 - 35, positionWheelY, 51, {
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
			const middleTrackWheel = Bodies.circle(globalPos.x - 18 - 35, positionWheelY, 51, {
				collisionFilter: { group },
				label: 'middleTrackWheel',
				friction: 1,
				render: {
					sprite: {
						// texture: wheel,
						xScale: 1,
						yScale: 1,
					},
				},
			});
			const middleTrackWheelSecond = Bodies.circle(globalPos.x + 92 - 35, positionWheelY, 51, {
				collisionFilter: { group },
				label: 'middleTrackWheel',
				friction: 1,
				render: {
					sprite: {
						// texture: wheel,
						xScale: 1,
						yScale: 1,
					},
				},
			});
			const backTrackWheel = Bodies.circle(globalPos.x + 230 - 35, positionWheelY, 51, {
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
			const backTrackWheelSecond = Bodies.circle(globalPos.x + 340 - 35, positionWheelY, 51, {
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
			const boomP1 = Bodies.rectangle(0, 0, 760, 45, {
				collisionFilter: { group },
				label: 'boom',
				friction: 1,
				render: {
					sprite: {
						// texture: wheel,
						xScale: 1,
						yScale: 1,
					},
				},
			});
			const boomP2 = Bodies.rectangle(-50, 0, 760, 35, {
				collisionFilter: { group },
				label: 'boom',
				friction: 1,
				render: {
					sprite: {
						// texture: wheel,
						xScale: 1,
						yScale: 1,
					},
				},
			});

			const boom = Body.create({
				label: 'boomMain',
				mass: 40,
				parts: [...boomP1.parts, ...boomP2.parts],
				collisionFilter: { group, mask: 0x0001 },
				render: {
					sprite: {
						xScale: 1,
						yScale: 1,
						/* texture: imgCab,
						xOffset: 0.005,
						yOffset: 0.023, */
					},
				},
			});
			Body.setPosition(boom, { x: globalPos.x - 70, y: globalPos.y - 250 });
			// Body.setPosition(boomP2, { x: boomP2.position.x + 550, y: boomP2.position.y });

			const cabP1 = Bodies.fromVertices(0, 0, mobileСrane.cab, { render: { visible: false } });
			const cabP2 = Bodies.fromVertices(264, -82, mobileСrane.operatorCab, { render: { visible: false } });
			const cabP3 = Bodies.rectangle(-126, 70-50, 25, 80, { render: { visible: false } });
			const cabP4 = Bodies.rectangle(400, 70-50, 25, 80, { render: { visible: false } });
			cabP1.parts.shift();
			cabP2.parts.shift();
			const cab = Body.create({
				label: 'cab',
				mass: 40,
				parts: [...cabP1.parts, ...cabP2.parts, ...cabP3.parts, ...cabP4.parts],
				collisionFilter: { group, mask: 0x0001 },
				render: {
					sprite: {
						xScale: 1,
						yScale: 1,
						/* texture: imgCab,
						xOffset: 0.005,
						yOffset: 0.023, */
					},
				},
			});

			Body.setPosition(cab, { x: globalPos.x + 30, y: globalPos.y - 130 });
			//Body.setPosition(cabP3, { x: cabP3.position.x, y: cabP3.position.y - 50 });
			//Body.setPosition(cabP4, { x: cabP4.position.x, y: cabP4.position.y - 50 });

			/* const cab = Bodies.fromVertices(770, 270, mobileСrane.cab, {
				collisionFilter: { group },
				label: 'cab',
				render: {
					zIndex: 1,
					visible: false,
					sprite: {
						/!* texture: imgBoom,
						xScale: 1,
						yScale: 1,
						xOffset: 0,
						yOffset: -0.1, *!/
					},
				},
			}); */
			cab.render.visible = true;
			/* const dumpBody = Bodies.fromVertices(840, 215, mobileСrane.operatorCab, {
				collisionFilter: { group },
				label: 'dumpBody',
				render: {
					zIndex: 1,
					visible: false,
					sprite: {
						/!* texture: imgBoom,
						xScale: 1,
						yScale: 1,
						xOffset: 0,
						yOffset: -0.1, *!/
					},
				},
			});
			dumpBody.render.visible = true;
			*/
			// constraints

			const CabWithFrontTrackWheel = Constraint.create({
				bodyA: cab,
				bodyB: frontTrackWheel,
				pointA: {
					x: -255,
					y: 65,
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
			const CabWithMiddleTrackWheel = Constraint.create({
				bodyA: cab,
				bodyB: middleTrackWheel,
				pointA: {
					x: -83,
					y: 65,
				},
				length: 0,
				label: 'CabWithMiddleTrackWheel',
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
			const CabWithMiddleTrackWheelSecond = Constraint.create({
				bodyA: cab,
				bodyB: middleTrackWheelSecond,
				pointA: {
					x: 27,
					y: 65,
				},
				length: 0,
				label: 'CabWithMiddleTrackWheelSecond',
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
					x: 165,
					y: 65,
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
					x: 275,
					y: 65,
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
			const fixCabWithBoom = Constraint.create({
				bodyA: cab,
				bodyB: boom,
				pointA: {
					x: 260,
					y: -120,
				},
				pointB: {
					x: 360,
					y: 0,
				},
				length: 0,
				label: 'fixCabWithDumpBody',
				stiffness: 0.6,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					strokeStyle: '#ffffff',
					type: 'line',
					anchors: true,
				},
			});
			const mobileCabWithBoom = Constraint.create({
				bodyA: cab,
				bodyB: boom,
				pointA: {
					x: 110,
					y: -50,
				},
				pointB: {
					x: -100,
					y: 30,
				},
				// length: 10,
				label: 'mobileCabWithDumpBody',
				stiffness: 0.6,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					strokeStyle: '#ffffff',
					type: 'line',
					anchors: true,
				},
			});
			/*
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
			}); */

			const MobileCraneComposite = Composite.create({ label: 'MobileCraneComposite' });

			Composite.add(MobileCraneComposite, [
				cab,
				frontTrackWheel,
				backTrackWheel,
				backTrackWheelSecond,
				// dumpBody,
				boom,
				middleTrackWheel,
				middleTrackWheelSecond,
			]);

			Body.setStatic(cab, staticParam);
			// Body.setStatic(dumpBody, staticParam);
			Body.setStatic(frontTrackWheel, staticParam);
			Body.setStatic(backTrackWheel, staticParam);
			Body.setStatic(backTrackWheelSecond, staticParam);
			Body.setStatic(boom, staticParam);
			Body.setStatic(middleTrackWheel, staticParam);
			Body.setStatic(middleTrackWheelSecond, staticParam);

			Composite.add(MobileCraneComposite, [
				CabWithFrontTrackWheel,
				CabWithBackTrackWheel,
				CabWithBackTrackWheelSec,
				fixCabWithBoom,
				mobileCabWithBoom,
				// fixDumpBodyWithBack,
				// mobileDumpBodyWithBack,
				CabWithMiddleTrackWheel,
				CabWithMiddleTrackWheelSecond,
			]);

			const position = Composite.bounds(MobileCraneComposite);
			const positionX = (position.max.x + position.min.x) / 2;
			const positionY = (position.max.y + position.min.y) / 2;

			Composite.scale(MobileCraneComposite, scaleX, scaleY, { x: positionX + x, y: positionY + y });
			// Composite.scale(MobileCraneComposite, -1, 1, { x: positionX + x, y: positionY + y },true);

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
					// mobileCabWithDumpBody.length += mobileCabWithDumpBody.length < 220 * scaleX ? 0.4 : 0;
					Body.setPosition(cabP3, { x: cabP3.position.x, y: cabP3.position.y - 0.5 });
					Body.setPosition(cabP4, { x: cabP4.position.x, y: cabP4.position.y - 0.5 });
					Object.assign(cab.vertices, Vertices.create([cabP4.bounds.max], cab));
				} else if (keys.ArrowDown) {
					Body.setPosition(cabP3, { x: cabP3.position.x, y: cabP3.position.y + 0.5 });
					Body.setPosition(cabP4, { x: cabP4.position.x, y: cabP4.position.y + 0.5 });
					Object.assign(cab.vertices, Vertices.create([cabP4.bounds.max], cab));

				}

				if (keys.KeyW) {
					mobileCabWithBoom.length += mobileCabWithBoom.length < 800 * scaleX ? 0.4 : 0;
				} else if (keys.KeyS) {
					mobileCabWithBoom.length -= mobileCabWithBoom.length > 20 * scaleX ? 0.4 : 0;
				}

				if (keys.KeyA) {
					Body.setPosition(boomP2, {
						x: boomP2.position.x - Math.cos(boom.angle),
						y: boomP2.position.y - Math.sin(boom.angle),
					});
					Object.assign(boom.vertices, Vertices.create([boomP2.bounds.min,boomP2.bounds.max], boom));
				} else if (keys.KeyD) {
					Body.setPosition(boomP2, {
						x: boomP2.position.x + Math.cos(boom.angle),
						y: boomP2.position.y + Math.sin(boom.angle),
					});
					Object.assign(boom.vertices, Vertices.create([boomP2.bounds.min,boomP2.bounds.max], boom));
				}
			});

			return MobileCraneComposite;
		};
		World.add(world, carMobileCrane(0, 200, 1, 1, false));

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
export default MobileCrane;
