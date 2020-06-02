import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';
import moment from 'moment';
import decomp from 'poly-decomp';
import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';
import watchJson from './json/watch.json';

import escapeWheelImg from './images/watch/escapeWheel.png';
import gearSecondsImg from './images/watch/gearSeconds.png';
import minuteWheelImg from './images/watch/minuteWheel.png';
import crankshaftImg from './images/watch/crankshaft.png';
import minuteGeneralImg from './images/watch/minuteGeneral.png';
import springGearImg from './images/watch/springGear.png';
import bigSpringGearImg from './images/watch/bigSpringGear.png';
import hourGearImg from './images/watch/hourGear.png';
import distributorWheelImg from './images/watch/distributorWheel.png';
import distributorMediumGearImg from './images/watch/distributorMediumGear1.png';
import configSpringImg from './images/watch/сonfigSpring.png';
import middlePartImg from './images/watch/middlePart.png';
import smallPartImg from './images/watch/smallPart.png';
import topPartImg from './images/watch/topPart.png';
import watchNumbersImg from './images/watch/watchNumbers.png';
import secondsAreaImg from './images/watch/secondsArea.png';
import minuteArrowImg from './images/watch/minuteArrow.png';
import hourArrowImg from './images/watch/hourArrow.png';
import secondArrowImg from './images/watch/secondArrow.png';
import switcherImg from './images/watch/switcher.png';
import smallCircleImg from './images/watch/smallCircle.png';
import crankshaftBottomImg from './images/watch/crankshaftBottom.png';

window.decomp = decomp;

Matter.Plugin.register(IndexPosition);
Matter.Plugin.register(ConstraintInspector);
Matter.use('matter-zIndex-plugin', 'constraint-inspector');

let render;

function Watch(props) {
	const { runInspector } = props;

	const { restart } = useStoreState(state => state.general);
	const sceneEl = useRef(null);

	const { Engine, Render, Runner, World, Bodies, Common, Body, Constraint, Events, Detector } = Matter;

	useEffect(() => {
		// eslint-disable-next-line no-underscore-dangle
		Common._nextId = 0;
		// eslint-disable-next-line no-underscore-dangle
		Common._seed = 0;
		const engine = Engine.create();
		const { world } = engine;
		world.gravity.scale = 0;

		render = Render.create({
			element: sceneEl.current,
			engine,
			options: {
				width: 1200,
				height: 1200,
				wireframes: false,
				showBounds: false,
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

		/** ******** key events ********* */
		const keys = [];
		document.body.addEventListener('keydown', function(e) {
			keys[e.code] = true;
			const drivingMode = localStorage.getItem('drivingMode') === 'true';
			if (drivingMode) {
				e.preventDefault();
			}
		});
		document.body.addEventListener('keyup', function(e) {
			const drivingMode = localStorage.getItem('drivingMode') === 'true';
			keys[e.code] = false;
			if (drivingMode) {
				e.preventDefault();
			}
		});
		/** ******** key events ********* */

		/** ***** Body ***** */
		// add bodies
		const globalPos = { x: 400, y: 700 };
		const group1 = Body.nextGroup(true);
		const group4 = Body.nextGroup(true);

		const additionalParams = {
			// inertia: 1000,
			// inverseInertia: 1 / 10,
			friction: 0,
			// frictionStaticNumber: 0,
			frictionAir: 0,
			isStatic: true,
			// mass: 1000,
		};
		const additionalConstraint = { stiffness: 1 };

		/** switcher */
		const switcherPos = { x: 113 + 3, y: 150 - 3 + 10 };
		const switcherPosRotate = { x: 113 + 3 - 13, y: 150 - 3 - 4 + 10 };
		const switcher = Bodies.fromVertices(
			globalPos.x + switcherPos.x,
			globalPos.y + switcherPos.y,
			watchJson.switcher,
			{
				label: 'switcher',
				collisionFilter: { group: group1 },
				restitution: 0,
				isStatic: true,
				// ...additionalParams,
				render: {
					pluginHide: true,
					sprite: {
						texture: switcherImg,
						xScale: 1,
						yScale: 1,
					},
				},
			},
			true,
		);
		Body.setAngle(switcher, 2);
		const constraintSwitcher = Constraint.create({
			pointB: { x: globalPos.x + switcherPos.x, y: globalPos.y + switcherPos.y },
			bodyA: switcher,
			pointA: { x: -13, y: -4 },
			label: 'constraintSwitcher',
			stiffness: 1,
			length: 0,
		});
		const crankshaftPos = { x: 14 + 186, y: 105 + 81 };
		// ////////// crankshaft /////////////// //
		const crankshaft = Bodies.circle(globalPos.x + crankshaftPos.x, globalPos.y + crankshaftPos.y, 177, {
			label: 'crankshaft',
			collisionFilter: { group: group1 },
			render: {
				pluginHide: true,
				sprite: {
					texture: crankshaftImg,
					xScale: 1,
					yScale: 1,
				},
			},
		});
		const crankshaftBottom = Bodies.circle(globalPos.x + crankshaftPos.x, globalPos.y + crankshaftPos.y, 35, {
			label: 'crankshaftBottom',
			collisionFilter: { group: group1 },
			render: {
				pluginHide: true,
				sprite: {
					texture: crankshaftBottomImg,
					xScale: 1,
					yScale: 1,
				},
			},
		});
		const constraintCrankshaft = Constraint.create({
			pointB: { x: globalPos.x + crankshaftPos.x, y: globalPos.y + crankshaftPos.y },
			bodyA: crankshaft,
			label: 'constraintCrankshaft',
			length: 0,
			...additionalConstraint,
		});

		const smallCircle = Bodies.circle(globalPos.x + crankshaftPos.x, globalPos.y + crankshaftPos.y, 10, {
			label: 'smallCircle',
			collisionFilter: { group: group1 },
			render: {
				pluginHide: true,
				sprite: {
					texture: smallCircleImg,
					xScale: 1,
					yScale: 1,
				},
			},
			restitution: 0,
		});

		const constraintCrankshaftSmallCircle = Constraint.create({
			pointA: { x: 10, y: 2 },
			bodyA: crankshaft,
			bodyB: smallCircle,
			label: 'constraintCrankshaftSmallCircle',
			length: 0,
			...additionalConstraint,
		});
		/** switcher */

		/** Escape Wheel */
		const escapeWheelBig = Bodies.fromVertices(
			globalPos.x,
			globalPos.y,
			watchJson.gearAnimation,
			{
				label: 'escapeWheelBig',
			},
			true,
		);
		escapeWheelBig.parts.shift();

		const escapeWheelSmall = Bodies.fromVertices(
			globalPos.x,
			globalPos.y,
			watchJson.gearVerySmall,
			{
				label: 'gearSmallSeconds',
			},

			true,
			0.01,
			5,
		);
		escapeWheelSmall.parts.shift();

		const escapeWheel = Body.create({
			parts: [...escapeWheelBig.parts, ...escapeWheelSmall.parts],
			collisionFilter: { group: group1 },
			render: {
				pluginHide: true,
				sprite: {
					texture: escapeWheelImg,
					xScale: 1,
					yScale: 1,
				},
			},
			label: 'escapeWheel',
			...additionalParams,
		});
		const escapeWheelPos = { x: 14, y: 105 };
		Body.setPosition(escapeWheel, { x: globalPos.x + escapeWheelPos.x, y: globalPos.y + escapeWheelPos.y });
		Body.rotate(escapeWheel, 0.2);

		const constraintEscapeWheel = Constraint.create({
			pointB: { x: globalPos.x + escapeWheelPos.x, y: globalPos.y + escapeWheelPos.y },
			bodyA: escapeWheel,
			label: 'constraintEscapeWheel',
			length: 0,
			...additionalConstraint,
		});

		/** Escape Wheel */

		/** seconds */
		const gearSmallSeconds = Bodies.fromVertices(
			globalPos.x,
			globalPos.y,
			watchJson.gearVerySmall,
			{
				label: 'gearSmallSeconds',
			},
			true,
			0.01,
			5,
		);
		gearSmallSeconds.parts.shift();

		const gearBigSeconds = Bodies.fromVertices(
			globalPos.x,
			globalPos.y,
			watchJson.gearSeconds,
			{
				label: 'gearBigSeconds',
			},
			true,
		);
		gearBigSeconds.parts.shift();

		const gearSeconds = Body.create({
			parts: [...gearBigSeconds.parts, ...gearSmallSeconds.parts],
			collisionFilter: { group: group1 },
			label: 'gearSeconds',
			render: {
				pluginHide: true,
				sprite: {
					texture: gearSecondsImg,
					xScale: 1,
					yScale: 1,
				},
			},
			...additionalParams,
		});
		Body.setPosition(gearSeconds, { x: globalPos.x, y: globalPos.y });
		Body.rotate(gearSeconds, 0.4);

		const constraintGearSeconds = Constraint.create({
			pointB: { x: globalPos.x, y: globalPos.y },
			bodyA: gearSeconds,
			label: 'fixedGearSeconds',
			length: 0,
			...additionalConstraint,
		});

		/** seconds */

		/** Minute Gear */
		const minuteWheelBig = Bodies.fromVertices(
			globalPos.x,
			globalPos.y,
			watchJson.bigMinutes,
			{
				label: 'minuteWheelBig',
			},
			true,
		);
		minuteWheelBig.parts.shift();

		const minuteWheelSmall = Bodies.fromVertices(
			globalPos.x,
			globalPos.y,
			watchJson.smallMinutes,
			{
				label: 'minuteWheelSmall',
			},
			true,
		);
		minuteWheelSmall.parts.shift();

		const minuteWheel = Body.create({
			parts: [...minuteWheelBig.parts, ...minuteWheelSmall.parts],
			collisionFilter: { group: group1 },
			label: 'minuteWheel',
			render: {
				pluginHide: true,
				sprite: {
					texture: minuteWheelImg,
					xScale: 1,
					yScale: 1,
				},
			},
			...additionalParams,
		});
		const minuteWheelPos = { x: 65, y: -92 };
		Body.setPosition(minuteWheel, { x: globalPos.x + minuteWheelPos.x, y: globalPos.y + minuteWheelPos.y });
		Body.rotate(minuteWheel, -0.1);
		const constraintMinuteWheel = Constraint.create({
			pointB: { x: globalPos.x + minuteWheelPos.x, y: globalPos.y + minuteWheelPos.y },
			bodyA: minuteWheel,
			label: 'constraintMinuteWheel',
			length: 0,
			...additionalConstraint,
		});

		/** Minute Gear */

		/** Minute General */
		const minute = Bodies.fromVertices(
			globalPos.x,
			globalPos.y,
			watchJson.minute,
			{
				label: 'minute',
			},
			true,
		);
		minute.parts.shift();

		/* const minuteSmall = Bodies.fromVertices(
			globalPos.x,
			globalPos.y,
			watchJson.minuteSmall,
			{
				label: 'minuteSmall',
			},
			true,
		);
		minuteSmall.parts.shift(); */

		const minuteMedium = Bodies.fromVertices(
			globalPos.x,
			globalPos.y,
			watchJson.minuteMedium,
			{
				label: 'minuteMedium',
			},
			true,
		);
		minuteMedium.parts.shift();

		const minuteGeneral = Body.create({
			parts: [...minute.parts, /* ...minuteSmall.parts, */ ...minuteMedium.parts],
			label: 'minuteGeneral',
			...additionalParams,
			collisionFilter: { group: group4, category: 0x0004 },
			render: {
				pluginHide: true,
				sprite: {
					texture: minuteGeneralImg,
					xScale: 1,
					yScale: 1,
				},
			},
		});
		const minutePos = { x: 65 + 130, y: -95 - 29 };
		Body.setPosition(minuteGeneral, { x: globalPos.x + minutePos.x, y: globalPos.y + minutePos.y });

		const constraintMinute = Constraint.create({
			pointB: { x: globalPos.x + minutePos.x, y: globalPos.y + minutePos.y },
			bodyA: minuteGeneral,
			label: 'constraintMinute',
			length: 0,
			...additionalConstraint,
		});

		/** Minute General */

		/** Spring Gear */
		const springGearPos = { x: 65 + 130 + 203, y: -95 - 29 - 69 };
		const springGear = Bodies.fromVertices(
			globalPos.x + springGearPos.x,
			globalPos.y + springGearPos.y,
			watchJson.springGear,
			{
				label: 'springGear',
				collisionFilter: { group: group1 },
				...additionalParams,
				render: {
					pluginHide: true,
					sprite: {
						texture: springGearImg,
						xScale: 1,
						yScale: 1,
					},
				},
			},
			true,
		);

		const constraintSpringGear = Constraint.create({
			pointB: { x: globalPos.x + springGearPos.x, y: globalPos.y + springGearPos.y },
			bodyA: springGear,
			label: 'constraintSpringGear',
			length: 0,
			...additionalConstraint,
		});
		Body.rotate(springGear, -0.1);
		/** Spring Gear */

		/** Big Spring */
		const bigSpringGearPos = { x: 65 + 130 + 203, y: -95 - 29 - 69 };
		const bigSpringGear = Bodies.fromVertices(
			globalPos.x + bigSpringGearPos.x,
			globalPos.y + bigSpringGearPos.y,
			watchJson.springActiveGear,
			{
				label: 'bigSpringGear',
				...additionalParams,
				render: {
					pluginHide: true,
					sprite: {
						texture: bigSpringGearImg,
						xScale: 1,
						yScale: 1,
					},
				},
			},
			true,
		);
		Body.rotate(bigSpringGear, -0.1);

		const constraintBigSpringGear = Constraint.create({
			pointB: { x: globalPos.x + bigSpringGearPos.x, y: globalPos.y + bigSpringGearPos.y },
			bodyA: bigSpringGear,
			label: 'constraintBigSpringGear',
			length: 0,
			...additionalConstraint,
		});
		/** Big Spring */

		/** config Spring */
		const configSpringPos = { x: 65 + 130, y: -95 - 29 - 207 };
		const configSpring = Bodies.fromVertices(
			globalPos.x + configSpringPos.x,
			globalPos.y + configSpringPos.y,
			watchJson.configSpring,
			{
				label: 'configSpring',
				collisionFilter: { group: group1 },
				...additionalParams,
				render: {
					pluginHide: true,
					sprite: {
						texture: configSpringImg,
						xScale: 1,
						yScale: 1,
					},
				},
			},
			true,
		);
		const constraintConfigSpringGear = Constraint.create({
			pointB: { x: globalPos.x + configSpringPos.x, y: globalPos.y + configSpringPos.y },
			bodyA: configSpring,
			label: 'constraintConfigSpringGear',
			length: 0,
			...additionalConstraint,
		});
		/** config Spring */

		/** hour Gear */
		const hourPos = { x: 65 + 130, y: -95 - 29 };
		const hourGear = Bodies.fromVertices(
			globalPos.x + hourPos.x,
			globalPos.y + hourPos.y,
			watchJson.mainHourGear,
			{
				label: 'hour',
				collisionFilter: { group: group1 },
				...additionalParams,
				render: {
					pluginHide: true,
					sprite: {
						texture: hourGearImg,
						xScale: 1,
						yScale: 1,
					},
				},
			},
			true,
		);
		Body.rotate(hourGear, -0.1);
		const constraintHourGear = Constraint.create({
			pointB: { x: globalPos.x + hourPos.x, y: globalPos.y + hourPos.y },
			bodyA: hourGear,
			label: 'constraintHourGear',
			length: 0,
			...additionalConstraint,
		});
		/** hour Gear */

		/** distributor Gear */
		const distributorBigGear = Bodies.fromVertices(
			globalPos.x,
			globalPos.y,
			watchJson.distributorGear,
			{
				label: 'distributorBigGear',
			},
			true,
		);
		distributorBigGear.parts.shift();

		const distributorSmallGear = Bodies.fromVertices(
			globalPos.x,
			globalPos.y,
			watchJson.distributorSmallGear,
			{
				label: 'distributorSmallGear',
			},
			true,
		);
		distributorSmallGear.parts.shift();

		const distributorWheel = Body.create({
			parts: [...distributorBigGear.parts, ...distributorSmallGear.parts],
			collisionFilter: { group: group1 },
			label: 'distributorWheel',
			...additionalParams,
			render: {
				pluginHide: true,
				sprite: {
					texture: distributorWheelImg,
					xScale: 1,
					yScale: 1,
				},
			},
		});
		const distributorPos = { x: 65 + 47, y: -92 - 98 };
		Body.setPosition(distributorWheel, { x: globalPos.x + distributorPos.x, y: globalPos.y + distributorPos.y });

		const constraintDistributorWheel = Constraint.create({
			pointB: { x: globalPos.x + distributorPos.x, y: globalPos.y + distributorPos.y },
			bodyA: distributorWheel,
			label: 'constraintDistributorWheel',
			length: 0,
			...additionalConstraint,
		});

		/** distributor Gear */

		/** distributor Medium Gears */
		const distributorMediumGearPos1 = { x: 65 + 47 + 45, y: -92 - 98 - 106 };
		const distributorMediumGear1 = Bodies.fromVertices(
			globalPos.x + distributorMediumGearPos1.x,
			globalPos.y + distributorMediumGearPos1.y,
			watchJson.distributorMediumGear,
			{
				label: 'distributorMediumGear1',
				collisionFilter: { group: group1 },
				...additionalParams,
				render: {
					pluginHide: true,
					sprite: {
						texture: distributorMediumGearImg,
						xScale: 1,
						yScale: 1,
					},
				},
			},
			true,
		);
		const constraintDistributorMediumGear1 = Constraint.create({
			pointB: { x: globalPos.x + distributorMediumGearPos1.x, y: globalPos.y + distributorMediumGearPos1.y },
			bodyA: distributorMediumGear1,
			label: 'constraintDistributorMediumGear1',
			length: 0,
			...additionalConstraint,
		});
		const distributorMediumGearPos2 = { x: 65 + 47 + 45 + 37, y: -92 - 98 - 106 - 55 };
		const distributorMediumGear2 = Bodies.fromVertices(
			globalPos.x + distributorMediumGearPos2.x,
			globalPos.y + distributorMediumGearPos2.y,
			watchJson.distributorMediumGear,
			{
				label: 'distributorMediumGear1',
				collisionFilter: { group: group1 },
				...additionalParams,
				render: {
					pluginHide: true,
					sprite: {
						texture: distributorMediumGearImg,
						xScale: 1,
						yScale: 1,
					},
				},
			},
			true,
		);
		Body.rotate(distributorMediumGear2, 0.2);
		const constraintDistributorMediumGear2 = Constraint.create({
			pointB: { x: globalPos.x + distributorMediumGearPos2.x, y: globalPos.y + distributorMediumGearPos2.y },
			bodyA: distributorMediumGear2,
			label: 'constraintDistributorMediumGear1',
			length: 0,
			...additionalConstraint,
		});
		/** distributor Medium Gears */

		/** topPart */
		const topPartPos = { x: 65 + 130, y: -95 - 29 };
		const topPart = Bodies.circle(globalPos.x + topPartPos.x, globalPos.y + topPartPos.y, 504, {
			label: 'topPart',
			collisionFilter: { group: group1 },
			...additionalParams,
			render: {
				pluginHide: true,
				sprite: {
					texture: topPartImg,
					xScale: 1,
					yScale: 1,
				},
			},
		});
		/** topPart */

		/** middlePart */
		const middlePartPos = { x: 65 + 130, y: -95 - 29 };
		const middlePart = Bodies.circle(globalPos.x + middlePartPos.x, globalPos.y + middlePartPos.y, 430, {
			label: 'middlePart',
			collisionFilter: { group: group1 },
			...additionalParams,
			render: {
				pluginHide: true,
				sprite: {
					texture: middlePartImg,
					xScale: 1,
					yScale: 1,
				},
			},
		});
		/** middlePart */
		/** smallPart */
		const smallPartPos = { x: 65 + 130, y: -95 - 29 };
		const smallPart = Bodies.circle(globalPos.x + smallPartPos.x, globalPos.y + smallPartPos.y, 389, {
			label: 'smallPart',
			collisionFilter: { group: group1 },
			...additionalParams,
			render: {
				pluginHide: true,
				sprite: {
					texture: smallPartImg,
					xScale: 1,
					yScale: 1,
				},
			},
		});
		/** watchNumbers */
		const watchNumbersPos = { x: 65 + 130, y: -95 - 29 };
		const watchNumbers = Bodies.circle(globalPos.x + watchNumbersPos.x, globalPos.y + watchNumbersPos.y, 389, {
			label: 'watchNumbers',
			collisionFilter: { group: group1 },
			...additionalParams,
			render: {
				pluginHide: true,
				sprite: {
					texture: watchNumbersImg,
					xScale: 1,
					yScale: 1,
				},
			},
		});
		/** watchNumbers */
		/** secondsArea */
		const secondsArea = Bodies.circle(globalPos.x, globalPos.y, 100.5, {
			label: 'secondsArea',
			collisionFilter: { group: group1 },
			...additionalParams,
			render: {
				pluginHide: true,
				sprite: {
					texture: secondsAreaImg,
					xScale: 1,
					yScale: 1,
				},
			},
		});
		/** secondsArea */

		/** hourArrow */
		const hourArrowPos = { x: 65 + 130, y: -95 - 29 - 94 };
		const hourArrow = Bodies.rectangle(globalPos.x + hourArrowPos.x, globalPos.y + hourArrowPos.y, 40, 227, {
			label: 'hourArrow',
			collisionFilter: { group: group1 },
			...additionalParams,
			render: {
				pluginHide: true,
				sprite: {
					texture: hourArrowImg,
					xScale: 1,
					yScale: 1,
				},
			},
		});
		/** hourArrow */
		/** minuteArrow */
		const minuteArrowPos = { x: 65 + 130, y: -95 - 29 - 141 };
		const minuteArrow = Bodies.rectangle(globalPos.x + minuteArrowPos.x, globalPos.y + minuteArrowPos.y, 40, 322, {
			label: 'minuteArrow',
			collisionFilter: { group: group1 },
			...additionalParams,
			render: {
				pluginHide: true,
				sprite: {
					texture: minuteArrowImg,
					xScale: 1,
					yScale: 1,
				},
			},
		});
		/** minuteArrow */
		const secondArrowPos = { x: 0, y: -20.5 };
		const secondArrow = Bodies.rectangle(globalPos.x + secondArrowPos.x, globalPos.y + secondArrowPos.y, 10, 93, {
			label: 'secondArrow',
			collisionFilter: { group: group1 },
			...additionalParams,
			render: {
				pluginHide: true,
				sprite: {
					texture: secondArrowImg,
					xScale: 1,
					yScale: 1,
				},
			},
		});
		/** minuteArrow */

		World.add(world, [
			crankshaftBottom,
			crankshaft,
			switcher,
			smallCircle,
			escapeWheel,
			gearSeconds,
			minuteWheel,
			springGear,
			minuteGeneral,
			bigSpringGear,
			distributorWheel,
			configSpring,
			hourGear,
			distributorMediumGear1,
			distributorMediumGear2,
			topPart,
			middlePart,
			smallPart,
			watchNumbers,
			secondsArea,
			hourArrow,
			minuteArrow,
			secondArrow,
		]);
		World.add(world, [
			constraintCrankshaft,
			constraintCrankshaftSmallCircle,
			constraintEscapeWheel,
			constraintGearSeconds,
			constraintMinuteWheel,
			constraintMinute,
			constraintSpringGear,
			constraintBigSpringGear,
			constraintConfigSpringGear,
			constraintHourGear,
			constraintDistributorWheel,
			constraintDistributorMediumGear1,
			constraintDistributorMediumGear2,
			// constraintSwitcher
		]);

		// Body.setAngle(crankshaft, -2.5)
		let moveRight = true;
		let moveLeft = false;
		let switcherSide = 'right';
		let switcherSide1 = 'right';

		const rotateSeconds = [];
		rotateSeconds[0] = -0.348;
		rotateSeconds[1] = (-1 * rotateSeconds[0] * 8) / 60;
		rotateSeconds[2] = (-1 * rotateSeconds[1] * 8) / 64;
		rotateSeconds[3] = (-1 * rotateSeconds[2] * 10) / 75;
		rotateSeconds[4] = (-1 * rotateSeconds[3] * 12) / 40;
		rotateSeconds[5] = (-1 * rotateSeconds[4] * 10) / 36;
		rotateSeconds[6] = (-1 * rotateSeconds[3] * 12) / 78;
		rotateSeconds[7] = (-1 * rotateSeconds[4] * 40) / 16;
		rotateSeconds[8] = (-1 * rotateSeconds[7] * 16) / 16;

		const rotateMinutes = [];
		rotateMinutes[8] = -0.031;
		rotateMinutes[7] = (-1 * rotateMinutes[8] * 16) / 16;
		rotateMinutes[4] = (-1 * rotateMinutes[7] * 16) / 40;
		rotateMinutes[5] = (-1 * rotateMinutes[4] * 10) / 36;
		rotateMinutes[3] = (-1 * rotateMinutes[4] * 40) / 12;
		rotateMinutes[6] = (-1 * rotateMinutes[3] * 12) / 78;
		rotateMinutes[2] = (-1 * rotateMinutes[3] * 75) / 10;
		rotateMinutes[1] = (-1 * rotateMinutes[2] * 64) / 8;
		rotateMinutes[0] = (-1 * rotateMinutes[1] * 60) / 8;
		// const rotateMin1 = (-1 * rotateConst8 * 16) / 16;

		const rotateConstPart2 = -0.01;
		// const rotateConst8 = (-1 * rotateConstPart2 * 23) / 48;

		const itemList = rotateSeconds;

		const checkAngle = -3;
		let rotateSystem = false;
		Body.rotate(switcher, -0.2, {
			x: globalPos.x + switcherPosRotate.x,
			y: globalPos.y + switcherPosRotate.y,
		});
		Body.setAngle(crankshaft, checkAngle);
		console.log(moment().format('h'));

		const rad = 0.0174532925;

		const seconds = (360 / 60) * moment().format('s') * 1 * rad;
		Body.setPosition(secondArrow, { x: globalPos.x + secondArrowPos.x, y: globalPos.y + secondArrowPos.y });
		Body.setAngle(secondArrow, 0);
		Body.rotate(secondArrow, seconds, {
			x: globalPos.x + secondArrowPos.x,
			y: globalPos.y + secondArrowPos.y + 20.5,
		});

		const minutes = (360 / 60) * moment().format('m') * 1 * rad + (6 / 60) * moment().format('s') * 1 * rad;
		Body.setPosition(minuteArrow, { x: globalPos.x + minuteArrowPos.x, y: globalPos.y + minuteArrowPos.y });
		Body.setAngle(minuteArrow, 0);
		Body.rotate(minuteArrow, minutes, {
			x: globalPos.x + minuteArrowPos.x,
			y: globalPos.y + minuteArrowPos.y + 141,
		});

		const hours = (360 / 12) * moment().format('h') * 1 * rad + (30 / 60) * moment().format('m') * 1 * rad;
		Body.setPosition(hourArrow, { x: globalPos.x + hourArrowPos.x, y: globalPos.y + hourArrowPos.y });
		Body.setAngle(hourArrow, 0);
		Body.rotate(hourArrow, hours, {
			x: globalPos.x + hourArrowPos.x,
			y: globalPos.y + hourArrowPos.y + 94,
		});
		let step = -48 * rad - 1;
		let stepO = 0;
		let difference = 0;
		let begin = false;
		let secondRange = moment().seconds();
		Events.on(engine, 'beforeUpdate', () => {
			const momentSeconds = moment().seconds();
			/*if (secondRange === momentSeconds && begin && step >= -48 * rad) {
				if (switcherSide1 === 'right') {
					Body.rotate(switcher, 0.2, {
						x: globalPos.x + switcherPosRotate.x,
						y: globalPos.y + switcherPosRotate.y,
					});
					switcherSide1 = 'left';
				}
				step += itemList[0];
				difference = step - -48 * rad;
				stepO = difference > 0 ? itemList[0] : itemList[0] - difference;
				Body.rotate(escapeWheel, stepO);
				Body.rotate(gearSeconds, itemList[1]);
				Body.rotate(secondArrow, itemList[1], {
					x: globalPos.x + secondArrowPos.x,
					y: globalPos.y + secondArrowPos.y + 20.5,
				});
			} else if (step < -48 * rad && secondRange === momentSeconds) {
				if (switcherSide1 === 'left') {
					Body.rotate(switcher, -0.2, {
						x: globalPos.x + switcherPosRotate.x,
						y: globalPos.y + switcherPosRotate.y,
					});
					switcherSide1 = 'right';
				}
			} else if (secondRange !== momentSeconds) {
				step = 0;
				secondRange = momentSeconds;
				begin = true;
			}*/

				Body.rotate(escapeWheel, itemList[0]);
				Body.rotate(gearSeconds, itemList[1]);
				Body.rotate(secondArrow, itemList[1], {
					x: globalPos.x + secondArrowPos.x,
					y: globalPos.y + secondArrowPos.y + 20.5,
				});
				Body.rotate(minuteWheel, itemList[2]);
				Body.rotate(minuteGeneral, itemList[3]);
				Body.rotate(minuteArrow, itemList[3], {
					x: globalPos.x + minuteArrowPos.x,
					y: globalPos.y + minuteArrowPos.y + 141,
				});
				Body.rotate(distributorWheel, itemList[4]);
				Body.rotate(hourGear, itemList[5]);
				Body.rotate(hourArrow, itemList[5], {
					x: globalPos.x + hourArrowPos.x,
					y: globalPos.y + hourArrowPos.y + 94,
				});
				Body.rotate(springGear, itemList[6]);
				Body.rotate(distributorMediumGear1, itemList[7]);
				Body.rotate(distributorMediumGear2, itemList[8]);


			if (crankshaft.angle <= 0.5 && moveRight) {
				Body.rotate(crankshaft, 0.15);
				if (crankshaft.angle >= checkAngle && switcherSide === 'right') {
					switcherSide = 'left';
					rotateSystem = false;
				}
			} else {
				moveRight = false;
				moveLeft = true;
			}
			if (crankshaft.angle >= -3.5 && moveLeft) {
				Body.rotate(crankshaft, -0.15);
				if (crankshaft.angle <= checkAngle && switcherSide === 'left') {
					switcherSide = 'right';
					rotateSystem = true;
				}
			} else {
				moveRight = true;
				moveLeft = false;
			}
		});

		/** ***** Body ***** */
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
	console.log(sceneEl)
	return <div ref={sceneEl} />;
}
export default Watch;
