import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';

import wheel from './images/bulldozer/wheel.png';
import gear from './images/bulldozer/gear.png';
import wheelSmall from './images/bulldozer/wheel_small.png';
import imgCab from './images/bulldozer/cab.png';
import imgTrack from './images/bulldozer/track.png';
import imgTire from './images/bulldozer/tire.png';
import imgRipper from './images/bulldozer/ripper.png';
import imgPushFrame from './images/bulldozer/pushFrame.png';
import imgBlade from './images/bulldozer/blade.png';
import bulldozerJson from './json/bulldozer'

import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';
import ConstraintScale from '../mattetPlugins/ConstraintScale';
import RenderBodies from '../mattetPlugins/RenderBodies';
import decomp from 'poly-decomp';
window.decomp = decomp;

// import Ball from "../img/ball.png";

Matter.Plugin.register(IndexPosition);
Matter.Plugin.register(ConstraintInspector);
Matter.Plugin.register(ConstraintScale);
Matter.Plugin.register(RenderBodies);
//Matter.Plugin.register(decomp);
Matter.use(
    'matter-zIndex-plugin',
    'constraint-inspector',
    'matter-scale-plugin',
    'matter-texture-from-vertices'
);

let render;

function Bulldozer(props){

    const { runInspector } = props;

    const { restart } = useStoreState(
        state => state.general
    );
    const sceneEl = useRef(null);

    const Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Mouse = Matter.Mouse,
        Common = Matter.Common,
        Runner = Matter.Runner,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        Body = Matter.Body,
        Events = Matter.Events,
        MouseConstraint = Matter.MouseConstraint;

    useEffect(() => {
        Common._nextId = 0;
        Common._seed = 0;
        const engine = Engine.create();
        const world = engine.world;

        render = Render.create({
            element: sceneEl.current,
            engine: engine,
            options: {
                width: 1400,
                height: 600,
                wireframes: false,
                showBounds: false
            }
        });

        Render.run(render);
        // create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        /******* connect inspector ******/
        let inspector = {
            runner,
            world: engine.world,
            sceneElement: sceneEl.current,
            render: render,
            options: render.options,
            selectStart: null,
            selectBounds: render.bounds,
            selected: [],
        };
        runInspector(inspector);
        /******* connect inspector ******/

        /********** key events **********/
        const keys = [];
        document.body.addEventListener("keydown", function(e) {
            keys[e.keyCode] = true;
            //e.preventDefault();
            //console.log(e)

        });
        document.body.addEventListener("keyup", function(e) {
            e.preventDefault();
            keys[e.keyCode] = false;
        });
        /********** key events **********/

        /******* Body ******/

        const carExcavator = (x= 0, y = 0, scaleX = 1, scaleY = 1, staticParam = false) => {
            let group = Body.nextGroup(-1);
            const globalPos = { x: 750, y: 400 };
            const allWheels = [];
            // add bodies
            const frontTrackWheel = Bodies.circle(globalPos.x+150, globalPos.y+110 , 32 , {
                collisionFilter: { group: group },
                label: 'frontTrackWheel',
                render: {
                    sprite: {
                        texture: wheel,
                        xScale: scaleX,
                        yScale: scaleY,

                    }
                }
            });
            allWheels.push(frontTrackWheel);
            const backTrackWheel = Bodies.circle(globalPos.x-160, globalPos.y+110  , 32, {
                collisionFilter: { group: group },
                label: 'backTrackWheel',
                render: {
                    sprite: {
                        texture: wheel,
                        xScale: scaleX,
                        yScale: scaleY,

                    }
                }
            });
            allWheels.push(backTrackWheel);
            const topTrackWheel = Bodies.circle(globalPos.x-100, globalPos.y+35  , 39, {
                collisionFilter: { group: group },
                label: 'topTrackWheel',
                render: {
                    sprite: {
                        texture: gear,
                        xScale: scaleX,
                        yScale: scaleY,

                    }
                }
            });
            allWheels.push(topTrackWheel);

            let moveX = -118;
            for(let i = 0; i<8;i++){
                if(i === 2 || i ===4 || i === 6){
                    moveX += 27
                }else if(i!== 0 ){
                    moveX += 36
                }
                let smallWheel = Bodies.circle(globalPos.x + moveX, globalPos.y + 130, 12, {
                    collisionFilter: { group: group },
                    label: 'smallWheel',
                    render: {
                        sprite: {
                            xScale: scaleX,
                            yScale: scaleY,
                            texture: wheelSmall
                        }
                    }
                });
                allWheels.push(smallWheel)
            }

            const blade = Bodies.fromVertices(globalPos.x+320, globalPos.y+70, bulldozerJson.blade,
                {
                    collisionFilter: { group: group },
                    label: 'blade',
                    render: {
                        visible: false,
                        sprite: {
                            xScale: scaleX,
                            yScale: scaleY,
                            texture: imgBlade,
                            // xOffset: 0,
                            // yOffset: -0.12

                        }
                    }
                }
            );
            blade.render.visible = true;

            const pushFrame = Bodies.fromVertices(globalPos.x+130, globalPos.y+90, bulldozerJson.pushFrame,
                {
                    collisionFilter: { group: group, mask: 0x0001 },
                    label: 'pushFrame',
                    render: {
                        zIndex: 10,
                        visible: false,
                        sprite: {
                            texture: imgPushFrame,
                            xScale: scaleX,
                            yScale: scaleY,
                            // xOffset: 0,
                            // yOffset: -0.1

                        }
                    }
                }
            );
            pushFrame.render.visible = true;
            const cabP1 = Bodies.fromVertices(0, 0, bulldozerJson.cabP1,{render: {visible:false}});
            const cabP2 = Bodies.fromVertices(-220, +60, bulldozerJson.cabP2,{render: {visible:false}});
            const cabP3 = Bodies.fromVertices(-202, +2, bulldozerJson.cabP3,{render: {visible:false}});
            const cabP4 = Bodies.fromVertices(+195, -80, bulldozerJson.cabP4,{render: {visible:false}});
            cabP1.parts.shift();
            cabP4.parts.shift();
            const cab = Body.create({
                label: 'cab',
                mass: 40,
                parts: [...cabP1.parts,...cabP2.parts,...cabP3.parts,...cabP4.parts],
                collisionFilter: { group: group, mask: 0x0001 },
                render: {
                    sprite: {
                        xScale: scaleX,
                        yScale: scaleY,
                        texture: imgCab
                    }
                }
            });
            Body.setPosition(cab, { x: globalPos.x-8, y: globalPos.y });
            //cab.render.visible = true;

            const ripperTopP1 = Bodies.fromVertices(0, 0, bulldozerJson.ripperTop,{render: {visible:false}});
            const ripperTopP2 = Bodies.fromVertices(10, +90, bulldozerJson.ripperBottom,{render: {visible:false}});
            ripperTopP1.parts.shift();
            ripperTopP2.parts.shift();

            const ripperTop = Body.create({
                label: 'ripperTop',
                parts: [...ripperTopP1.parts, ...ripperTopP2.parts],
                collisionFilter: { group: group },
                render: {
                    sprite: {
                        xScale: scaleX,
                        yScale: scaleY,
                        texture: imgRipper
                    }
                }
            });
            //console.log('group',group)

            Body.setPosition(ripperTop,{x:globalPos.x-310,y:globalPos.y+44});
            //trackFrame.render.visible = true;

            const track = Bodies.rectangle(globalPos.x, globalPos.y+100, 20, 20, {
                label: "track",
                collisionFilter: { group: group },
                render: {
                    sprite: {
                        texture: imgTrack,
                        xScale: scaleX,
                        yScale: scaleY,
                        xOffset: 0,
                        yOffset: 0.2
                    }
                }
            });

            // stack
            let paramY = 0;
            let groupSecond = Body.nextGroup();
            const caterpillars = Composites.stack(globalPos.x-215, globalPos.y + 140, 45, 1, 0, 0, function (x, y, col) {
                let paramX = 0;
                if(col > 17 && col <=21){
                    paramX = -25;
                    paramY += -23;
                }else if(col > 21 && col <=36){
                    paramX = -50;
                    paramY -= 6;
                }else if(col > 34 ){
                    paramX = -35;
                    paramY +=23
                }

                return Bodies.rectangle(x + paramX , y + paramY, 25, 23, {
                    collisionFilter: { group: groupSecond, category: 0x0002, mask: 0x0001 },
                    isStatic: staticParam,
                    angle:0,
                    //density:0.005,
                    render: {
                        sprite: {
                            xScale: scaleX,
                            yScale: scaleY,
                            texture: imgTire
                        }
                    }
                });
            });
            Composites.chain(caterpillars, 0.40, 0, -0.40, 0, {
                stiffness: 1,
                length: 0,
                render: {
                    visible: false
                }
            });

            const chainConstraint =  Constraint.create({
                bodyA: caterpillars.bodies[caterpillars.bodies.length-1],
                //pointA: {x:0,y:0},
                bodyB: caterpillars.bodies[0],
                // pointB: {x:0,y:0},
                length: 0,
                render: {
                    visible: false
                }
            });

            for (let i =0;i<45;i++){
                if(i>16 && i<21){
                    Body.rotate(caterpillars.bodies[i],-1.6)
                }else if(i>=21 && i<37){
                    Body.rotate(caterpillars.bodies[i],-3.2)
                }else if(i>=37){
                    Body.rotate(caterpillars.bodies[i],1.6)
                }
            }

            // add constraints
            const CabWithTopTrackWheel = Constraint.create({
                "bodyA": cab,
                "bodyB": topTrackWheel,
                "pointA": {
                    "x": -92,
                    "y": 34
                },
                "length": 0,
                "label": "CabWithTopTrackWheel",
                "stiffness": 0.6,
                "damping": 0,
                "render": {
                    "visible": true,
                    "lineWidth": 2,
                    "strokeStyle": "#ffffff",
                    "type": "line",
                    "anchors": true
                }
            });

            const cabWithBackTrackWheel = Constraint.create({
                "bodyA": cab,
                "bodyB": backTrackWheel,
                "pointA": {
                    "x": -152,
                    "y": 110
                },
                "length": 0,
                "label": "cabWithBackTrackWheel",
                "stiffness": 0.6,
                "damping": 0,
                "render": {
                    "visible": true,
                    "lineWidth": 2,
                    "strokeStyle": "#ffffff",
                    "type": "line",
                    "anchors": true
                }
            });

            const cabWithFrontTrackWheel = Constraint.create({
                "bodyA": cab,
                "bodyB": frontTrackWheel,
                "pointA": {
                    "x": 158,
                    "y": 110
                },
                "length": 0,
                "label": "cabWithFrontTrackWheel",
                "stiffness": 0.6,
                "damping": 0,
                "render": {
                    "visible": true,
                    "lineWidth": 2,
                    "strokeStyle": "#ffffff",
                    "type": "line",
                    "anchors": true
                }
            });

            let moveConstrX = -110;
            const allWheelsConstr = [];
            for(let j = 0; j<8; j++){
                if(j === 2 || j ===4 || j === 6){
                    moveConstrX += 27
                }else if(j!== 0 ){
                    moveConstrX += 36
                }
                let smallWheelConstr = Constraint.create({
                    "bodyA": cab,
                    "bodyB": allWheels[3+j],
                    "pointA": {
                        "x": moveConstrX,
                        "y": 130
                    },
                    "length": 0,
                    "label": "smallWheelsConstr",
                    "stiffness": 0.6,
                    "damping": 0,
                    "render": {
                        "visible": true,
                        "lineWidth": 2,
                        "strokeStyle": "#ffffff",
                        "type": "line",
                        "anchors": true
                    }
                });
                allWheelsConstr.push(smallWheelConstr)
            }

            const fixedCabWithRipperTop = Constraint.create({
                "bodyA": cab,
                "bodyB": ripperTop,
                "pointA": {
                    "x": -265,
                    "y": 75
                },
                "pointB": {
                    "x": 37,
                    "y": 30
                },
                "length": 0,
                "label": "fixedCabWithRipperTop",
                "stiffness": 1,
                "damping": 0,
                "render": {
                    "visible": true,
                    "lineWidth": 2,
                    "strokeStyle": "#ffffff",
                    "type": "line",
                    "anchors": true
                }
            });

            const mobileCabWithRipperTop = Constraint.create({
                "bodyA": cab,
                "bodyB": ripperTop,
                "pointA": {
                    "x": -230,
                    "y": -10
                },
                "pointB": {
                    "x": 35,
                    "y": -65
                },
                "length": 30,
                "label": "mobileCabWithRipperTop",
                "stiffness": 0.3,
                "damping": 0,
                "render": {
                    "lineWidth": 2,
                    "strokeStyle": "#ffffff",
                    "type": "line",
                    "visible": true,
                    "anchors": true
                }
            });

            const fixedCabWithPushFrame = Constraint.create({
                "bodyA": cab,
                "bodyB": pushFrame,
                "pointA": {
                    "x": -72,
                    "y": 105
                },
                "pointB": {
                    "x": -210,
                    "y": 15
                },
                "length": 0,
                "label": "fixedCabWithPushFrame",
                "stiffness": 0.4,
                "damping": 0,
                "render": {
                    "lineWidth": 2,
                    "strokeStyle": "#ffffff",
                    "type": "line",
                    "visible": true,
                    "anchors": true
                }
            });

            const mobileCabWithPushFrame = Constraint.create({
                "bodyA": cab,
                "bodyB": pushFrame,
                "pointA": {
                    "x": 230,
                    "y": -10
                },
                "pointB": {
                    "x": 106,
                    "y": -60
                },
                "length": 20,
                "label": "mobileCabWithPushFrame",
                "stiffness": 0.1,
                "damping": 0,
                "render": {
                    "lineWidth": 2,
                    "strokeStyle": "#ffffff",
                    "type": "line",
                    "visible": true,
                    "anchors": true
                }
            });

            const fixedBladeWithPushFrame = Constraint.create({
                "bodyA": pushFrame,
                "bodyB": blade,
                "pointA": {
                    "x": 150,
                    "y": 20
                },
                "pointB": {
                    "x": -40,
                    "y": 40
                },
                "length": 0,
                "label": "fixedBladeWithPushFrame",
                "stiffness": 1,
                "damping": 0,
                "render": {
                    "lineWidth": 2,
                    "strokeStyle": "#ffffff",
                    "type": "line",
                    "visible": true,
                    "anchors": true
                }
            });

            const mobileBladeWithPushFrame = Constraint.create({
                "bodyA": pushFrame,
                "bodyB": blade,
                "pointA": {
                    "x": 110,
                    "y": -50
                },
                "pointB": {
                    "x": -46,
                    "y": -50
                },
                "length": 30,
                "label": "mobileBladeWithPushFrame",
                "stiffness": 1,
                "damping": 0,
                "render": {
                    "lineWidth": 2,
                    "strokeStyle": "#ffffff",
                    "type": "line",
                    "visible": true,
                    "anchors": true
                }
            });

            const frontTrackWithCab = Constraint.create({
                "bodyA": cab,
                "bodyB": track,
                "pointA": {
                    "x": 18,
                    "y": 100
                },
                "pointB": {
                    "x": +10,
                    "y": 0
                },
                "length": 0,
                "label": "frontTrackWithCab",
                "stiffness": 1,
                "damping": 0,
                "render": {
                    "lineWidth": 2,
                    "strokeStyle": "#ffffff",
                    "type": "line",
                    "visible": true,
                    "anchors": true
                }
            });
            const backTrackWithCab = Constraint.create({
                "bodyA": cab,
                "bodyB": track,
                "pointA": {
                    "x": -2,
                    "y": 100
                },
                "pointB": {
                    "x": -10,
                    "y": 0
                },
                "length": 0,
                "label": "backTrackWithCab",
                "stiffness": 1,
                "damping": 0,
                "render": {
                    "lineWidth": 2,
                    "strokeStyle": "#ffffff",
                    "type": "line",
                    "visible": true,
                    "anchors": true
                }
            });

            const ExcavatorComposite = Composite.create({ label: 'ExcavatorComposite' });

            Composite.add(ExcavatorComposite, [
                cab,
                ...allWheels,
                caterpillars,
                ripperTop,
                track,
                pushFrame,
                blade
            ]);
            Body.setStatic(ripperTop, staticParam);
            Body.setStatic(cab, staticParam);
            Body.setStatic(pushFrame, staticParam);
            Body.setStatic(blade, staticParam);
            allWheels.forEach(obj=> {
                Body.setStatic(obj,staticParam)
            });
            Body.setStatic(backTrackWheel, staticParam);
            Body.setStatic(frontTrackWheel, staticParam);
            Body.setStatic(track, staticParam);

            Composite.add(ExcavatorComposite, [
                CabWithTopTrackWheel,
                cabWithBackTrackWheel,
                cabWithFrontTrackWheel,
                ...allWheelsConstr,
                chainConstraint,
                fixedCabWithRipperTop,
                mobileCabWithRipperTop,
                fixedCabWithPushFrame,
                mobileCabWithPushFrame,
                fixedBladeWithPushFrame,
                mobileBladeWithPushFrame,
                frontTrackWithCab,
                backTrackWithCab,
            ]);

            const position =  Composite.bounds(ExcavatorComposite);
            const positionX = (position.max.x+position.min.x)/2;
            const positionY = (position.max.y+position.min.y)/2;

            Composite.scale(ExcavatorComposite, scaleX, scaleY, { x: positionX + x,y: positionY + y });

            /*Events.on(engine, 'beforeUpdate', function(event) {
                if(keys[39]){
                    Body.setAngularVelocity(frontTrackWheel, 0.1);
                    Body.setAngularVelocity(backTrackWheel, 0.1);
                } else if(keys[37]){
                    Body.setAngularVelocity(frontTrackWheel, -0.1);
                    Body.setAngularVelocity(backTrackWheel, -0.1);
                }else if(keys[38]){
                    mobileCabWithBoom.length +=0.2
                }else if(keys[40]){
                    mobileCabWithBoom.length -=0.2
                }else if(keys[65]){
                    mobileBoomWithArm.length +=0.2
                }else if(keys[68]){
                    mobileBoomWithArm.length -=0.2
                }else if(keys[87]){
                    mobileArmWithArmConnector.length -=0.2
                }else if(keys[83]){
                    mobileArmWithArmConnector.length +=0.2
                }
            });*/


            return ExcavatorComposite;
        };
        World.add(world, carExcavator(0,0, 1, 1, false));

        // add mouse control
        const mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        World.add(world, mouseConstraint);

        // keep the mouse in sync with rendering
        render.mouse = mouse;
        const { width, height } = render.options;

        World.add(world, [
            // walls
            Bodies.rectangle(width / 2, 0, width , 50, { isStatic: true, label: 'Top wall' }),
            Bodies.rectangle(width / 2, height, width , 50, { isStatic: true, label: 'Bottom wall'  }),
            Bodies.rectangle(width , height / 2, 50, height, { isStatic: true, label: 'Right wall' }),
            Bodies.rectangle(0, height / 2, 50, height, { isStatic: true, label: 'Left wall' }),
        ]);
        /******* Body ******/
        // eslint-disable-next-line
    },[restart]);
    return (
        <div ref={sceneEl} />
    )
}
export default Bulldozer
