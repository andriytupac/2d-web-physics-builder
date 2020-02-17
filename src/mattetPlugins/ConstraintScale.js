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
        base.before('Body.scale', function(body, scaleX, scaleY, point) {
            ConstraintScale.Body.scale(body, scaleX, scaleY, point);
        });
    },
    Composite: {
        allBodies: function(composite, scaleX, scaleY, point, recursive) {
            const constraints = recursive ? Composite.allConstraints(composite) : composite.constraints;
            const bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
            for (let i = 0; i < constraints.length; i++) {
                let constraint = constraints[i],
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
            let newRender;
            /*for (let i = 0; i < bodies.length; i++) {
                newRender = bodies[i].render;
                //console.log(newRender)
                newRender.sprite.xScale = newRender.sprite.xScale * scaleX;
                newRender.sprite.yScale = newRender.sprite.yScale * scaleY;

                //console.log(newRender)
                Body.set(bodies[i],'render',{
                    ...newRender,
                })
            }*/
        },
    },
    Body: {
        scale : function (body, scaleX, scaleY, point) {
            const newRender = body.render;
            newRender.sprite.xScale = newRender.sprite.xScale * scaleX;
            newRender.sprite.yScale = newRender.sprite.yScale * scaleY;
           // console.log(newRender,scaleX,scaleY)
            Body.set(body,'render',{
                ...newRender,
            })
        }
    }

    // implement your plugin functions etc...
};
export  default  ConstraintScale

