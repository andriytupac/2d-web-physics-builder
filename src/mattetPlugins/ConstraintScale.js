import Matter from 'matter-js';

const { Composite } = Matter;
const { Body } = Matter;

const ConstraintScale = {
	name: 'matter-scale-plugin',

	version: '0.1.0',

	for: 'matter-js@0.14.2',

	install: function install(base) {
		base.after('Composite.scale', function(composite, scaleX, scaleY, point, recursive) {
			ConstraintScale.Composite.allBodies(composite, scaleX, scaleY, point, recursive);
		});
		base.before('Body.scale', function(body, scaleX, scaleY, point) {
			ConstraintScale.Body.scale(body, scaleX, scaleY, point);
		});
	},
	Composite: {
		allBodies(composite, scaleX, scaleY, point, recursive) {
			const constraints = recursive ? Composite.allConstraints(composite) : composite.constraints;
			// eslint-disable-next-line no-plusplus
			for (let i = 0; i < constraints.length; i++) {
				const constraint = constraints[i];
				const pointAdx = constraint.pointA.x;
				const pointAdy = constraint.pointA.y;
				const pointBdx = constraint.pointB.x;
				const pointBdy = constraint.pointB.y;

				const pointAx = pointAdx * scaleX;
				const pointAy = pointAdy * scaleY;
				const pointBx = pointBdx * scaleX;
				const pointBy = pointBdy * scaleY;

				constraint.pointA.x = pointAx; // - pointAx;
				constraint.pointA.y = pointAy; // - pointAy;
				constraint.pointB.x = pointBx; // - pointAx;
				constraint.pointB.y = pointBy; // - pointAy;
				constraint.length *= Math.abs(scaleX);
			}
		},
	},
	Body: {
		scale(body, scaleX, scaleY) {
			const newRender = body.render;
			// eslint-disable-next-line operator-assignment
			newRender.sprite.xScale = newRender.sprite.xScale * scaleX;
			// eslint-disable-next-line operator-assignment
			newRender.sprite.yScale = newRender.sprite.yScale * scaleY;
			// console.log(newRender,scaleX,scaleY)
			Body.set(body, 'render', {
				...newRender,
			});
		},
	},

	// implement your plugin functions etc...
};
export default ConstraintScale;
