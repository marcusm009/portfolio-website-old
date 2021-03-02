// global variables
let renderer;
let cssRenderer;

let scene;
let camera;
let control;

let initialScreenWidth;
let initialScreenHeight;

let screen;

function init() {

    console.log('VER: 0.031');

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

    // add floor
    let floor = new Floor(
        new THREE.Vector3(),
        new THREE.Vector2(9,9),
        new THREE.Vector3(),
        0.9,
        0,
        colors=[0xacff78,0x292929],
        colorProb=[0,1],
        holes=[[-3,-3],[3,-3],[3,3]]
    )
    floor.addToScene(scene);

    // add player
    let player = new Player(0,0);
    scene.add(player);

    // main animation loop
    let frame = 0;
    let playerAnimations = [];
    let playerIsFalling = false;

    const animate = () => {
        renderer.render(scene, camera);

        player.animate(floor);

        frame += 1;
        requestAnimationFrame(animate);

        if(frame == 2) {
            window.scrollTo(0,0);
        }

        if(frame % 200 == 0) {
            // console.log(planet[0].getPositions());
            // console.log(player.position);
            // console.log(player.isFalling);
        }
    }

    animate();

    // $(window).scroll(() => {
    //     let scroll = $(window).scrollTop();
    //     let transparency = Math.min(Math.max(scroll/window.innerHeight, 0.5), 1);
    //     let redness = Math.min(Math.max(scroll/window.innerHeight*255, 64), 215);
    //     // console.log(scroll);
    //     console.log(transparency);
    //     console.log(redness);
    //     // $('#nav-bar').css('background-color', `rgba(${redness}, 64, 64, ${transparency})`);
    //     $('#nav-bar').css('background-color', `rgba(64, 64, 64, ${transparency})`);    
    // });

    $('#title').click(() => {
        location.reload();
    });

    $('#nav-bar').children().click((event) => {
        changePage($(event.target).attr('href'));
    });
}

window.onload = init;
window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){

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