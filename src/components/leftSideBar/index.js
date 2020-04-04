import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Accordion, Menu, Segment, Sidebar, Icon, Button, Popup, Label } from 'semantic-ui-react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import _ from 'lodash';
import Matter from 'matter-js';
import GeneralSettings from '../generalSettings';
import AddBodies from '../addBodies';
import AddComposites from '../addComposites';
import AddConstraints from '../addConstraints';
import EditBody from '../editBody';
import CodeModal from '../codeModal';
import EditComposite from '../editComposite';
import EditConstraint from '../editConstraint';
import Toast from '../../common/toast';
import InfoModal from '../../common/infoModal';
import Search from '../search';

import './style.scss';

const {
	World,
	Events,
	Bodies,
	Render,
	Engine,
	Mouse,
	MouseConstraint,
	Body,
	Composite,
	Composites,
	Constraint,
	Runner,
	Common,
} = Matter;
let inspector = {};
const allCategories = [];
let globalDrivingMode;

// eslint-disable-next-line no-plusplus
for (let i = 0; i <= 28; i++) {
	const cat = Body.nextCategory();
	allCategories.push({ value: cat, key: cat, text: cat });
}

// List of bodies
const MenageElements = props => {
	const { obj } = props;
	// const world = useStoreState(state => state.general.render);
	const { editBodyId } = useStoreState(state => state.leftMenu);
	const { addEditBody } = useStoreActions(actions => actions.leftMenu);
	const [code, setCode] = useState(false);
	const [body, setBody] = useState({});

	const addRender = useStoreActions(actions => actions.general.addRender);
	// Delete obj
	const deleteObj = () => {
		const bodyObj = Composite.get(inspector.world, obj.id, obj.type);
		Composite.remove(inspector.world, bodyObj, true);
		inspector.selected.pop();
	};
	const editObj = () => {
		const bodyObj = Composite.get(inspector.world, obj.id, obj.type);
		setBody(bodyObj);
		addEditBody(obj.id !== editBodyId ? obj.id : 0);
	};
	const codeObj = () => {
		const bodyObj = Composite.get(inspector.world, obj.id, obj.type);
		setBody(bodyObj);
		setCode(!code);
	};
	const modifyBody = (data, key) => {
		// console.log(Composite.get(world,body.id, 'body'))
		if (key === 'rotate') {
			Body.rotate(body, +data.angle, { x: body.position.x + +data.x, y: body.position.y + +data.y });
		} else if (key === 'scale') {
			Body.scale(body, data.scaleX, data.scaleY, { x: body.position.x + +data.x, y: body.position.y + +data.y });
		} else if (key === 'render') {
			console.log('key', key, data);
			const newData = data;
			if (newData.sprite && newData.sprite.texture === 'none') {
				delete newData.sprite.texture;
			}
			const render = { ...body.render, ...data };
			Body.set(body, key, render);
		} else if (key === 'collisionFilter') {
			console.log('key', key, data);
			const render = { ...body.collisionFilter, ...data };
			Body.set(body, key, render);
		} else if (key === 'applyForce') {
			Body.applyForce(body, { x: body.position.x, y: body.position.y }, data);
		} else if (key === 'isStatic') {
			if (data !== body.isStatic) {
				Body.set(body, key, data);
			}
		} else {
			console.log('key', key, data);
			Body.set(body, key, data);
		}
		if (key === 'label') {
			addRender({ ...inspector.world });
		}
	};
	return (
		<div>
			<Popup
				trigger={
					<Button type="button" color="red" icon onClick={deleteObj}>
						<Icon name="trash" />
					</Button>
				}
				content="Delete Body"
				position="top center"
				size="tiny"
				inverted
			/>
			<Popup
				trigger={
					<Button type="button" icon primary onClick={editObj}>
						<Icon name="pencil" />
					</Button>
				}
				content="Edit Body"
				position="top center"
				size="tiny"
				inverted
			/>
			<Popup
				trigger={
					<Button type="button" icon color="green" onClick={codeObj}>
						<Icon name="code" />
					</Button>
				}
				content="Get Code"
				position="top center"
				size="tiny"
				inverted
			/>
			{code && (
				<CodeModal
					element="body"
					objectData={body}
					handlerClose={() => {
						setCode(!code);
					}}
				/>
			)}
			<div className="edit-form">
				{editBodyId === obj.id && (
					<EditBody
						formName={`editBodyForm${obj.id}`}
						objectData={body}
						modifyBody={modifyBody}
						allCategories={allCategories}
					/>
				)}
			</div>
		</div>
	);
};

const MenageElementsComposite = props => {
	const { obj } = props;
	// const world = useStoreState(state => state.general.render);
	const { editCompositeId } = useStoreState(state => state.leftMenu);
	const { addEditComposite } = useStoreActions(actions => actions.leftMenu);

	const addRender = useStoreActions(actions => actions.general.addRender);

	const [code, setCode] = useState(false);
	const [composite, setComposite] = useState({});

	const clearObj = () => {
		const findComposite = Composite.get(inspector.world, obj.id, obj.type);
		Composite.clear(findComposite, false, true);
		addRender({ ...inspector.world });
	};

	const deleteObj = () => {
		// Composite.clear(obj, false, true);
		const findComposite = Composite.get(inspector.world, obj.id, obj.type);
		Composite.remove(inspector.world, findComposite, true);
		// Composite.setModified(obj, true, true, true);
		// World.remove(world, obj, true);
	};

	const codeObj = () => {
		const compositeObj = Composite.get(inspector.world, obj.id, obj.type);
		setComposite(compositeObj);
		setCode(!code);
	};

	const editObj = () => {
		const compositeObj = Composite.get(inspector.world, obj.id, obj.type);
		setComposite(compositeObj);
		addEditComposite(obj.id !== editCompositeId ? obj.id : 0);
	};

	const modifyComposite = (data, key) => {
		const position = Composite.bounds(composite);

		const positionX = (position.max.x + position.min.x) / 2;
		const positionY = (position.max.y + position.min.y) / 2;

		if (key === 'rotate') {
			// const width = position.max.x-position.min.x;
			// const height = position.max.y-position.min.y;
			Composite.rotate(composite, +data.angle, { x: positionX + +data.x, y: positionY + +data.y });
		} else if (key === 'scale') {
			Composite.scale(composite, data.scaleX, data.scaleY, { x: positionX + +data.x, y: positionY + +data.y });
		} else if (key === 'label') {
			composite.label = data;
			addRender({ ...inspector.world });
		}
	};

	return (
		<div>
			<Popup
				trigger={
					<Button icon color="orange" onClick={clearObj}>
						<Icon name="eraser" />
					</Button>
				}
				content="Clear Bodies inside Composite"
				position="top left"
				size="tiny"
				inverted
			/>
			<Popup
				trigger={
					<Button icon color="red" onClick={deleteObj}>
						<Icon name="trash" />
					</Button>
				}
				content="Delete Composite"
				position="top center"
				size="tiny"
				inverted
			/>
			<Popup
				trigger={
					<Button icon primary onClick={editObj}>
						<Icon name="pencil" />
					</Button>
				}
				content="Edit Composite"
				position="top center"
				size="tiny"
				inverted
			/>
			<Popup
				trigger={
					<Button icon color="green" onClick={codeObj}>
						<Icon name="code" />
					</Button>
				}
				content="Get Code"
				position="top center"
				size="tiny"
				inverted
			/>
			{code && (
				<CodeModal
					element="composite"
					objectData={composite}
					handlerClose={() => {
						setCode(!code);
					}}
				/>
			)}
			<div className="edit-form">
				{editCompositeId === obj.id && (
					<EditComposite
						formName={`editCompositeForm${obj.id}`}
						objectData={composite}
						modifyComposite={modifyComposite}
					/>
				)}
			</div>
		</div>
	);
};

const MenageElementsConstraint = props => {
	const { obj } = props;
	// const world = useStoreState(state => state.general.render);
	const { editConstraintId } = useStoreState(state => state.leftMenu);
	const { addEditConstraint } = useStoreActions(actions => actions.leftMenu);

	const [code, setCode] = useState(false);
	const [constraint, setConstraint] = useState({});

	const addRender = useStoreActions(actions => actions.general.addRender);

	const deleteObj = () => {
		const constraintObj = Composite.get(inspector.world, obj.id, obj.type);
		World.remove(inspector.world, constraintObj, true);
	};
	const editObj = () => {
		const constraintObj = Composite.get(inspector.world, obj.id, obj.type);
		setConstraint(constraintObj);
		addEditConstraint(obj.id !== editConstraintId ? obj.id : 0);
	};
	const codeObj = () => {
		const constraintObj = Composite.get(inspector.world, obj.id, obj.type);
		setConstraint(constraintObj);
		setCode(!code);
	};

	const modifyConstraint = (data, key) => {
		constraint[key] = data;
		if (key === 'label') {
			addRender({ ...inspector.world });
		}
	};

	return (
		<div>
			<Popup
				trigger={
					<Button icon color="red" onClick={deleteObj}>
						<Icon name="trash" />
					</Button>
				}
				content="Delete Constraint"
				position="top center"
				size="tiny"
				inverted
			/>
			<Popup
				trigger={
					<Button icon primary onClick={editObj}>
						<Icon name="pencil" />
					</Button>
				}
				content="Edit Constraint"
				position="top center"
				size="tiny"
				inverted
			/>
			<Popup
				trigger={
					<Button icon color="green" onClick={codeObj}>
						<Icon name="code" />
					</Button>
				}
				content="Get Code"
				position="top center"
				size="tiny"
				inverted
			/>
			{code && (
				<CodeModal
					element="constraint"
					objectData={constraint}
					handlerClose={() => {
						setCode(!code);
					}}
				/>
			)}
			<div className="edit-form">
				{editConstraintId === obj.id && (
					<EditConstraint
						formName={`editConstraintForm${obj.id}`}
						objectData={constraint}
						modifyConstraint={modifyConstraint}
						inspectorOptions={inspector.world}
					/>
				)}
			</div>
		</div>
	);
};

const getHighlightText = (text, keyword) => {
	const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
	return (
		<span>
			{' '}
			{parts.map((part, i) => (
				<span key={i} style={part.toLowerCase() === keyword.toLowerCase() ? { color: '#2cb664' } : {}}>
					{part}
				</span>
			))}{' '}
		</span>
	);
};

const keywordFilter = (nodes, keyword) => {
	const newNodes = [];
	// eslint-disable-next-line no-restricted-syntax
	for (const n of nodes) {
		if (n.children) {
			const nextNodes = keywordFilter(n.children, keyword);
			if (nextNodes.length > 0) {
				n.children = nextNodes;
			} else if (n.label.toLowerCase().includes(keyword.toLowerCase())) {
				n.children = nextNodes.length > 0 ? nextNodes : [];
			}
			if (nextNodes.length > 0 || n.label.toLowerCase().includes(keyword.toLowerCase())) {
				n.label = getHighlightText(n.label, keyword);
				newNodes.push(n);
			}
		} else if (n.label.toLowerCase().includes(keyword.toLowerCase())) {
			n.label = getHighlightText(n.label, keyword);
			newNodes.push(n);
		}
	}
	return newNodes;
};

const LeftSideBar = props => {
	// Store
	const { menuLeft, staticBlocks, width, height, activeOpacity, treeElements, drivingMode } = useStoreState(
		state => state.general,
	);
	useLayoutEffect(() => {
		if (document.getElementsByTagName('canvas')[0]) {
			const canvas = document.getElementsByTagName('canvas')[0];
			if (window.innerWidth < canvas.width) {
				canvas.style.width = '100%';
			}
		}
	});
	globalDrivingMode = drivingMode;
	const { updateAllForSearch } = useStoreActions(action => action.leftMenu);
	const [search, setSearch] = useState('');
	let getAllComposites = [];
	let treeMap = [];
	if (treeElements.length) {
		treeMap = search.trim() ? keywordFilter(_.cloneDeep(treeElements), search) : treeElements;
		getAllComposites = Composite.allComposites(inspector.world);
	}
	const searchChange = (e, input) => {
		updateAllForSearch();
		setSearch(input.value);
	};

	const addOptions = useStoreActions(actions => actions.matterOptions.addOptions);

	const { addRender, runRestart, updateStaticBlocks, updateToast, updateDrivingMode } = useStoreActions(
		actions => actions.general,
	);

	useEffect(() => {
		localStorage.setItem('activeOpacity', activeOpacity);
	}, [activeOpacity]);

	// Change size canvas
	useEffect(() => {
		if (width && height) {
			inspector.sceneElement.children[0].width = width;
			inspector.sceneElement.children[0].height = height;
		}
	}, [width, height]);

	// Add Body
	const addBody = obj => {
		let dataObj = {};
		const particleOptions = {
			friction: 0.05,
			frictionStatic: 0.1,
			render: { visible: true },
		};
		if (obj.body === 'circle') {
			dataObj = Bodies.circle(+obj.x, +obj.y, +obj.radius, obj.options);
		} else if (obj.body === 'polygon') {
			console.log(obj);
			dataObj = Bodies.polygon(+obj.x, +obj.y, +obj.sides, +obj.radius, { ...obj.options, chamfer: obj.chamfer });
		} else if (obj.body === 'rectangle') {
			dataObj = Bodies.rectangle(+obj.x, +obj.y, +obj.width, +obj.height, {
				...obj.options,
				chamfer: obj.chamfer,
			});
		} else if (obj.body === 'trapezoid') {
			dataObj = Bodies.trapezoid(+obj.x, +obj.y, +obj.width, +obj.height, +obj.slope, {
				...obj.options,
				chamfer: obj.chamfer,
			});
		} else if (obj.body === 'fromVertices') {
			const newVertices = obj.vertices.map((val, index) => {
				const valVert = val;
				valVert.body = undefined;
				valVert.index = index;
				valVert.isInternal = false;
				valVert.x = +valVert.x;
				valVert.y = +valVert.y;
				return valVert;
			});
			dataObj = Bodies.fromVertices(+obj.x, +obj.y, newVertices, obj.options);
		} else if (obj.body === 'pyramid') {
			dataObj = Composites.pyramid(
				+obj.x,
				+obj.y,
				+obj.columns,
				+obj.rows,
				+obj.columnGap,
				+obj.rowGap,
				(x, y) => {
					return Bodies.rectangle(x, y, +obj.rectWidth, +obj.rectHeight, obj.options);
				},
			);
			dataObj.label = obj.label;
		} else if (obj.body === 'stack') {
			dataObj = Composites.stack(+obj.x, +obj.y, +obj.columns, +obj.rows, +obj.columnGap, +obj.rowGap, (x, y) => {
				return Bodies.rectangle(x, y, +obj.rectWidth, +obj.rectHeight, obj.options);
			});
			dataObj.label = obj.label;
		} else if (obj.body === 'newtonsCradle') {
			dataObj = Composites.newtonsCradle(+obj.x, +obj.y, +obj.number, +obj.size, +obj.length);
			dataObj.label = obj.label;
		} else if (obj.body === 'softBody') {
			dataObj = Composites.softBody(
				+obj.x,
				+obj.y,
				+obj.columns,
				+obj.rows,
				+obj.columnGap,
				+obj.rowGap,
				true,
				+obj.particleRadius,
				particleOptions,
			);
			dataObj.label = obj.Composites;
		} else if (obj.body === 'car') {
			dataObj = Composites.car(+obj.x, +obj.y, +obj.width, +obj.height, +obj.wheelSize);
			dataObj.label = obj.label;
		} else if (obj.body === 'custom') {
			dataObj = Composite.create({ label: obj.label });
			console.log(dataObj);
		}
		if (obj.composite === 0) {
			World.add(inspector.world, [dataObj]);
		} else {
			const compositeObj = Composite.get(inspector.world, obj.composite, 'composite');
			World.add(compositeObj, [dataObj]);
			addRender({ ...inspector.world });
		}
	};
	// Add Constraint
	const addConstraint = obj => {
		const constraint = Constraint.create(obj);
		if (obj.composite === 0) {
			World.add(inspector.world, [constraint]);
		} else {
			const compositeObj = Composite.get(inspector.world, obj.composite, 'composite');
			World.add(compositeObj, [constraint]);
			addRender({ ...inspector.world });
		}
	};
	// Add static blocks
	const addStaticBlocks = ({ render }) => {
		// eslint-disable-next-line no-shadow
		const { width, height } = render.options;

		const mouse = Mouse.create(render.canvas);
		const mouseConstraint = MouseConstraint.create(render.engine, {
			mouse,
			constraint: {
				stiffness: 0.2,
				render: {
					visible: false,
				},
			},
		});
		World.add(render.engine.world, [
			// walls
			Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true, label: 'Top wall' }),
			Bodies.rectangle(width / 2, height, width, 50, { isStatic: true, label: 'Bottom wall' }),
			Bodies.rectangle(width, height / 2, 50, height, { isStatic: true, label: 'Right wall' }),
			Bodies.rectangle(0, height / 2, 50, height, { isStatic: true, label: 'Left wall' }),
			mouseConstraint,
		]);
		updateStaticBlocks(false);
	};
	// Get info fromChild component
	const afterRender = function() {
		const renderController = inspector.render.controller;
		const { context } = inspector.render;
		if (renderController.inspector) renderController.inspector(inspector, context);
	};
	// Elements inspector
	const runInspector = value => {
		const keyboardKey = [];
		inspector = value;
		// console.log('inspector',inspector);
		// const { constraints } = inspector.world;

		const { engine } = inspector.render;

		if (staticBlocks) {
			addStaticBlocks(inspector);
		}
		Events.on(inspector.render, 'afterRender', afterRender);

		Events.on(engine.world, 'afterAdd', () => {
			addRender({ ...engine.world });
		});
		Events.on(engine.world, 'afterRemove', () => {
			addRender({ ...engine.world });
		});

		document.body.addEventListener('keydown', function(e) {
			// console.log(e.code, e);
			keyboardKey[e.code] = true;
			if (e.code === 'KeyQ') {
				globalDrivingMode = !globalDrivingMode;
				localStorage.setItem('drivingMode', globalDrivingMode);
				updateDrivingMode(globalDrivingMode);
			}
		});
		document.body.addEventListener('keyup', function(e) {
			e.preventDefault();
			keyboardKey[e.code] = false;
		});

		const mouse = Mouse.create(inspector.render.canvas);
		const mouseConstraint = MouseConstraint.create(engine, {
			mouse,
			constraint: {
				stiffness: 0.2,
				render: {
					visible: false,
				},
			},
		});

		World.add(inspector.world, [mouseConstraint]);
		Events.on(mouseConstraint, 'startdrag', event => {
			// console.log(event)
			if (keyboardKey.ControlLeft) {
				updateAllForSearch();
				setSearch(`${event.body.id} ${event.body.label}`);
			}
		});
		Events.on(mouseConstraint, 'mousedown', event => {
			// console.log(keyboardKey)
			if (keyboardKey.ShiftLeft) {
				const { x, y } = event.mouse.mousedownPosition;
				updateToast({ show: true, title: 'Mouse position', message: `x: ${x} y: ${y}` });
				// console.log(event.mouse)
				// /setSearch(`${event.body.id} ${event.body.label}`)
			}
		});

		// const mouseConstraint = _.find(inspector.world.constraints, o => o.pointB === null && o.bodyB === null );
	};
	// Get active body
	const activateBody = (data, type) => {
		if (data.active) {
			inspector.selected.pop();
			return;
		}
		const findObject = Composite.get(inspector.world, data.id, type);
		inspector.selected[0] = { data: findObject };
	};
	// Get active Constraint
	const activateBodyConstraint = (body, item) => {
		inspector.selected[item] = { data: body };
	};
	// add Body mouse Event
	const addBodyMouseEvent = obj => {
		inspector.selected.pop();
		inspector.selected[0] = { data: { type: 'mousePosition', mouse: { x: obj.x, y: obj.y } } };
	};
	// Update Body Mouse Event
	const updateBodyMouseEvent = (x, y) => {
		const position = inspector.selected[0];
		inspector.selected[0].data.mouse.x = x === false ? position.data.mouse.x : x;
		inspector.selected[0].data.mouse.y = y === false ? position.data.mouse.y : y;
	};
	// Get active constraint
	const activateConstraint = (data, type) => {
		if (data.active) {
			inspector.selected.pop();
			return;
		}
		const findObject = Composite.get(inspector.world, data.id, type);
		inspector.selected[0] = { data: findObject };
	};
	// List of bodies
	const LevelBodies = (bodies, type) => {
		const listBodies = bodies.map(val => {
			return {
				key: `body-${val.id}`,
				title: { content: val.label, id: val.id },
				content: {
					content: <MenageElements key={val.id} obj={val} />,
				},
			};
		});
		return (
			<div>
				<Accordion.Accordion
					onTitleClick={(event, data) => {
						activateBody(data, type);
					}}
					panels={listBodies}
				/>
			</div>
		);
	};
	// List of constraints
	const LevelConstraints = (constraints, type) => {
		const listConstraints = constraints.map(val => {
			return {
				key: `constraint-${val.id}`,
				title: { content: val.label, id: val.id },
				content: {
					content: <MenageElementsConstraint key={val.id} obj={val} />,
				},
			};
		});
		return (
			<div>
				<Accordion.Accordion
					onTitleClick={(event, data) => {
						activateConstraint(data, type);
					}}
					panels={listConstraints}
				/>
			</div>
		);
	};
	// List of composites
	const LevelComposites = composites => {
		const listComposites = composites.map(val => {
			return {
				key: `composites-${val.id}`,
				title: { content: val.label, id: val.id },
				content: {
					content: (
						<div>
							{/* eslint-disable-next-line no-use-before-define */}
							<MenageElementsComposite key={val.id} obj={val} /> {AccordionExampleNested(val.children)}
						</div>
					),
				},
			};
		});
		return (
			<div>
				<Accordion.Accordion
					key={`${search.trim()}accord_key_composite`}
					exclusive={false}
					defaultActiveIndex={search.trim() ? _.times(composites.length) : []}
					panels={listComposites}
				/>
			</div>
		);
	};

	/* const getAllValuesFromNodes = (nodes, firstLevel) => {
		if (firstLevel) {
			const values = [];
			for (const n of nodes) {
				values.push(n.label);
				if (n.composites) {
					values.push(...getAllValuesFromNodes(n.children, false));
				}
			}
			return values;
		}
		const values = [];
		for (const n of nodes) {
			values.push(n.label);
			if (n.composites) {
				values.push(...getAllValuesFromNodes(n.children, false));
			}
		}
		return values;
	}; */

	const combineTextWithLength = (label, length) => (
		<>
			{label} {length ? `(${length})` : ''}
		</>
	);
	// Main Accordion
	const AccordionExampleNested = general => {
		// console.log(_.times(5),Number)

		const rootPanels = [];
		general.forEach(obj => {
			if (obj.type === 'body' && obj.children) {
				rootPanels.push({
					key: 'bodies',
					title: { content: combineTextWithLength(obj.label, obj.children.length) },
					content: { content: LevelBodies(obj.children, 'body') },
				});
			} else if (obj.type === 'constraint' && obj.children) {
				rootPanels.push({
					key: 'constraint',
					title: { content: combineTextWithLength(obj.label, obj.children.length) },
					content: { content: LevelConstraints(obj.children, 'constraint') },
				});
			} else if (obj.type === 'composite' && obj.children) {
				rootPanels.push({
					key: 'composite',
					title: { content: combineTextWithLength(obj.label, obj.children.length) },
					content: { content: LevelComposites(obj.children, 'composite') },
				});
			}
		});
		// activeIndex={search.trim() ? _.times(general.length) : []}
		return (
			<Accordion
				key={`${search.trim()}accord_key`}
				panels={rootPanels}
				styled
				exclusive={false}
				defaultActiveIndex={search.trim() ? _.times(general.length) : []}
			/>
		);
	};

	// eslint-disable-next-line react/destructuring-assignment
	const childrenWithProps = React.Children.map(props.children, child => {
		return React.cloneElement(child, { runInspector });
	});

	const changeOptions = (value, name) => {
		inspector.render.options[name] = value;
		console.log(inspector.render.options);
	};

	const [open, setOpen] = useState();

	const openMenuContent = (e, titleProps) => {
		const { index } = titleProps;
		const newIndex = open === index ? -1 : index;
		setOpen(newIndex);
	};
	// reload existing render
	const reloadCanvas = () => {
		const { render, world, runner } = inspector;
		Render.stop(render);
		Runner.stop(runner);
		Engine.clear(render.engine);
		World.clear(world);
		render.canvas.remove();
		render.canvas = null;
		render.context = null;
		render.textures = {};
		// eslint-disable-next-line no-underscore-dangle
		Common._nextId = 0;
		// eslint-disable-next-line no-underscore-dangle
		Common._seed = 0;
		// render.engine.events = {}
		runRestart();
	};
	// Clear existing render
	const clearCanvas = () => {
		const { render } = inspector;
		Engine.clear(render.engine);
		World.clear(render.engine.world);
		addStaticBlocks(inspector);
		// console.log(inspector)
	};

	useEffect(() => {
		addOptions(inspector.options || {});
	});
	// console.log('general',getAllValuesFromNodes(general.composites, true))

	return (
		<Sidebar.Pushable as={Segment} className="main-container">
			<Sidebar
				as={Menu}
				animation="overlay"
				icon="labeled"
				inverted
				// onHide={() => turnMenu()}
				vertical
				visible={menuLeft}
				width="wide"
				className={activeOpacity ? 'show-opacity-menu' : ''}
			>
				{drivingMode && (
					<div className="driving-mode">
						<Label as="a" color="green" tag>
							Driving mode
						</Label>
					</div>
				)}
				<Search search={search} searchChange={searchChange} keyboard={inspector.keyboard} />
				{AccordionExampleNested(treeMap)}
				<Accordion styled>
					<Accordion.Title active={open === 1} content="Add bodies" onClick={openMenuContent} index={1} />
					<Accordion.Content
						active={open === 1}
						content={
							inspector.options &&
							open === 1 && (
								<AddBodies
									getAllComposites={getAllComposites}
									addBodyMouseEvent={addBodyMouseEvent}
									updateBodyMouseEvent={updateBodyMouseEvent}
									addBody={addBody}
								/>
							)
						}
					/>
					<Accordion.Title active={open === 2} content="Add Composites" onClick={openMenuContent} index={2} />
					<Accordion.Content
						active={open === 2}
						content={
							inspector.options &&
							open === 2 && (
								<AddComposites
									getAllComposites={getAllComposites}
									addBodyMouseEvent={addBodyMouseEvent}
									updateBodyMouseEvent={updateBodyMouseEvent}
									addBody={addBody}
								/>
							)
						}
					/>
					<Accordion.Title active={open === 3} content="Add Constraint" onClick={openMenuContent} index={3} />
					<Accordion.Content
						active={open === 3}
						content={
							inspector.options &&
							open === 3 && (
								<AddConstraints
									getAllComposites={getAllComposites}
									inspectorOptions={inspector.world}
									activateBodyConstraint={activateBodyConstraint}
									addConstraint={addConstraint}
								/>
							)
						}
					/>
					<Accordion.Title
						active={open === 0}
						content="General Setting"
						onClick={openMenuContent}
						index={0}
					/>
					<Accordion.Content
						active={open === 0}
						content={
							inspector.options && (
								<GeneralSettings
									changeOptions={changeOptions}
									clearCanvas={clearCanvas}
									inspectorOptions={inspector.options}
									reloadCanvas={reloadCanvas}
								/>
							)
						}
					/>
				</Accordion>
			</Sidebar>
			<InfoModal />
			<Toast />
			<Sidebar.Pusher>
				<Segment basic>{childrenWithProps}</Segment>
			</Sidebar.Pusher>
		</Sidebar.Pushable>
	);
};

export default LeftSideBar;
