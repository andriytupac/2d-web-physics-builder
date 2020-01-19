const ConstraintInspector = {
  name: 'constraint-inspector',

  version: '0.1.0',

  for: 'matter-js@0.14.2',

  install: function install(base) {
    base.before('Render.inspector', function(inspector, context) {
      ConstraintInspector.Render.inspector(inspector, context);
    });
  },
  Render: {
    inspector: function(inspector, context) {
      var selected = inspector.selected;

      /* if (options.hasBounds) {
        var boundsWidth = render.bounds.max.x - render.bounds.min.x,
          boundsHeight = render.bounds.max.y - render.bounds.min.y,
          boundsScaleX = boundsWidth / render.options.width,
          boundsScaleY = boundsHeight / render.options.height;

        context.scale(1 / boundsScaleX, 1 / boundsScaleY);
        context.translate(-render.bounds.min.x, -render.bounds.min.y);
      } */

      for (var i = 0; i < selected.length; i++) {
        var item = selected[i].data;

        context.translate(0.5, 0.5);
        context.lineWidth = 1;
        context.strokeStyle = 'rgba(255,165,0,0.9)';
        context.setLineDash([1, 2]);

        if(item.type==='constraint' && item.bodyA){

          context.beginPath();
          context.arc(
            item.bodyA.bounds.min.x + (item.bodyA.bounds.max.x-item.bodyA.bounds.min.x)/2 + item.pointA.x,
            item.bodyA.bounds.min.y + (item.bodyA.bounds.max.y-item.bodyA.bounds.min.y)/2 + item.pointA.y,
            10,
            0,
            2 * Math.PI
          );
          context.closePath();
          context.stroke();

          context.beginPath();
          context.arc(
            item.bodyB.bounds.min.x + (item.bodyB.bounds.max.x-item.bodyB.bounds.min.x)/2 + item.pointB.x,
            item.bodyB.bounds.min.y + (item.bodyB.bounds.max.y-item.bodyB.bounds.min.y)/2 + item.pointB.y,
            10,
            0,
            2 * Math.PI
          );
          context.closePath();
          context.stroke();
        }else if(item.type==='mousePosition') {
          context.beginPath();
          context.arc(
            item.mouse.x,
            item.mouse.y,
            10,
            0,
            2 * Math.PI
          );
          context.closePath();
          context.stroke();
        }

        context.setLineDash([]);
        context.translate(-0.5, -0.5);
      }
    }
  }

  // implement your plugin functions etc...
};
export  default  ConstraintInspector

