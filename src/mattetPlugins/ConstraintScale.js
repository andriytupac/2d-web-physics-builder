import Matter from 'matter-js';

const  Composite = Matter.Composite;
const  Body = Matter.Body;

const ConstraintScale = {
    name: 'matter-scale-plugin',

    version: '0.1.0',

    for: 'matter-js@0.14.2',

    install: function install(base) {
        base.after('Composite.scale', function(composite, scaleX, scaleY, point, recursive) {
            ConstraintScale.Composite.allBodies(composite, scaleX, scaleY, point, recursive);
        });
    },
    Composite: {
        allBodies: function(composite, scaleX, scaleY, point, recursive) {
            var constraints = recursive ? Composite.allConstraints(composite) : composite.constraints;
            console.log(composite,point)
            for (var i = 0; i < constraints.length; i++) {
                var constraint = constraints[i],
                    pointAdx = constraint.pointA.x ,
                    pointAdy = constraint.pointA.y ,
                    pointBdx = constraint.pointB.x ,
                    pointBdy = constraint.pointB.y ;

                    let pointAx = pointAdx * scaleX;
                    let pointAy = pointAdy * scaleY;
                    let pointBx = pointBdx * scaleX;
                    let pointBy = pointBdy * scaleY;

                    constraint.pointA.x = pointAx //- pointAx;
                    constraint.pointA.y = pointAy //- pointAy;
                    constraint.pointB.x = pointBx //- pointAx;
                    constraint.pointB.y = pointBy //- pointAy;
                    constraint.length = constraint.length * scaleX


                /*constraint.pointA.x = pointAdx;
                constraint.pointA.y = pointAdy;
                constraint.pointB.x = pointBdx;
                constraint.pointB.y = pointBdy;*/
                ///pointBdx,pointBdy)
                /*Body.setPosition(body, {
                    x: point.x + dx * scaleX,
                    y: point.y + dy * scaleY
                });

                Body.scale(body, scaleX, scaleY);*/
            }
        },
    }

    // implement your plugin functions etc...
};
export  default  ConstraintScale

