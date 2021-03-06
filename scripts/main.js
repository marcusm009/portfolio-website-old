// global variables
let renderer;
let cssRenderer;

let scene;
let camera;
let control;

let initialScreenWidth;
let initialScreenHeight;

let screen;

async function init() {
    console.log('VER: 0.04');

    if (location.hash == '') {
        location.hash = '#about';
    }

    setupScene();

    let audioContext = new AudioContext();
    audioContext.resume().then(() => {
        console.log('Playback resumed successfully');
    });

    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // create a global audio source
    const sound = new THREE.Audio(listener);

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('sounds/wooden-percussion-shot.ogg', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(1);
    });

    // add floor
    let floor = new Floor(
        0.9,
        colors=[0xacff78,0x292929],
        colorProb=[0,1],
        holes=[[-3,-3],[3,-3],[3,3]]
    )
    await floor.loadTemplate('levels/about.tsv');
    floor.addToScene(scene);

    // add player
    let player = new Player(0,0);
    scene.add(player);

    // main animation loop
    let frame = 0;
    let playerAnimations = [];
    let playerIsDead = false;

    const animate = () => {
        renderer.render(scene, camera);

        if(player.playSound) {
            if(sound.isPlaying) {
                sound.stop();
            }
            sound.play();
        }

        player.animate(floor);

        frame += 1;
        requestAnimationFrame(animate);

        if (player.isFalling && !playerIsDead) {
            $('#site-body').css('display', 'inline');
            // location.hash = 'about';
            changePage(location.hash);
            playerIsDead = true;
        }

        if(frame == 2) {
            window.scrollTo(0,0);
        }

        if(frame % 200 == 0) {
            // console.log(planet[0].getPositions());
            console.log(player.position);
            // console.log(player.isFalling);
        }
    }

    animate();

    $('#title').click(() => {
        location.reload();
    });

    $('#nav-bar').children().click((event) => {
        changePage($(event.target).attr('href'));
    });
}

window.onload = init;
window.addEventListener('resize', onWindowResize, false);

function setupScene() {
    initialScreenWidth = window.innerWidth;
    initialScreenHeight = window.innerHeight;

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera();

    let zoom = 192;
    let defaultCameraPos = THREE.Vector3(-1, 0.5, 0.75);

    camera.left = window.innerWidth / -zoom;
    camera.right = window.innerWidth / zoom;
    camera.top = window.innerHeight / zoom;
    camera.bottom = window.innerHeight / -zoom;

    camera.near = -300;
    camera.far = 1500;

    camera.updateProjectionMatrix();

    // create a render, sets the background color and the size
    renderer = new THREE.WebGLRenderer({alpha: true});
    // renderer.setClearColor(0x000000, 1);
    
    // get container to contain three.js canvas.
    let container = document.getElementById('canvas-container');
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);
    
    // renderer.domElement.style.position = 'absolute';
    // renderer.domElement.style.top = 0;    
    renderer.domElement.style.zIndex = 0;

    // position and point the camera to the center of the scene
    camera.position.set(-1, 4, 1);
    
    let focalPoint = scene.position.clone();
    
    focalPoint.y += 3;
    camera.lookAt(focalPoint);

    let dirLight = new THREE.DirectionalLight();
    scene.add(dirLight);
    // dirLight.position.set(-500, 200, 300);
    dirLight.position.set(-20,100,50);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    console.log(screen.scale);
    screen.scale.setX(window.innerWidth/initialScreenWidth);
    screen.scale.setY(window.innerHeight/initialScreenHeight);

    screen.reflow();
}

function scrollTransition() {
    $('body').css('overflow', 'auto');

    window.scrollBy({
        top: window.innerHeight,
        left: 0,
        behavior: 'smooth'
    });
}

function changePage(href) {
    $('#site-body').load('screen/' + href.replace('#','') + '.html');
}