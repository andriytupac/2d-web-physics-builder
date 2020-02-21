# 2d web physics builder

2d web physics builder is a React wrapper which helps to create edit and manage [matter.js](https://github.com/liabru/matter-js) elements
## Installation

You can use `yarn` or `npm`

```bash
yan install
npm install
```

## Usage

```javaScript
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
```

## Example
Example of creating an empty area
```javaScript
import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';

import decomp from 'poly-decomp';
import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';

window.decomp = decomp;

Matter.Plugin.register(IndexPosition);
Matter.Plugin.register(ConstraintInspector);
Matter.use('matter-zIndex-plugin', 'constraint-inspector');

let render;

function MatterDemo(props) {
	const { runInspector } = props;

	const { restart } = useStoreState(state => state.general);
	const sceneEl = useRef(null);

	const { Engine, Render, Runner, World, Bodies, Common } = Matter;

	useEffect(() => {
		Common._nextId = 0;
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

		/** ***** Body ***** */
		  // add bodies
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
  },[restart]);
	return <div ref={sceneEl} />;
}
export default MatterDemo;

```
## Examples
Standard examples are in the folder: ```./src/matterDemo/```

Machines examples are in the folder: ```./src/newModels/```

## License
[MIT](https://choosealicense.com/licenses/mit/)