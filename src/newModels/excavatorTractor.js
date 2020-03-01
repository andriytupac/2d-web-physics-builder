import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';
import decomp from 'poly-decomp';

import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';
import ConstraintScale from '../mattetPlugins/ConstraintScale';
import RenderBodies from '../mattetPlugins/RenderBodies';

import ExcavatorTractorJson from './json/excavatorTractor.json';

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

function ExcavatorTractor(props) {
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

		const carExcavatorTractor = (x = 0, y = 0, scale = 1, staticParam = false, speed = 1, side = 'left') => {
			const group = Body.nextGroup(true);
			const globalPos = { x, y };
			// add bodies

			const frontTrackWheel = Bodies.circle(globalPos.x - 180, globalPos.y + 110, 85, {
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

			const backTrackWheel = Bodies.circle(globalPos.x + 85, globalPos.y + 110, 85, {
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
				ExcavatorTractorJson.cab,
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

			const pushFrame = Bodies.fromVertices(globalPos.x - 220, globalPos.y + 70, ExcavatorTractorJson.pushFrame, {
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
				globalPos.x - 395,
				globalPos.y + 155,
				ExcavatorTractorJson.bucket,
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
			const boom = Bodies.fromVertices(
				globalPos.x + 250,
				globalPos.y + 10,
				ExcavatorTractorJson.boom,
				{
					collisionFilter: { group },
					label: 'boom',
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
			const arm = Bodies.fromVertices(
				globalPos.x + 335,
				globalPos.y - 95,
				ExcavatorTractorJson.arm,
				{
					collisionFilter: { group },
					label: 'arm',
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
			const backBucket = Bodies.fromVertices(
				globalPos.x + 340,
				globalPos.y + 60,
				ExcavatorTractorJson.backBucket,
				{
					collisionFilter: { group },
					label: 'backBucket',
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
			const fixatorBucket = Bodies.rectangle(globalPos.x - 355, globalPos.y + 110, 78, 8, {
				collisionFilter: { group },
				label: 'fixatorBucket',
				render: {
					visible: true,
					sprite: {
						xScale: 1,
						yScale: 1,
					},
				},
			});
			Body.setAngle(fixatorBucket, -0.9);
			const fixatorArm = Bodies.rectangle(globalPos.x - 315, globalPos.y + 100, 8, 60, {
				collisionFilter: { group },
				label: 'fixatorArm',
				render: {
					visible: true,
					sprite: {
						xScale: 1,
						yScale: 1,
					},
				},
			});
			Body.setAngle(fixatorArm, -0.8);
			const fixatorBackBucket = Bodies.rectangle(globalPos.x + 370, globalPos.y + 90, 54, 8, {
				collisionFilter: { group },
				label: 'fixatorBackBucket',
				render: {
					visible: true,
					sprite: {
						xScale: 1,
						yScale: 1,
					},
				},
			});
			const fixatorBackArm = Bodies.rectangle(globalPos.x + 385, globalPos.y + 65, 8, 60, {
				collisionFilter: { group },
				label: 'fixatorBackArm',
				render: {
					visible: true,
					sprite: {
						xScale: 1,
						yScale: 1,
					},
				},
			});
			Body.setAngle(fixatorBackArm, -0.4);
			// add constraint
			const CabWithFrontTrackWheel = Constraint.create({
				bodyA: cab,
				bodyB: frontTrackWheel,
				pointA: {
					x: -200,
					y: 90,
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
					x: 65,
					y: 90,
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
					x: -100,
					y: -25,
				},
				pointB: {
					x: 140,
					y: -75,
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
					x: -100,
					y: 60,
				},
				pointB: {
					x: 20,
					y: -30,
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
					x: -140,
					y: 110,
				},
				pointB: {
					x: 35,
					y: 25,
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
			const mobilePushFrameWithFixatorArm = Constraint.create({
				bodyA: pushFrame,
				bodyB: fixatorArm,
				pointA: {
					x: 55,
					y: -75,
				},
				pointB: {
					x: -20,
					y: -15,
				},
				label: 'mobilePushFrameWithFixatorArm',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const fixatorArmWithFixatorBucket = Constraint.create({
				bodyA: fixatorArm,
				bodyB: fixatorBucket,
				pointA: {
					x: -20,
					y: -15,
				},
				pointB: {
					x: 20,
					y: -25,
				},
				label: 'fixatorArmWithFixatorBucket',
				stiffness: 1,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const fixatorArmWithFixatorBucket2 = Constraint.create({
				bodyA: fixatorArm,
				bodyB: fixatorBucket,
				pointA: {
					x: 20,
					y: 20,
				},
				pointB: {
					x: -20,
					y: 25,
				},
				label: 'fixatorArmWithFixatorBucket2',
				stiffness: 0.1,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const fixPushFrameWithFixatorArm = Constraint.create({
				bodyA: pushFrame,
				bodyB: fixatorArm,
				pointA: {
					x: -75,
					y: 50,
				},
				pointB: {
					x: 20,
					y: 20,
				},
				label: 'fixPushFrameWithFixatorArm',
				stiffness: 0.9,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const bucketWithFixatorBucket = Constraint.create({
				bodyA: bucket,
				bodyB: fixatorBucket,
				pointA: {
					x: 20,
					y: -20,
				},
				pointB: {
					x: -20,
					y: 25,
				},
				label: 'bucketWithFixatorBucket',
				stiffness: 0.9,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const cabWithBoom = Constraint.create({
				bodyA: cab,
				bodyB: boom,
				pointA: {
					x: 220,
					y: 120,
				},
				pointB: {
					x: -10,
					y: 130,
				},
				label: 'cabWithBoom',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const mobileCabWithBoom = Constraint.create({
				bodyA: cab,
				bodyB: boom,
				pointA: {
					x: 150,
					y: 0,
				},
				pointB: {
					x: -10,
					y: 0,
				},
				label: 'mobileCabWithBoom',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const fixBomWithArm = Constraint.create({
				bodyA: boom,
				bodyB: arm,
				pointA: {
					x: 35,
					y: -170,
				},
				pointB: {
					x: -50,
					y: -65,
				},
				label: 'fixBomWithArm',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const mobileBoomWithArm = Constraint.create({
				bodyA: boom,
				bodyB: arm,
				pointA: {
					x: -40,
					y: 0,
				},
				pointB: {
					x: -60,
					y: -130,
				},
				label: 'mobileBoomWithArm',
				stiffness: 0.6,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const fixArmWithBackBucket = Constraint.create({
				bodyA: arm,
				bodyB: backBucket,
				pointA: {
					x: 45,
					y: 165,
				},
				pointB: {
					x: 40,
					y: 10,
				},
				label: 'fixArmWithBackBucket',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const ArmWithFixatorBackArm = Constraint.create({
				bodyA: arm,
				bodyB: fixatorBackArm,
				pointA: {
					x: 40,
					y: 135,
				},
				pointB: {
					x: -10,
					y: -25,
				},
				label: 'ArmWithFixatorBackArm',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const backBucketWithFixatorBackBucket = Constraint.create({
				bodyA: backBucket,
				bodyB: fixatorBackBucket,
				pointA: {
					x: 10,
					y: 30,
				},
				pointB: {
					x: -20,
					y: 0,
				},
				label: 'backBucketWithFixatorBackBucket',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const fixatorBackArmWithFixatorBackBucket = Constraint.create({
				bodyA: fixatorBackArm,
				bodyB: fixatorBackBucket,
				pointA: {
					x: 10,
					y: 25,
				},
				pointB: {
					x: 25,
					y: 0,
				},
				label: 'fixatorBackArmWithFixatorBackBucket',
				stiffness: 0.6,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const fixatorBackArmWithFixatorBackBucket2 = Constraint.create({
				bodyA: fixatorBackArm,
				bodyB: fixatorBackBucket,
				pointA: {
					x: -10,
					y: -25,
				},
				pointB: {
					x: -20,
					y: 0,
				},
				label: 'fixatorBackArmWithFixatorBackBucket2',
				stiffness: 0.1,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const mobileArmWithFixatorBackArm = Constraint.create({
				bodyA: arm,
				bodyB: fixatorBackArm,
				pointA: {
					x: 25,
					y: -30,
				},
				pointB: {
					x: 20,
					y: -5,
				},
				label: 'mobileArmWithFixatorBackArm',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});

			const ExcavatorTractorComposite = Composite.create({ label: 'ExcavatorTractorComposite' });

			Composite.add(ExcavatorTractorComposite, [
				cab,
				pushFrame,
				frontTrackWheel,
				backTrackWheel,
				bucket,
				boom,
				arm,
				backBucket,
				fixatorArm,
				fixatorBucket,
				fixatorBackArm,
				fixatorBackBucket,
			]);

			Body.setStatic(cab, staticParam);
			Body.setStatic(pushFrame, staticParam);
			Body.setStatic(bucket, staticParam);
			Body.setStatic(frontTrackWheel, staticParam);
			Body.setStatic(backTrackWheel, staticParam);
			Body.setStatic(boom, staticParam);
			Body.setStatic(arm, staticParam);
			Body.setStatic(backBucket, staticParam);
			Body.setStatic(fixatorArm, staticParam);
			Body.setStatic(fixatorBucket, staticParam);
			Body.setStatic(fixatorBackArm, staticParam);
			Body.setStatic(fixatorBackBucket, staticParam);

			Composite.add(ExcavatorTractorComposite, [
				CabWithFrontTrackWheel,
				CabWithBackTrackWheel,
				CabWithPushFrame,
				mobileCabWithPushFrame,
				pushFrameWithBucket,
				mobilePushFrameWithFixatorArm,
				fixatorArmWithFixatorBucket,
				fixatorArmWithFixatorBucket2,
				fixPushFrameWithFixatorArm,
				bucketWithFixatorBucket,
				cabWithBoom,
				mobileCabWithBoom,
				fixBomWithArm,
				mobileBoomWithArm,
				fixArmWithBackBucket,
				ArmWithFixatorBackArm,
				backBucketWithFixatorBackBucket,
				fixatorBackArmWithFixatorBackBucket,
				fixatorBackArmWithFixatorBackBucket2,
				mobileArmWithFixatorBackArm,
			]);

			const position = Composite.bounds(ExcavatorTractorComposite);
			const positionX = (position.max.x + position.min.x) / 2;
			const positionY = (position.max.y + position.min.y) / 2;

			Composite.scale(ExcavatorTractorComposite, scale, scale, { x: positionX + x, y: positionY + y });

			const wheelSpeed = 0.05 * speed;
			const pistonSpeed = 0.5;
			Events.on(engine, 'beforeUpdate', function() {
				if (keys.ArrowRight) {
					Body.setAngularVelocity(frontTrackWheel, wheelSpeed);
					Body.setAngularVelocity(backTrackWheel, wheelSpeed);
				} else if (keys.ArrowLeft) {
					Body.setAngularVelocity(frontTrackWheel, -wheelSpeed);
					Body.setAngularVelocity(backTrackWheel, -wheelSpeed);
				}

				if (keys.ArrowUp) {
					mobileCabWithPushFrame.length += mobileCabWithPushFrame.length < 175 * scale ? pistonSpeed : 0;
				} else if (keys.ArrowDown) {
					mobileCabWithPushFrame.length -= mobileCabWithPushFrame.length > 128 * scale ? pistonSpeed : 0;
				}

				if (keys.Quote) {
					mobilePushFrameWithFixatorArm.length +=
						mobilePushFrameWithFixatorArm.length < 225 * scale ? pistonSpeed : 0;
				} else if (keys.Backslash) {
					mobilePushFrameWithFixatorArm.length -=
						mobilePushFrameWithFixatorArm.length > 160 * scale ? pistonSpeed : 0;
				}
				if (keys.KeyA) {
					mobileCabWithBoom.length -= mobileCabWithBoom.length > 50 * scale ? pistonSpeed : 0;
				} else if (keys.KeyD) {
					mobileCabWithBoom.length += mobileCabWithBoom.length < 300 * scale ? pistonSpeed : 0;
				}
				if (keys.KeyW) {
					mobileBoomWithArm.length += mobileBoomWithArm.length < 240 * scale ? pistonSpeed : 0;
				} else if (keys.KeyS) {
					mobileBoomWithArm.length -= mobileBoomWithArm.length > 135 * scale ? pistonSpeed : 0;
				}
				if (keys.KeyR) {
					mobileArmWithFixatorBackArm.length -=
						mobileArmWithFixatorBackArm.length > 120 * scale ? pistonSpeed : 0;
				} else if (keys.KeyF) {
					mobileArmWithFixatorBackArm.length +=
						mobileArmWithFixatorBackArm.length < 190 * scale ? pistonSpeed : 0;
				}
			});
			if (side === 'right') {
				Composite.scale(ExcavatorTractorComposite, -1, 1, { x: positionX + x, y: positionY + y }, false);
			}

			return ExcavatorTractorComposite;
		};
		World.add(world, carExcavatorTractor(800, 300, 1, false, 1, 'left'));

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
export default ExcavatorTractor;
