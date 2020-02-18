import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';

import wheel from './images/excavator/wheel.png';
import imgTrackFrame from './images/excavator/trackFrame.png';
import imgCab from './images/excavator/cab.png';
import imgBoom from './images/excavator/boom.png';
import imgArm from './images/excavator/arm.png';
import imgBucket from './images/excavator/bucket.png';
import imgArmConnector from './images/excavator/armConnector.png';
import imgBucketConnector from './images/excavator/bucketConnector.png';

import IndexPosition from '../mattetPlugins/IndexPosition';
import ConstraintInspector from '../mattetPlugins/ConstraintInspector';
import ConstraintScale from '../mattetPlugins/ConstraintScale';
import RenderBodies from '../mattetPlugins/RenderBodies';
import decomp from 'poly-decomp';

import excavatorJson from './json/excavator'
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

const keyboard = [
    { name:"Right", description: "Wheels move right" },
    { name:"Left", description: "Wheels move Left" },
    { name:"Up", description: "Boom move up" },
    { name:"Down", description: "Boom move down" },
    { name:"D", description: "Arm move up" },
    { name:"A", description: "Arm move down" },
    { name:"W", description: "Bucket move up" },
    { name:"S", description: "Bucket move Down" },
];

function Excavator(props){

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
        height: 630,
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
      keyboard
    };
    runInspector(inspector);
    /******* connect inspector ******/

    /********** key events **********/
    const keys = [];
      document.body.addEventListener("keydown", function(e) {
          keys[e.code] = true;
          const drivingMode = localStorage.getItem('drivingMode') === 'true';
          if(drivingMode){
              e.preventDefault();
          }
          //e.preventDefault();
          //console.log(e)

      });
      document.body.addEventListener("keyup", function(e) {
          keys[e.code] = false;
          const drivingMode = localStorage.getItem('drivingMode') === 'true';
          if(drivingMode){
              e.preventDefault();
          }
      });
    /********** key events **********/

    /******* Body ******/

    const carExcavator = (x= 0, y = 0, scaleX = 1, scaleY = 1, staticParam = false) => {
        const group = Body.nextGroup(true);
        // add bodies
        const frontTrackWheel = Bodies.circle(830 , 495 , 55 , {
            collisionFilter: { group: group },
            label: 'frontTrackWheel',
            friction:1,
            render: {
                sprite: {
                    texture: wheel,
                    xScale: 1,
                    yScale: 1,

                }
            }
          });

        const backTrackWheel = Bodies.circle(1170 , 495 , 55, {
            collisionFilter: { group: group },
            label: 'backTrackWheel',
            friction:1,
            render: {
                sprite: {
                    texture: wheel,
                    xScale: 1,
                    yScale: 1,

                }
            }
        });

        const bucket = Bodies.fromVertices(210, 410, excavatorJson.bucket,
            {
                collisionFilter: { group: group },
                label: 'bucket',
                render: {
                    visible: false,
                    sprite: {
                        texture: imgBucket,
                        xScale: 1,
                        yScale: 1,
                        xOffset: 0,
                        yOffset: 0

                    }
                }
            }
          );
        bucket.render.visible = true;
        const arm = Bodies.fromVertices(400, 340, excavatorJson.arm,
            {
                collisionFilter: { group: group },
                label: 'arm',
                render: {
                    visible: false,
                    sprite: {
                        texture: imgArm,
                        xScale: 1,
                        yScale: 1,
                        xOffset: 0,
                        yOffset: -0.12

                    }
                }
            }
          );
        arm.render.visible = true;

        const boom = Bodies.fromVertices(770, 270, excavatorJson.boom,
            {
                collisionFilter: { group: group },
                label: 'boom',
                render: {
                    zIndex:1,
                    visible: false,
                    sprite: {
                        texture: imgBoom,
                        xScale: 1,
                        yScale: 1,
                        xOffset: 0,
                        yOffset: -0.1

                    }
                }
            }
          );
        boom.render.visible = true;
        const cab = Bodies.fromVertices(1050, 296, excavatorJson.cab,
            {
                collisionFilter: { group: group }, label: 'cab', mass: 150,
                render: {
                    visible: false,
                    zIndex: 2,
                    sprite: {
                        texture: imgCab,
                        xScale: 1,
                        yScale: 1,
                        xOffset: 0,
                        yOffset: 0

                    }
                }
            },
          );
        cab.render.visible = true;
        const trackFrame = Bodies.fromVertices(1000, 455, excavatorJson.trackFrame,
            {
                collisionFilter: { group: group }, label: 'trackFrame' ,
                render: {
                    visible: false,
                    sprite: {
                        texture: imgTrackFrame,
                        xScale: 1,
                        yScale: 1,
                        xOffset: -0.06,
                        yOffset: -0.05
                    }
                }
            }, false, true
        );
        trackFrame.render.visible = true;

        const armConnector = Bodies.rectangle(200, 320, 72, 18, {
            label: "armConnector",
            collisionFilter: { group: group },
            render: {
                sprite: {
                    texture: imgArmConnector,
                    xScale: 1,
                    yScale: 1,
                    xOffset: 0,
                    yOffset: 0
                }
            }
          });

        const bucketConnector = Bodies.rectangle(170, 350, 18, 72, {
            label: "bucketConnector",
            collisionFilter: { group: group },
            render: {
                sprite: {
                    texture: imgBucketConnector,
                    xScale: 1,
                    yScale: 1,
                    xOffset: 0,
                    yOffset: 0
                }
            }
          });
        // add constraints
        const frontCabWithTrack = Constraint.create({
              "bodyA": cab,
              "bodyB": trackFrame,
              "pointA": {
                "x": -70,
                "y": 107
              },
              "pointB": {
                "x": -20,
                "y": -52
              },
              "length": 0,
              "label": "frontCabWithTrack",
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

        const backCabWithTrack = Constraint.create({
              "bodyA": cab,
              "bodyB": trackFrame,
              "pointA": {
                "x": 50,
                "y": 107
              },
              "pointB": {
                "x": 100,
                "y": -52
              },
              "length": 0,
              "label": "backCabWithTrack",
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

        const fixedCabWithBoom = Constraint.create({
              "bodyA": cab,
              "bodyB": boom,
              "pointA": {
                "x": -40,
                "y": 45
              },
              "pointB": {
                "x": 240,
                "y": 70
              },
              "length": 0,
              "label": "fixedCabWithBoom",
              "stiffness": 0.3,
              "damping": 0,
              "render": {
                "visible": true,
                "lineWidth": 2,
                "strokeStyle": "#ffffff",
                "type": "line",
                "anchors": true
              }
            });

        const mobileCabWithBoom = Constraint.create({
              "bodyA": cab,
              "bodyB": boom,
              "pointA": {
                "x": -130,
                "y": 45
              },
              "pointB": {
                "x": 38,
                "y": -52
              },
              "length": 180,
              "label": "mobileCabWithBoom",
              "stiffness": 0.1,
              "damping": 0,
              "render": {
                "visible": true,
                "lineWidth": 2,
                "strokeStyle": "#ffffff",
                "type": "line",
                "anchors": true
              }
            });

        const fixedBoomWithArm = Constraint.create({
              "bodyA": boom,
              "bodyB": arm,
              "pointA": {
                  "x": -290,
                  "y": 80
              },
              "pointB": {
                  "x": 80,
                  "y": 10
              },
              "length": 0,
              "label": "fixedBoomWithArm",
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

        const mobileBoomWithArm = Constraint.create({
              "bodyA": boom,
              "bodyB": arm,
              "pointA": {
                  "x": -40,
                  "y": -65
              },
              "pointB": {
                  "x": 160,
                  "y": -8
              },
              "length": 210,
              "label": "mobileBoomWithArm",
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

        const fixedArmWithBucket = Constraint.create({
              "bodyA": arm,
              "bodyB": bucket,
              "pointA": {
                  "x": -185,
                  "y": 10
              },
              "pointB": {
                  "x": 5,
                  "y": -60
              },
              "length": 0,
              "label": "fixedArmWithBucket",
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

        const trackFrameWithFrontTrackWheel = Constraint.create({
              "bodyA": trackFrame,
              "bodyB": frontTrackWheel,
              "pointA": {
                  "x": -170,
                  "y": 40
              },
              "length": 0,
              "label": "frontTrackWheel",
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

        const trackFrameWithBackTrackWheel = Constraint.create({
              "bodyA": trackFrame,
              "bodyB": backTrackWheel,
              "pointA": {
                  "x": 170,
                  "y": 40
              },
              "length": 0,
              "label": "trackFrameWithBackTrackWheel",
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

        const bucketWithBucketConnector = Constraint.create({
              "bodyA": bucket,
              "bodyB": bucketConnector,
              "pointA": {
                  "x": -40,
                  "y": -30
              },
              "pointB": {
                  "x": 0,
                  "y": 30
              },
              "length": 0,
              "label": "bucketWithBucketConnector",
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

        const armConnectorWithBucketConnector = Constraint.create({
              "bodyA": armConnector,
              "bodyB": bucketConnector,
              "pointA": {
                  "x": -30,
                  "y": 0
              },
              "pointB": {
                  "x": 0,
                  "y": -30
              },
              "length": 0,
              "label": "armConnectorWithBucketConnector",
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

        const armWithArmConnector = Constraint.create({
          "bodyA": arm,
          "bodyB": armConnector,
          "stiffness": 0.4,
          "damping": 0,
          "label": "armWithArmConnector",
          "pointA": {
              "x": -150,
              "y": 10
          },
          "pointB": {
              "x": 30,
              "y": 0
          },
          "length": 0,
          "render": {
              "lineWidth": 2,
              "strokeStyle": "#ffffff",
              "type": "line",
              "visible": true,
              "anchors": true
          }
        });

        const mobileArmWithArmConnector = Constraint.create({
              "bodyA": arm,
              "bodyB": armConnector,
              "pointA": {
                  "x": 50,
                  "y": -46
              },
              "pointB": {
                  "x": -30,
                  "y": 0
              },
              "length": 240,
              "label": "mobileArmWithArmConnector",
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

        const ExcavatorComposite = Composite.create({ label: 'ExcavatorComposite' });

        Composite.add(ExcavatorComposite, [
            boom,
            trackFrame,
            arm,
            cab,
            bucket,
            frontTrackWheel,
            backTrackWheel,
            armConnector,
            bucketConnector,
        ]);
        Body.setStatic(trackFrame, staticParam);
        Body.setStatic(cab, staticParam);
        Body.setStatic(boom, staticParam);
        Body.setStatic(arm, staticParam);
        Body.setStatic(bucket, staticParam);
        Body.setStatic(armConnector, staticParam);
        Body.setStatic(bucketConnector, staticParam);
        Body.setStatic(backTrackWheel, staticParam);
        Body.setStatic(frontTrackWheel, staticParam);
        Composite.add(ExcavatorComposite, [
            frontCabWithTrack,
            backCabWithTrack,
            fixedCabWithBoom,
            mobileCabWithBoom,
            fixedBoomWithArm,
            mobileBoomWithArm,
            fixedArmWithBucket,
            trackFrameWithFrontTrackWheel,
            trackFrameWithBackTrackWheel,
            bucketWithBucketConnector,
            armConnectorWithBucketConnector,
            armWithArmConnector,
            mobileArmWithArmConnector
        ]);

        const position =  Composite.bounds(ExcavatorComposite);
        const positionX = (position.max.x+position.min.x)/2;
        const positionY = (position.max.y+position.min.y)/2;

        Composite.scale(ExcavatorComposite, scaleX, scaleY, { x: positionX + x,y: positionY + y });

        Events.on(engine, 'beforeUpdate', function(event) {
            if(keys['ArrowRight']){
                Body.setAngularVelocity(frontTrackWheel, 0.1);
                Body.setAngularVelocity(backTrackWheel, 0.1);
            } else if(keys['ArrowLeft']){
                Body.setAngularVelocity(frontTrackWheel, -0.1);
                Body.setAngularVelocity(backTrackWheel, -0.1);
            }
            if(keys['ArrowUp']){
                mobileCabWithBoom.length += mobileCabWithBoom.length  < 250 * scaleX ? 0.2 : 0
            }else if(keys['ArrowDown']){
                mobileCabWithBoom.length -= mobileCabWithBoom.length  > 140 * scaleX ? 0.2 : 0
            }
            if(keys['KeyA']){
                mobileBoomWithArm.length +=mobileCabWithBoom.length < 370 * scaleX ? 0.2 : 0
            }else if(keys['KeyD']){
                mobileBoomWithArm.length -= mobileBoomWithArm.length > 200 * scaleX ? 0.2 : 0
            }
            if(keys['KeyW']){
                mobileArmWithArmConnector.length -= mobileArmWithArmConnector.length > 170 * scaleX ? 0.2 : 0
            }else if(keys['KeyS']){
                mobileArmWithArmConnector.length +=mobileArmWithArmConnector.length < 265 * scaleX ? 0.2 : 0
            }

            //allWheel
        });


        return ExcavatorComposite;
    };
    World.add(world, carExcavator(400,200, 0.8, 0.8, false))

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
export default Excavator
