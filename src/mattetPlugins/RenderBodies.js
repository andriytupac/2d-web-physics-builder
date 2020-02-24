// import Matter from 'matter-js';
// const Render = Matter.Render;
const RenderBodies = {
	name: 'matter-texture-from-vertices',

	version: '0.1.0',

	for: 'matter-js@0.14.2',

	install: function install(base) {
		base.after('Render.bodies', function(render, bodies, context) {
			RenderBodies.Render.bodies(render, bodies, context);
		});
	},
	Render: {
		bodies(render, bodies, context) {
			let body;
			const c = context;
			// console.log(bodies)
			for (let i = 0; i < bodies.length; i++) {
				body = bodies[i];

				if (body.render.sprite && body.render.sprite.texture) {
					const { sprite } = body.render;
					const texture = RenderBodies.Render._getTexture(render, sprite.texture);

					c.translate(body.position.x, body.position.y);
					c.rotate(body.angle);
					// console.log(texture)
					// return

					c.drawImage(
						texture,
						texture.width * -sprite.xOffset * sprite.xScale,
						texture.height * -sprite.yOffset * sprite.yScale,
						texture.width * sprite.xScale,
						texture.height * sprite.yScale,
					);

					// revert translation, hopefully faster than save / restore
					c.rotate(-body.angle);
					c.translate(-body.position.x, -body.position.y);
				}
			}
			// console.log(bodies)
		},
		_getTexture(render, imagePath) {
			let image = render.textures[imagePath];

			if (image) return image;

			image = render.textures[imagePath] = new Image();
			image.src = imagePath;

			return image;
		},
	},

	// implement your plugin functions etc...
};
export default RenderBodies;
