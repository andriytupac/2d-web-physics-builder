const IndexPosition = {
	name: 'matter-zIndex-plugin',

	version: '0.1.0',

	for: 'matter-js@0.14.2',

	install: function install(base) {
		base.before('Composite.allBodies', function(options) {
			IndexPosition.Composite.allBodies(options);
		});
	},
	Composite: {
		allBodies(options) {
			options.bodies.sort((a, b) => {
				const zIndexA = a.render && typeof a.render.zIndex !== 'undefined' ? a.render.zIndex : 0;
				const zIndexB = b.render && typeof b.render.zIndex !== 'undefined' ? b.render.zIndex : 0;
				return zIndexA - zIndexB;
			});
			return options;
		},
	},

	// implement your plugin functions etc...
};
export default IndexPosition;
