import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useStoreState } from 'easy-peasy';

import wheel from  './images/wheel.png';
import imgTrackFrame from  './images/trackFrame.png';
import imgCab from  './images/cab.png';
import imgBoom from  './images/boom.png';
import imgArm from  './images/arm.png';
import imgBucket from  './images/bucket.png';
import imgArmConnector from  './images/armConnector.png';
import imgBucketConnector from  './images/bucketConnector.png';

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
    Vertices = Matter.Vertices,
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

    /******* Body ******/

    const carExcavator = (x= 0, y = 0, scaleX = 1, scaleY = 1, staticParam = false) => {
        const group = Body.nextGroup(true);
        // add bodies
        const frontTrackWheel = Bodies.circle(830 , 495 , 55 , {
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

        const backTrackWheel = Bodies.circle(1170 , 495 , 55, {
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

        const bucket = Bodies.fromVertices(210, 410,
          [{"x":145.401,"y":113.73},{"x":141.901,"y":109.73},{"x":86.4014,"y":109.73},{"x":57.337867736816406,"y":112.21636962890625},{"x":28.15367317199707,"y":106.80421447753906},{"x":10.4014,"y":87.7296},{"x":9.440763473510742,"y":84.31266021728516},{"x":8.805326461791992,"y":54.72804260253906},{"x":10.4014,"y":49.2296},{"x":42.4014,"y":15.7296},{"x":59.9014,"y":26.7296},{"x":59.9014,"y":13.2296},{"x":59.11518096923828,"y":9.537083625793457},{"x":47.4014,"y":1.22961},{"x":33.4014,"y":13.2296},{"x":3.90137,"y":45.7296},{"x":1.7057740688323975,"y":56.718650817871094},{"x":2.808957815170288,"y":86.5831069946289},{"x":3.90137,"y":93.2296},{"x":19.8577938079834,"y":109.93138122558594},{"x":48.29899978637695,"y":118.3912582397461},{"x":78.26766967773438,"y":117.91423797607422},{"x":86.4014,"y":117.23}],
            {
                collisionFilter: { group: group },
                label: 'bucket',
                render: {
                    visible: false,
                    sprite: {
                        texture: imgBucket,
                        xScale: scaleX,
                        yScale: scaleY,
                        xOffset: 0,
                        yOffset: 0

                    }
                }
            }
          );
        bucket.render.visible = true;
        const arm = Bodies.fromVertices(400, 340,
            [{"x":291.861,"y":176.918},{"x":320.1265563964844,"y":166.8767547607422},{"x":347.033935546875,"y":153.726806640625},{"x":365.95806884765625,"y":131.1698760986328},{"x":366.897,"y":128.308},{"x":321.398,"y":108.014},{"x":314.3341979980469,"y":109.23065185546875},{"x":284.7644348144531,"y":114.29309844970703},{"x":255.181396484375,"y":119.27729034423828},{"x":225.5789794921875,"y":124.14510345458984},{"x":195.9502716064453,"y":128.85008239746094},{"x":166.2883758544922,"y":133.3407440185547},{"x":136.58779907226562,"y":137.5679168701172},{"x":106.8467788696289,"y":141.50042724609375},{"x":77.06756591796875,"y":145.1322021484375},{"x":47.255126953125,"y":148.4805450439453},{"x":17.416263580322266,"y":151.58497619628906},{"x":9.68812,"y":152.355},{"x":10.022541046142578,"y":172.8530731201172},{"x":12.7427,"y":175.565},{"x":38.897315979003906,"y":175.93002319335938},{"x":68.89444732666016,"y":176.34405517578125},{"x":98.89191436767578,"y":176.73422241210938},{"x":128.8899383544922,"y":177.08013916015625},{"x":158.88876342773438,"y":177.3464813232422},{"x":188.88827514648438,"y":177.50344848632812},{"x":218.88821411132812,"y":177.5198516845703},{"x":248.8878936767578,"y":177.3829803466797},{"x":278.8864440917969,"y":177.090087890625}],
            {
                collisionFilter: { group: group },
                label: 'arm',
                render: {
                    visible: false,
                    sprite: {
                        texture: imgArm,
                        xScale: scaleX,
                        yScale: scaleY,
                        xOffset: 0,
                        yOffset: -0.12

                    }
                }
            }
          );
        arm.render.visible = true;

        const boom = Bodies.fromVertices(770, 270,
            [{"x":548.378,"y":250.423},{"x":602.497,"y":235.016},{"x":479.728,"y":133.443},{"x":459.1336669921875,"y":120.376220703125},{"x":433.2840576171875,"y":105.15704345703125},{"x":406.4797668457031,"y":91.7061538696289},{"x":378.2815246582031,"y":81.55069732666016},{"x":348.7523498535156,"y":76.53612518310547},{"x":318.790771484375,"y":77.05146026611328},{"x":316.795,"y":77.2481},{"x":242.235,"y":113.067},{"x":48.9048,"y":204.806},{"x":12.0966,"y":230.053},{"x":19.4266,"y":248.661},{"x":62.6486,"y":239.697},{"x":265.507,"y":172.149},{"x":273.53009033203125,"y":168.78526306152344},{"x":301.72479248046875,"y":158.5641326904297},{"x":330.8856506347656,"y":151.6263427734375},{"x":360.77313232421875,"y":149.57545471191406},{"x":390.5440979003906,"y":152.96275329589844},{"x":419.510498046875,"y":160.69801330566406},{"x":447.6008605957031,"y":171.2105255126953},{"x":461.485,"y":177.172}],
            {
                collisionFilter: { group: group },
                label: 'boom',
                render: {
                    zIndex:1,
                    visible: false,
                    sprite: {
                        texture: imgBoom,
                        xScale: scaleX,
                        yScale: scaleY,
                        xOffset: 0,
                        yOffset: -0.1

                    }
                }
            }
          );
        boom.render.visible = true;
        const cab = Bodies.fromVertices(1050, 296,
            [{"x":179.001,"y":1},{"x":34.0012,"y":1},{"x":32.13400650024414,"y":5.638482570648193},{"x":21.496036529541016,"y":33.68703842163086},{"x":12.254393577575684,"y":62.22311782836914},{"x":5.25225305557251,"y":91.38286590576172},{"x":1.6136342287063599,"y":121.13919067382812},{"x":2.2957255840301514,"y":151.10264587402344},{"x":7.29631233215332,"y":180.6604766845703},{"x":13.5,"y":203},{"x":367.001,"y":203},{"x":367.001,"y":120.5},{"x":355.501,"y":90},{"x":200.001,"y":90},{"x":198.9602813720703,"y":77.33055114746094},{"x":194.6600341796875,"y":47.65625},{"x":186.26873779296875,"y":18.883512496948242}],
            {
                collisionFilter: { group: group }, label: 'cab', mass: 150,
                render: {
                    visible: false,
                    zIndex: 2,
                    sprite: {
                        texture: imgCab,
                        xScale: scaleX,
                        yScale: scaleY,
                        xOffset: 0,
                        yOffset: 0

                    }
                }
            },
          );
        cab.render.visible = true;
        const trackFrame = Bodies.fromVertices(1000, 455,
            [{"x":1,"y":60},{"x":1,"y":75.5},{"x":40,"y":75.5},{"x":40,"y":91.5},{"x":419.5,"y":91.5},{"x":419.5,"y":30},{"x":330,"y":30},{"x":330,"y":1},{"x":195,"y":1},{"x":195,"y":30},{"x":31,"y":30},{"x":30.514633178710938,"y":31.94019889831543},{"x":13.659062385559082,"y":55.45679473876953}],
            {
                collisionFilter: { group: group }, label: 'trackFrame' ,
                render: {
                    visible: false,
                    sprite: {
                        texture: imgTrackFrame,
                        xScale: scaleX,
                        yScale: scaleY,
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
                    xScale: scaleX,
                    yScale: scaleY,
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
                    xScale: scaleX,
                    yScale: scaleY,
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
          "stiffness": 0.1,
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

        Composite.scale(ExcavatorComposite, scaleX, scaleY, { x: positionX + x,y: positionY + y })


        return ExcavatorComposite;
    };
    World.add(world, carExcavator(400,200, 0.8, 0.8, false))

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
export default Excavator
