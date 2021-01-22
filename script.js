import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import { TrackballControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/TrackballControls.js';
import { OBJLoader2 } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/OBJLoader2.js';
import { MTLLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
import { MtlObjBridge } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';
import { RGBELoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/RGBELoader.js';
import { Water } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/objects/Water2.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/libs/dat.gui.module.js';

function main() {
  const params = {
    color: '#ffffff',
    scale: 4,
    flowX: 1,
    flowY: 1
  };


  let water;
  var x = -30;


  //To control the ship movement speed
  var controls1 = new function () {
    this.rotationSpeed = 0.02;

  };

  //If we want to load without delay

  //loadIsland();
  //loadBoat();
  //loadCity();

  //The canvas that we will render on
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });

  // listen to the resize event
  window.addEventListener('resize', onResize, false);


  var camera;


  // create a scene, that will hold all our elements
  const scene = new THREE.Scene();


  document.addEventListener('keydown', function (event) {
    if (event.key == "Left") {
      console.log('Left was pressed');
    }
    else if (event.key == "Right") {
      alert('Right was pressed');
    }
  });

  //Background Image 
  const loader2 = new THREE.TextureLoader();
  loader2.load('bc.jpg', function (texture) {
    scene.background = texture;
  });


  //load city and island early because they take time           
  loadCity();
  loadIsland();

  window.setTimeout(function () {
    loadBoat();
    //loadCity();
    //loadIsland();
    loadShark();
    loadFemale();
    scene.add(water);
    scene.add(skyBox);
    scene.add(Wbox);
    scene.add(boxClone1);
    scene.add(boxClone2);
  }, 21000);


  //enable shadowmap
  renderer.shadowMap.enabled = true;



  // create a camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  //set camera position
  camera.position.x = -30;
  camera.position.y = 5;
  camera.position.z = 170;  //was 120
  camera.lookAt(scene.position);

  //add the intro music

  var audioListener = new THREE.AudioListener();
  camera.add(audioListener);
  var sound = new THREE.Audio(audioListener);
  var audioLoader = new THREE.AudioLoader();
  audioLoader.load('sounds/intro.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(1.5);
    sound.play();
  });




  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);




  var light = new THREE.DirectionalLight(0x404040, 0.8);
  scene.add(light);
  var ambient_light = new THREE.AmbientLight(0x404080, 1);
  scene.add(ambient_light);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 0);
  spotLight.castShadow = true;
  scene.add(spotLight);


  // Water
  {
    var waterGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10);

    water = new Water(
      waterGeometry,
      {
        textureWidth: 4096,
        textureHeight: 2160,
        waterNormals: new THREE.TextureLoader().load("textures/water/waternormals.jpg", function (texture) {

          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        }),
        alpha: 0,
        sunDirection: light.position.clone().normalize(),
        sunColor: 0xffff00,
        waterColor: 0x27B9FF,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
      }
    );
    water.material.uniforms['config'].value.w = 10;
    water.rotation.x = - Math.PI / 2;

    // scene.add( water );  moved above to be delayed
  }


  const gui = new GUI();

  gui.addColor(params, 'color').onChange(function (value) {

    water.material.uniforms['color'].value.set(value);

  });
  gui.add(params, 'scale', 1, 10).onChange(function (value) {

    water.material.uniforms['config'].value.w = value;

  });
  gui.add(params, 'flowX', - 1, 1).step(0.01).onChange(function (value) {

    water.material.uniforms['flowDirection'].value.x = value;
    water.material.uniforms['flowDirection'].value.normalize();

  });
  gui.add(params, 'flowY', - 1, 1).step(0.01).onChange(function (value) {

    water.material.uniforms['flowDirection'].value.y = value;
    water.material.uniforms['flowDirection'].value.normalize();

  });
  gui.add(controls1, 'rotationSpeed', 0, 0.5);
  gui.open();


  function loadShark() {

    {
      new RGBELoader()
        .setDataType(THREE.UnsignedByteType)
        .setPath('textures/equirectangular/')
        .load('pedestrian_overpass_2k.hdr', function (texture) {

          var options = {
            minFilter: texture.minFilter,
            magFilter: texture.magFilter
          };
          var loader = new GLTFLoader().setPath('shark/');
          loader.load('shark.gltf', function (gltf) {

            gltf.scene.traverse(function (child) {


            });


            gltf.scene.scale.set(2, 2, 2);
            gltf.scene.position.z = 40;
            gltf.scene.position.y = 0.5;
            gltf.scene.position.x = -60;

            requestAnimationFrame(moveShark.bind(moveShark, gltf.scene));
            // shark = gltf.scene;
            //shark.rotation.y = 80;

            //  window.setTimeout(function(){
            scene.add(gltf.scene);

            // },19000);


          });
        });

    }
  }



  function loadBoat() {

    {
      const mtlLoader = new MTLLoader();
      mtlLoader.load('models/ship/Cruiser_2012.mtl', (mtlParseResult) => {
        const objLoader = new OBJLoader2();
        const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
        objLoader.addMaterials(materials);
        objLoader.load('models/ship/Cruiser 2012.obj', (root) => {


          root.scale.set(0.01, 0.01, 0.01);
          root.position.set(-15, 0, 150);


          root.position.x -= controls1.rotationSpeed;
          // root.position.y += controls1.rotationSpeed;
          //root.position.z += controls1.rotationSpeed;



          requestAnimationFrame(moveship.bind(moveship, root));
          // window.setTimeout(function(){
          scene.add(root);
          //},21000);
        });
      });
    }
  }
  function loadFemale() {
    {
      const mtlLoader = new MTLLoader();
      mtlLoader.load('female/female02.mtl', (mtlParseResult) => {
        const objLoader = new OBJLoader2();
        const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
        objLoader.addMaterials(materials);
        objLoader.load('female/female02.obj', (root) => {
          root.scale.set(0.01, 0.01, 0.01);
          //  root.rotation.z=Math.PI *- .25;
          root.rotation.y = Math.PI * - .5;
          root.position.set(-15, 0, 150);
          //  window.setTimeout(function(){
          scene.add(root);
          //  },21000);
        });
      });
    }


  }


  function loadCity() {

    {
      const mtlLoader = new MTLLoader();
      mtlLoader.load('models/city/city.mtl', (mtlParseResult) => {
        const objLoader = new OBJLoader2();
        const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
        objLoader.addMaterials(materials);
        objLoader.load('models/city/city.obj', (root) => {
          root.scale.set(0.005, 0.005, 0.005);
          root.position.set(-10, 0, 150);
          window.setTimeout(function () {
            scene.add(root);
          }, 14500);
        });
      });
    }


  }

  

  function loadIsland() {
    {
      const mtlLoader2 = new MTLLoader();
      mtlLoader2.load('models/Small Tropical Island/Small_Tropical_Island.mtl', (mtlParseResult) => {
        const objLoader = new OBJLoader2();
        const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
        objLoader.addMaterials(materials);
        objLoader.load('models/Small Tropical Island/untitled.obj', (mesh) => {


          mesh.position.set(-20, 0, 80);
          //mesh.scale.set(1.2,0.4,1.2);
          mesh.receiveShadow = true;

          mesh.scale.set(0.1, 0.1, 0.1);

          window.setTimeout(function () {
            scene.add(mesh);
          }, 14000);

        });
      });
    }
  }


  //the morning skybox
  var cubeGeometry = new THREE.CubeGeometry(1200, 1000, 1200);
  var cubeMaterial = [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/textures/px.JPG"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/textures/nx.JPG"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/textures/py.JPG"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/textures/ny.JPG"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/textures/pz.JPG"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/textures/nz.JPG"), side: THREE.DoubleSide })
    // new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("sky/sea_ft.JPG"),side: THREE.DoubleSide}),
    //new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load( "sky/sea_bk.JPG" ),side: THREE.DoubleSide}),
    //new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("sky/sea_up.JPG"),side: THREE.DoubleSide}),
    //new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("sky/sea_dn.JPG"),side: THREE.DoubleSide}),
    //new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("sky/sea_rt.JPG"),side: THREE.DoubleSide}),
    //new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("sky/sea_lf.JPG"),side: THREE.DoubleSide})
  ];
  var skyBox = new THREE.Mesh(cubeGeometry, cubeMaterial);
  //scene.add(skyBox);


  //Lightining bolt
  var planeGeometry = new THREE.PlaneGeometry(190, 190);
  var planeMaterial = [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/bolt.png"), side: THREE.DoubleSide, alphaTest: 0.4 }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/bolt.png"), side: THREE.DoubleSide, alphaTest: 0.4 })
  ];
  var bolt = new THREE.Mesh(planeGeometry, planeMaterial);
  bolt.position.set(-150, 90, -350);
  var cloneBolt = bolt.clone();
  cloneBolt.position.x = 180;


  //bolts added to scene 
  window.setTimeout(function () {
    scene.add(bolt);
    scene.add(cloneBolt);
    var audioListener = new THREE.AudioListener();
    camera.add(audioListener);
    var sound = new THREE.Audio(audioListener);
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('sounds/bolt.mp3', function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(false);
      sound.setVolume(1.5);
      sound.play();
    });
  }, 45000);

  //bolts removed from scene
  window.setTimeout(function () {
    scene.remove(bolt);
    scene.remove(cloneBolt);
    planeGeometry.dispose();
  }, 47000);



  //Change the scene to night 
  window.setTimeout(function () {
    scene.remove(skyBox); //remove morning skybox
    scene.remove(cube);

    cubeGeometry.dispose();
    //var nightCube = new THREE.CubeGeometry(1800, 1200, 1300);
    var nightCube = new THREE.CubeGeometry(1200, 1000, 1200);
    ; var nightCubeMaterial = [
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/textures/back.png"), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/textures/back.png"), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/textures/top.png"), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/textures/bottom.png"), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/textures/top.png"), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/textures/left.png"), side: THREE.DoubleSide })
      //new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_ft.png"),side: THREE.DoubleSide}),
      //new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_bk.png"),side: THREE.DoubleSide}),
      //new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_up.png"),side: THREE.DoubleSide}),
      //new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_dn.png"),side: THREE.DoubleSide}),
      //new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_rt.png"),side: THREE.DoubleSide}),
      //new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/nightsky_lf.png"),side: THREE.DoubleSide})
    ];
    var nightSkyBox = new THREE.Mesh(nightCube, nightCubeMaterial);
    scene.add(nightSkyBox);
  }, 44000);



  function moveship(object) {
    object.position.x -= controls1.rotationSpeed;
    // object.position.y += controls1.rotationSpeed;
    //object.position.z += controls1.rotationSpeed;
    requestAnimationFrame(moveship.bind(moveship, object));
  }


  //the wooden box
  var box = new THREE.CubeGeometry(5, 5, 5);
  var cubeMaterial = [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/box.JPG"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/box.JPG"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/box.JPG"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/box.JPG"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/box.JPG"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/box.JPG"), side: THREE.DoubleSide })
  ];
  var Wbox = new THREE.Mesh(box, cubeMaterial);
  Wbox.position.set(2, 2, 120);
  var boxClone1 = Wbox.clone();
  var boxClone2 = Wbox.clone();
  boxClone1.position.set(-50, 2, 100);
  boxClone2.position.set(-55, 2, 130);

  // scene.add(boxClone1);
  // scene.add(boxClone2);

  requestAnimationFrame(moveBox.bind(moveBox, boxClone1));
  requestAnimationFrame(moveBox.bind(moveBox, boxClone2));
  requestAnimationFrame(moveBox.bind(moveBox, Wbox));
  //	scene.add(Wbox);


  // to load image if needed (not used)
  const boxWidth = 1000;
  const boxHeight = 1000;
  const boxDepth = 0;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/sea.JPG"), side: THREE.DoubleSide });
  const cube = new THREE.Mesh(geometry, material);
  cube.rotation.x = Math.PI * -.5;

  //scene.add( cube );

  
  //rain

  var pointGeometry = new THREE.Geometry();
  for (var i = 0; i < 1000000; i++) {
    var point = new THREE.Vector3();
    point.x = (Math.random() * 800) - 400;
    point.y = (Math.random() * 800) - 400;
    point.z = (Math.random() * 800) - 400;
    pointGeometry.vertices.push(point);
  }
  var rainDrop = new THREE.TextureLoader().load('textures/drop.png');
  rainDrop.wrapS = rainDrop.wrapT = THREE.RepeatWrapping;
  var pointMaterial = new THREE.PointsMaterial({ color: 'rgba(174,194,224)', size: 1.5, map: rainDrop });
  pointMaterial.alphaTest = 0.5;
  var rain = new THREE.Points(pointGeometry, pointMaterial);
  rain.scale.y = 8.0;

//add rain after 15 secs lama el donya tdlem
window.setTimeout(function () {
  scene.add(rain);
  var audioListener = new THREE.AudioListener();
  camera.add(audioListener);
  var sound = new THREE.Audio(audioListener);
  var audioLoader = new THREE.AudioLoader();
  audioLoader.load('sounds/rain.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(1.5);
    sound.play();
  });
}, 46000);



  controls.update();


//add light
 {
    const skyColor = 0xB1E1FF;  
    const groundColor = 0xB97A20;  
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }



  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = (new THREE.Vector3())
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);

  }

  // const axesHelper = new THREE.AxesHelper( 5 );
  //scene.add( axesHelper );

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  

  function moveShark(object) {
    var time = Date.now() * 0.0005;
    if (object.position.x >= -20) {    //so as not to collide with island
      object.position.x += 0.1;
      object.position.z += 0.4;
      requestAnimationFrame(moveShark.bind(moveShark, object));
    }
    else {
      object.position.z += 0.4;
      requestAnimationFrame(moveShark.bind(moveShark, object));
    }

  }


  function moveBox(object) {
    object.position.y = Math.cos(x) - 1;
    x += 0.1;
    requestAnimationFrame(moveBox.bind(moveBox, object));
  }


  function render() {
    var speed = Date.now() * 0.00025;
    trackballControls.update(clock.getDelta());

    //dy sah skyBox.rotation.y= Math.cos(speed*0.07);
    // skyBox.rotation.y = speed;
    // skyBox.rotation.x = Math.cos(speed*0.1);
    //camera.position.x +=0.1;
    // camera.position.x= Math.sin(speed) * 100;

    rain.position.y -= 1;
    if (rain.position.y == -400) rain.position.y = 400;


    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);


    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  function initTrackballControls(camera, renderer) {
    var trackballControls = new TrackballControls(camera, renderer.domElement);
    trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 1.2;
    trackballControls.panSpeed = 0.8;
    trackballControls.noZoom = false;
    trackballControls.noPan = false;
    trackballControls.staticMoving = true;
    trackballControls.dynamicDampingFactor = 0.3;
    trackballControls.keys = [65, 83, 68];

    return trackballControls;
  }
}

main();
