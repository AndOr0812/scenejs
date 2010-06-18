/**
 * SceneJS Example - Procedural generation of a spiral staircase
 *
 * Lindsay Kay
 * lindsay.kay AT xeolabs.com
 * January 2010
 *
 * This spiral staircase is generated by rotating and translating a flattened
 * cube in a loop. The loop, with varying rotation and translation parameters
 * in each iteration, is effected by a generator node.
 *
 * A generator node's job is to generate a dynamic scope obect containing data for
 * sub-nodes. See how its first parameter is a function to generate that scope
 * object. During a scene traversal, SceneJS will loop at that node. In each loop,
 * SceneJS calls the function, sets the scope and traverses the subtree, stopping
 * its loop as soon as the function result is undefined. Our generator causes several
 * loops, where in each loop it sets a scope containing different parameters for
 * the translation and rotation in its subgraph. It then stops the loop by not
 * returning anything.
 */

var exampleScene = SceneJS.scene({

    /* Bind scene to a WebGL canvas:
     */
    canvasId: "theCanvas",

    /* You can optionally write logging to a DIV - scene will log to the console as well.
     */
    loggingElementId: "theLoggingDiv" },

        SceneJS.lookAt({
            eye : { x: 0.0, y: 30.0, z: -20.0},
            look : { x : 0.0, y : 15.0, z : 0 },
            up : { x: 0.0, y: 1.0, z: 0.0 }
        },

            /* Perspective camera
             */
                SceneJS.camera({
                    optics: {
                        type: "perspective",
                        fovy : 65.0,
                        aspect : 1.0,
                        near : 0.10,
                        far : 300.0  }
                },
                        SceneJS.lights({
                            sources: [
                                {
                                    type:                   "dir",
                                    color:                  { r: 1.0, g: 1.0, b: 1.0 },
                                    diffuse:                true,
                                    specular:               true,
                                    dir:                    { x: 1.0, y: 1.0, z: -1.0 }
                                },
                                {
                                    type:                   "dir",
                                    color:                  { r: 0.8, g: 0.8, b: 0.8 },
                                    diffuse:                true,
                                    specular:               true,
                                    dir:                    { x: 2.0, y: 1.0, z: 0.0 }
                                }
                            ]},

                                SceneJS.material({
                                    baseColor:      { r: 0.3, g: 0.3, b: 0.9 },
                                    specularColor:  { r: 0.9, g: 0.9, b: 0.9 },
                                    specular:       0.9,
                                    shine:          6.0
                                },

                                        SceneJS.rotate(function(data) {
                                            return {
                                                angle: data.get('pitch'), x : 1.0
                                            };
                                        },

                                                SceneJS.rotate(function(data) {
                                                    return {
                                                        angle: data.get('yaw'), y : 1.0
                                                    };
                                                },

                                                    /**
                                                     * Generate a sequence of Y-axis rotations
                                                     */
                                                        SceneJS.generator((function() {
                                                            var angle = 0;
                                                            var height = -10;
                                                            return function() {
                                                                angle += 15.0;
                                                                height += 1.0;
                                                                if (angle <= 560.0) {
                                                                    return { angle: angle, height: height };

                                                                } else {  // Reset the generator
                                                                    angle = 0;
                                                                    height = -10;
                                                                }
                                                            };
                                                        })(),
                                                                SceneJS.rotate(function(data) {
                                                                    return { angle : data.get("angle"), y: 1.0 };
                                                                },
                                                                        SceneJS.translate(function(data) {
                                                                            return { x: 5.0, y : data.get("height") };
                                                                        },
                                                                            /** Slab for step
                                                                             */
                                                                                SceneJS.scale({x: 3.0, y: 0.2, z: 1.0},
                                                                                        SceneJS.objects.cube()
                                                                                        )
                                                                                ) // rotate
                                                                        ) // translate
                                                                ) // generator
                                                        ) // rotate yaw
                                                ) // rotate pitch
                                        ) // material
                                ) // lookAt
                        ) // frustum
                ) // lights                      
        ); // scene

var yaw = 0;
var pitch = 0;
var lastX;
var lastY;
var dragging = false;

/* Throw the switch, Igor!
 * We render the scene, injecting the initial angles for the rotate nodes.
 */
exampleScene.render({yaw: yaw, pitch: pitch});

var canvas = document.getElementById(exampleScene.getCanvasId());

function mouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
}

function mouseUp() {
    dragging = false;
}

/* On a mouse drag, we'll re-render the scene, passing in
 * incremented angles in each time.
 */
function mouseMove(event) {
    if (dragging) {
        yaw += (event.clientX - lastX) * 0.5;
        pitch += (event.clientY - lastY) * -0.5;
        exampleScene.render({yaw: yaw, pitch: pitch});
        lastX = event.clientX;
        lastY = event.clientY;
    }
}

canvas.addEventListener('mousedown', mouseDown, true);
canvas.addEventListener('mousemove', mouseMove, true);
canvas.addEventListener('mouseup', mouseUp, true);



