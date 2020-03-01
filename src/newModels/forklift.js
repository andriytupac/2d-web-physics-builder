import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';
import decomp from 'poly-decomp';

import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';
import ConstraintScale from '../mattetPlugins/ConstraintScale';
import RenderBodies from '../mattetPlugins/RenderBodies';

import ForkliftJson from './json/forklift.json';

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

function Forklift(props) {
	const { runInspector } = props;

	const { restart } = useStoreState(state => state.general);
	const sceneEl = useRef(null);

	const { Engine, Render, Runner, World, Bodies, Constraint, Composite, Common, Body, Events, Vertices } = Matter;

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

		const carForklift = (x = 0, y = 0, scale = 1, staticParam = false, speed = 1, side = 'left') => {
			const group = Body.nextGroup(true);
			const globalPos = { x, y };
			// add bodies

			const frontTrackWheel = Bodies.circle(globalPos.x - 70, globalPos.y + 110, 37, {
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

			const backTrackWheel = Bodies.circle(globalPos.x + 110, globalPos.y + 110, 37, {
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
				ForkliftJson.cab,
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

			const forkliftP1 = Bodies.rectangle(0, 0, 26, 190, {
				collisionFilter: { group },
				label: 'forkliftP1',
				render: {
					visible: true,
					sprite: {
						xScale: 1,
						yScale: 1,
					},
				},
			});
			const forkliftP2 = Bodies.fromVertices(
				-60,
				72,
				ForkliftJson.forks,
				{
					collisionFilter: { group },
					label: 'forkliftP2',
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
			forkliftP2.parts.shift();
			const forklift = Body.create({
				label: 'forklift',
				parts: [...forkliftP1.parts, ...forkliftP2.parts],
				collisionFilter: { group, mask: 0x0001 },
				render: {
					sprite: {
						xScale: 1,
						yScale: 1,
					},
				},
			});
			Body.setPosition(forklift, { x: globalPos.x - 140, y: globalPos.y + 50 });

			// add constraint
			const CabWithFrontTrackWheel = Constraint.create({
				bodyA: cab,
				bodyB: frontTrackWheel,
				pointA: {
					x: -90,
					y: 90,
				},
				length: 0,
				label: 'cabWithFrontTrackWheel',
				stiffness: 0.3,
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
					x: 90,
					y: 90,
				},
				length: 0,
				label: 'cabWithBackTrackWheel',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					strokeStyle: '#ffffff',
					type: 'spring',
					anchors: true,
				},
			});
			const cabWithForklift = Constraint.create({
				bodyA: cab,
				bodyB: forklift,
				pointA: {
					x: -130,
					y: 100,
				},
				pointB: {
					x: 30,
					y: 70,
				},
				length: 0,
				label: 'CabWithForklift',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});
			const mobileCabWithForklift = Constraint.create({
				bodyA: cab,
				bodyB: forklift,
				pointA: {
					x: -90,
					y: -20,
				},
				pointB: {
					x: 20,
					y: -50,
				},
				label: 'mobileCabWithForklift',
				stiffness: 0.3,
				damping: 0,
				render: {
					visible: true,
					lineWidth: 2,
					type: 'line',
					anchors: true,
				},
			});

			const ForkliftComposite = Composite.create({ label: 'ForkliftComposite' });

			Composite.add(ForkliftComposite, [cab, forklift, frontTrackWheel, backTrackWheel]);

			Body.setStatic(cab, staticParam);
			Body.setStatic(forklift, staticParam);
			Body.setStatic(frontTrackWheel, staticParam);
			Body.setStatic(backTrackWheel, staticParam);

			Composite.add(ForkliftComposite, [
				CabWithFrontTrackWheel,
				CabWithBackTrackWheel,
				mobileCabWithForklift,
				cabWithForklift,
			]);

			const position = Composite.bounds(ForkliftComposite);
			const positionX = (position.max.x + position.min.x) / 2;
			const positionY = (position.max.y + position.min.y) / 2;

			Composite.scale(ForkliftComposite, scale, scale, { x: positionX + x, y: positionY + y });

			const wheelSpeed = 0.1 * speed;
			let lengthMobileFork = 0;
			Events.on(engine, 'beforeUpdate', function() {
				if (keys.ArrowRight) {
					Body.setAngularVelocity(frontTrackWheel, wheelSpeed);
					Body.setAngularVelocity(backTrackWheel, wheelSpeed);
				} else if (keys.ArrowLeft) {
					Body.setAngularVelocity(frontTrackWheel, -wheelSpeed);
					Body.setAngularVelocity(backTrackWheel, -wheelSpeed);
				}

				if (keys.ArrowUp) {
					if (lengthMobileFork < 19) {
						lengthMobileFork += 0.1;
						Body.setPosition(forkliftP2, {
							x: forkliftP2.position.x + Math.sin(forklift.angle),
							y: forkliftP2.position.y - Math.cos(forklift.angle),
						});
						Object.assign(
							forklift.vertices,
							Vertices.create(
								[
									forkliftP2.parts[0].bounds.min,
									forkliftP2.parts[0].bounds.max,
									forkliftP2.parts[1].bounds.min,
									forkliftP2.parts[1].bounds.max,
								],
								forklift,
							),
						);
					}
				} else if (keys.ArrowDown) {
					if (lengthMobileFork > -3) {
						lengthMobileFork -= 0.1;
						Body.setPosition(forkliftP2, {
							x: forkliftP2.position.x - Math.sin(forklift.angle),
							y: forkliftP2.position.y + Math.cos(forklift.angle),
						});
						Object.assign(
							forklift.vertices,
							Vertices.create(
								[
									forkliftP2.parts[0].bounds.min,
									forkliftP2.parts[0].bounds.max,
									forkliftP2.parts[1].bounds.min,
									forkliftP2.parts[1].bounds.max,
								],
								forklift,
							),
						);
					}
				}

				if (keys.KeyA) {
					mobileCabWithForklift.length += mobileCabWithForklift.length < 80 * scale ? 0.4 : 0;
				} else if (keys.KeyD) {
					mobileCabWithForklift.length -= mobileCabWithForklift.length > 25 * scale ? 0.4 : 0;
				}
			});
			if (side === 'right') {
				Composite.scale(ForkliftComposite, -1, 1, { x: positionX + x, y: positionY + y }, false);
			}

			return ForkliftComposite;
		};
		World.add(world, carForklift(700, 300, 1, false, 1, 'left'));

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
export default Forklift;
