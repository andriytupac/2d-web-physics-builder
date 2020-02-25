import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';
import decomp from 'poly-decomp';

import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';
import ConstraintScale from '../mattetPlugins/ConstraintScale';
import RenderBodies from '../mattetPlugins/RenderBodies';

import tractorJson from './json/tractor.json';

window.decomp = decomp;

Matter.Plugin.register(IndexPosition);
Matter.Plugin.register(ConstraintInspector);
Matter.Plugin.register(ConstraintScale);
Matter.Plugin.register(RenderBodies);
Matter.use('matter-zIndex-plugin', 'constraint-inspector', 'matter-scale-plugin', 'matter-texture-from-vertices');

let render;

const keyboard = [
	{ name: 'Right', description: 'Wheels move right' },
	{ name: 'Left', description: 'Wheels move Left' },
	{ name: 'Up', description: 'Push frame move up' },
	{ name: 'Down', description: 'Push frame  move down' },
	{ name: 'D', description: 'Bucket move down' },
	{ name: 'A', description: 'Bucket move up' },
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

		const carTractor = (x = 0, y = 0, scale = 1, staticParam = false, speed = 1, side = 'left') => {
			const group = Body.nextGroup(true);
			const globalPos = { x, y };
			// add bodies

			const frontTrackWheel = Bodies.circle(globalPos.x - 150, globalPos.y + 125, 60, {
				collisionFilter: { group },
				label: 'frontTrackWheel',
				friction: 1,
				render: {
					sprite: {
						xScale: 1,
						yScale: 1,
					},
				},
			});

			const backTrackWheel = Bodies.circle(globalPos.x + 100, globalPos.y + 95, 90, {
				collisionFilter: { group },
				label: 'backTrackWheel',
				friction: 1,
				render: {
					sprite: {
						xScale: 1,
						yScale: 1,
					},
				},
			});

			const cab = Bodies.fromVertices(
				globalPos.x + 20,
				globalPos.y + 20,
				tractorJson.cab,
				{
					collisionFilter: { group },
					label: 'cab',
					render: {
						visible: true,
						sprite: {
							xScale: 1,
							yScale: 1,
						},
					},
				},
				true,
			);
			cab.render.visible = true;

			const pushFrame = Bodies.fromVertices(globalPos.x - 160, globalPos.y + 40, tractorJson.pushFrame, {
				collisionFilter: { group },
				label: 'pushFrame',
				render: {
					visible: true,
					sprite: {
						xScale: 1,
						yScale: 1,
					},
				},
			});
			const bucket = Bodies.fromVertices(
				globalPos.x - 250,
				globalPos.y + 150,
				tractorJson.bucket,
				{
					collisionFilter: { group },
					label: 'bucket',
					render: {
						visible: true,
						sprite: {
							xScale: 1,
							yScale: 1,
						},
					},
				},
				true,
			);
			// add constraint
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
			const CabWithPushFrame = Constraint.create({
				bodyA: cab,
				bodyB: pushFrame,
				pointA: {
					x: -60,
					y: -35,
				},
				pointB: {
					x: 120,
					y: -55,
				},
				length: 0,
				label: 'CabWithPushFrame',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const mobileCabWithPushFrame = Constraint.create({
				bodyA: cab,
				bodyB: pushFrame,
				pointA: {
					x: -60,
					y: 50,
				},
				pointB: {
					x: 20,
					y: -50,
				},
				label: 'mobileCabWithPushFrame',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const pushFrameWithBucket = Constraint.create({
				bodyA: pushFrame,
				bodyB: bucket,
				pointA: {
					x: -60,
					y: 120,
				},
				pointB: {
					x: 30,
					y: 10,
				},
				label: 'pushFrameWithBucket',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const mobilePushFrameWithBucket = Constraint.create({
				bodyA: pushFrame,
				bodyB: bucket,
				pointA: {
					x: -50,
					y: 50,
				},
				pointB: {
					x: -10,
					y: -50,
				},
				label: 'mobilePushFrameWithBucket',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});

			const TractorComposite = Composite.create({ label: 'TractorComposite' });

			Composite.add(TractorComposite, [cab, pushFrame, frontTrackWheel, backTrackWheel, bucket]);

			Body.setStatic(cab, staticParam);
			Body.setStatic(pushFrame, staticParam);
			Body.setStatic(bucket, staticParam);
			Body.setStatic(frontTrackWheel, staticParam);
			Body.setStatic(backTrackWheel, staticParam);

			Composite.add(TractorComposite, [
				CabWithFrontTrackWheel,
				CabWithBackTrackWheel,
				CabWithPushFrame,
				mobileCabWithPushFrame,
				pushFrameWithBucket,
				mobilePushFrameWithBucket,
			]);

			const position = Composite.bounds(TractorComposite);
			const positionX = (position.max.x + position.min.x) / 2;
			const positionY = (position.max.y + position.min.y) / 2;

			Composite.scale(TractorComposite, scale, scale, { x: positionX + x, y: positionY + y });

			const wheelSpeed = 0.1 * speed;
			Events.on(engine, 'beforeUpdate', function() {
				if (keys.ArrowRight) {
					Body.setAngularVelocity(frontTrackWheel, wheelSpeed);
					Body.setAngularVelocity(backTrackWheel, wheelSpeed);
				} else if (keys.ArrowLeft) {
					Body.setAngularVelocity(frontTrackWheel, -wheelSpeed);
					Body.setAngularVelocity(backTrackWheel, -wheelSpeed);
				}

				if (keys.ArrowUp) {
					mobileCabWithPushFrame.length += mobileCabWithPushFrame.length < 175 * scale ? 0.4 : 0;
				} else if (keys.ArrowDown) {
					mobileCabWithPushFrame.length -= mobileCabWithPushFrame.length > 128 * scale ? 0.4 : 0;
				}

				if (keys.KeyA) {
					mobilePushFrameWithBucket.length += mobilePushFrameWithBucket.length < 100 * scale ? 0.4 : 0;
				} else if (keys.KeyD) {
					mobilePushFrameWithBucket.length -= mobilePushFrameWithBucket.length > 10 * scale ? 0.4 : 0;
				}
			});
			if (side === 'right') {
				Composite.scale(TractorComposite, -1, 1, { x: positionX + x, y: positionY + y }, false);
			}

			return TractorComposite;
		};
		World.add(world, carTractor(550, 250, 1, false, 1, 'left'));

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
