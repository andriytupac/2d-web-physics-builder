import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';
import _ from 'lodash';

import decomp from 'poly-decomp';
import MatterAttractors from 'matter-attractors';
import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';

import angular from './images/jsLanguages/angular.png';
import angularMaterial from './images/jsLanguages/angularMaterial.png';
import angularPrimeng from './images/jsLanguages/angularPrimeng.png';
import angularBootstrap from './images/jsLanguages/angularBootstrap.png';
import ngxBootstrap from './images/jsLanguages/ngxBootstrap.png';
import ngZorro from './images/jsLanguages/ngZorro.png';
import onsenUI from './images/jsLanguages/onsenUI.png';

import nodeJs from './images/jsLanguages/nodeJs.png';
import Express from './images/jsLanguages/Express.png';
import nest from './images/jsLanguages/nest.png';
import koa from './images/jsLanguages/koa.png';
import totalJs from './images/jsLanguages/totalJs.png';
import sails from './images/jsLanguages/sails.png';
import loopBack from './images/jsLanguages/loopBack.png';

import react from './images/jsLanguages/react.png';
import ReactBootstrap from './images/jsLanguages/ReactBootstrap.png';
import ReactVirtualized from './images/jsLanguages/ReactVirtualized.png';
import ReactMaterial from './images/jsLanguages/ReactMaterial.png';
import semanticUi from './images/jsLanguages/semanticUi.png';
import reactstrap from './images/jsLanguages/reactstrap.png';
import blueprint from './images/jsLanguages/blueprint.png';

import vue from './images/jsLanguages/vue.png';
import vueBootstrap from './images/jsLanguages/vueBootstrap.png';
import VuePress from './images/jsLanguages/VuePress.png';
import vuetify from './images/jsLanguages/vuetify.png';
import buefy from './images/jsLanguages/buefy.png';
import qasar from './images/jsLanguages/qasar.png';
import vueMaterial from './images/jsLanguages/vueMaterial.png';

import database from './images/jsLanguages/database.png';
import mongo from './images/jsLanguages/mongo.png';
import mysql from './images/jsLanguages/mysql.png';
import postgre from './images/jsLanguages/postgre.png';
import redis from './images/jsLanguages/redis.png';
import mariandb from './images/jsLanguages/mariandb.png';
import oracle from './images/jsLanguages/oracle.png';

import webpack from './images/jsLanguages/webpack.png';
import css3 from './images/jsLanguages/css3.png';
import es6 from './images/jsLanguages/es6.png';
import html5 from './images/jsLanguages/html5.png';
import js from './images/jsLanguages/js.png';
import typescript from './images/jsLanguages/typescript.png';
import sass from './images/jsLanguages/sass.png';

import webApp from './images/jsLanguages/webApplication.png';

const allElements = {
	webpack,
	css3,
	es6,
	html5,
	js,
	typescript,
	sass,
	database,
	mongo,
	mysql,
	postgre,
	redis,
	mariandb,
	oracle,
	vue,
	vueBootstrap,
	VuePress,
	vuetify,
	buefy,
	qasar,
	vueMaterial,
	react,
	ReactBootstrap,
	ReactVirtualized,
	ReactMaterial,
	semanticUi,
	reactstrap,
	blueprint,
	angular,
	angularMaterial,
	angularPrimeng,
	angularBootstrap,
	ngxBootstrap,
	ngZorro,
	onsenUI,
	nodeJs,
	Express,
	nest,
	koa,
	totalJs,
	sails,
	loopBack,
};
// console.log('allElements', allElements);

window.decomp = decomp;

Matter.Plugin.register(IndexPosition);
Matter.Plugin.register(ConstraintInspector);
Matter.Plugin.register(MatterAttractors);
Matter.use('matter-zIndex-plugin', 'constraint-inspector', 'matter-attractors');

let render;

/* const importAll = r => {
	return r.keys().map(r);
}; */

// const images = importAll(require.context('./images/jsLanguages', false, /\.(png|jpe?g|svg)$/));
// console.log(images)

// atterAttractors.Attractors.gravityConstant = 0.00001
const Group = [];
Group[0] = ['css3', 'es6', 'js', 'sass', 'typescript', 'html5'];
Group[1] = ['Express', 'nest', 'koa', 'totalJs', 'sails', 'loopBack'];
Group[2] = ['mongo', 'mysql', 'postgre', 'redis', 'mariandb', 'oracle'];
Group[3] = ['angularMaterial', 'angularPrimeng', 'angularBootstrap', 'ngxBootstrap', 'ngZorro', 'onsenUI'];
Group[4] = ['ReactBootstrap', 'ReactVirtualized', 'ReactMaterial', 'semanticUi', 'reactstrap', 'blueprint'];
Group[5] = ['vueBootstrap', 'VuePress', 'vuetify', 'buefy', 'qasar', 'vueMaterial'];
Group[6] = ['js', 'Express', 'mongo', 'typescript', 'es6', 'sass', 'ReactMaterial', 'css3', 'html5'];

// const mainBlocks = ['webpack', 'database', 'nodeJs', 'angular', 'react', 'vue'];
function JsLanguages(props) {
	const { runInspector } = props;

	/* const getImage = imageName => {
		return images.find(el => {
			return el.match(imageName);
		});
	}; */

	const { restart } = useStoreState(state => state.general);
	const sceneEl = useRef(null);

	const { Engine, Render, Runner, World, Bodies, Common, Body, Events } = Matter;

	const ListElements = {};
	_.forOwn(allElements, (value, key) => {
		ListElements[key] = {
			list: [],
			category: Body.nextGroup(true),
			size: 10,
			radius: 20,
			image: value,
		};
	});
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
				width: 1600,
				height: 1000,
				wireframes: false,
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
			keys[e.code] = false;
			const drivingMode = localStorage.getItem('drivingMode') === 'true';
			if (drivingMode) {
				e.preventDefault();
			}
		});
		/** ******** key events ********* */

		/** ***** Body ***** */
		// add bodies
		const category = Body.nextGroup(true);
		const attractiveBodies = [];
		const attractiveBody = Bodies.circle(-300, render.options.height / 2, 76, {
			isStatic: true,
			mass: 116,
			collisionFilter: { category },
			render: {
				visible: true,
				sprite: {
					texture: webApp,
					xScale: (76 * 2) / 220,
					yScale: (76 * 2) / 220,
					xOffset: 0,
					yOffset: 0,
				},
			},
			plugin: {
				attractors: [],
			},
		});
		World.add(world, [attractiveBody]);

		const attractorFunc = function(bodyA, bodyB) {
			const force = {
				x: (bodyA.position.x - bodyB.position.x) * 1e-5,
				y: (bodyA.position.y - bodyB.position.y) * 1e-5,
			};
			const test = bodyA.collisionFilter.category === bodyB.collisionFilter.category;
			if (test) {
				return force;
			}
			return null;
		};

		let k = 50;
		let ky = 50;
		const additionalRadius = 20;
		_.forOwn(ListElements, (value, key) => {
			if (k > 1050) {
				k = 50;
				ky += 100;
			}
			ListElements[key].list = Bodies.circle(k, ky, value.radius + additionalRadius, {
				collisionFilter: { category: value.category },
				frictionAir: 0,
				friction: 0.0,
				mass: 1,
				restitution: 0.9,
				render: {
					visible: true,
					sprite: {
						texture: value.image,
						xScale: ((value.radius + additionalRadius) * 2) / 220,
						yScale: ((value.radius + additionalRadius) * 2) / 220,
						xOffset: 0,
						yOffset: 0,
					},
				},
			});

			k += 50;
			// ky += 10;
			World.add(world, ListElements[key].list);
		});

		/** ***** Body ***** */
		const createFixedBlock = (val, x, y) => {
			const obj = ListElements[val].list;
			Body.setStatic(obj, true);
			Body.setPosition(obj, { x, y });
			Body.setAngle(obj, 0);
			if (obj.plugin.attractors.length === 0) {
				obj.plugin.attractors.push(function(bodyA, bodyB) {
					const force = {
						x: (bodyA.position.x - bodyB.position.x) * 1e-5,
						y: (bodyA.position.y - bodyB.position.y) * 1e-5,
					};
					const test = bodyA.collisionFilter.category === bodyB.collisionFilter.category;
					// console.log(test)
					if (test) {
						return force;
					}
					return null;
				});
			}
		};
		const updateParamsBody = body => {
			// eslint-disable-next-line no-param-reassign
			body.friction = 0.003;
			// eslint-disable-next-line no-param-reassign
			body.restitution = 0.1;
		};

		let groupIndex = 0;
		let runIntrval = true;
		let indexValue = 0;

		let setAngleActivate = false;
		Events.on(engine, 'beforeUpdate', function() {
			if (setAngleActivate) {
				_.forOwn(ListElements, (value, key) => {
					const obj = ListElements[key].list;
					Body.setAngle(obj, 0);
				});
			}
			if (keys.KeyW) {
				groupIndex = 0;
				Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = ListElements.webpack.category;
				});
			} else if (keys.KeyE) {
				groupIndex = 1;
				Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = ListElements.nodeJs.category;
				});
			} else if (keys.KeyR) {
				groupIndex = 2;
				Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = ListElements.database.category;
				});
			} else if (keys.KeyT) {
				groupIndex = 3;
				Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = ListElements.angular.category;
				});
			} else if (keys.KeyY) {
				groupIndex = 4;
				Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = ListElements.react.category;
				});
			} else if (keys.KeyU) {
				groupIndex = 5;
				Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = ListElements.vue.category;
				});
			} else if (keys.KeyP) {
				groupIndex = 0;
				setAngleActivate = 1;
				Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = ListElements.webpack.category;
					updateParamsBody(ListElements[val].list);
				});
				groupIndex = 1;
				Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = ListElements.nodeJs.category;
					updateParamsBody(ListElements[val].list);
				});
				groupIndex = 2;
				Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = ListElements.database.category;
					updateParamsBody(ListElements[val].list);
				});
				groupIndex = 3;
				Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = ListElements.angular.category;
					updateParamsBody(ListElements[val].list);
				});
				groupIndex = 4;
				Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = ListElements.react.category;
					updateParamsBody(ListElements[val].list);
				});
				groupIndex = 5;
				Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = ListElements.vue.category;
					updateParamsBody(ListElements[val].list);
				});
			} else if (keys.KeyA) {
				_.forOwn(ListElements, (value, key) => {
					const obj = ListElements[key].list;
					Body.setAngle(obj, 0);
				});
			} else if (keys.KeyS) {
				world.gravity.scale = 0.001;
				_.forOwn(ListElements, (value, key) => {
					ListElements[key].list.collisionFilter.category = ListElements[key].category;
				});
			} else if (keys.KeyD) {
				world.gravity.scale = 0;
			} else if (keys.KeyM) {
				createFixedBlock('nodeJs', 200, render.options.height / 2);
				createFixedBlock('webpack', 600, 200);
				createFixedBlock('database', 600, render.options.height - 200);
				createFixedBlock('angular', render.options.width - 600, 200);
				createFixedBlock('react', render.options.width - 200, render.options.height / 2);
				createFixedBlock('vue', render.options.width - 600, render.options.height - 200);
			} else if (keys.KeyN) {
				ListElements.Express.list.collisionFilter.category = ListElements.nodeJs.category;
				ListElements.koa.list.collisionFilter.category = category;
			} else if (keys.KeyB) {
				ListElements.mongo.list.collisionFilter.category = ListElements.database.category;
				ListElements.mysql.list.collisionFilter.category = category;
			} else if (keys.KeyV) {
				ListElements.ReactMaterial.list.collisionFilter.category = ListElements.react.category;
				ListElements.angularMaterial.list.collisionFilter.category = category;
			} else if (keys.KeyC) {
				ListElements.angularMaterial.list.collisionFilter.category = ListElements.angular.category;
				ListElements.vuetify.list.collisionFilter.category = category;
			} else if (keys.KeyX) {
				ListElements.vuetify.list.collisionFilter.category = ListElements.vue.category;
				ListElements.semanticUi.list.collisionFilter.category = category;
			} else if (keys.KeyL) {
				if (attractiveBodies.length !== 1) {
					attractiveBodies.push(attractiveBody);
					Body.setPosition(attractiveBody, { x: render.options.width / 2, y: render.options.height / 2 });
					attractiveBody.plugin.attractors.push(attractorFunc);
					// World.add(world, [attractiveBody]);
				}
			} else if (keys.KeyK) {
				groupIndex = 6;
				if (runIntrval) {
					setInterval(() => {
						if (Group[groupIndex].length > indexValue) {
							const key = Group[groupIndex][indexValue];
							ListElements[key].list.collisionFilter.category = category;
							indexValue += 1;
						}
					}, 5000);
					/* Group[groupIndex].forEach(val => {
					ListElements[val].list.collisionFilter.category = category;
				}); */
				}
				runIntrval = false;
			}
		});

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
export default JsLanguages;
