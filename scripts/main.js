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
    console.log('VER: 0.1.0');

    // if (location.hash == '') {
    //     location.hash = '#about';
    // }

    setupScene(window, document);

    let audioManager = new AudioManager(window);

    camera.add(audioManager.listener);
    audioManager.loadSound('wooden-percussion-shot');

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
    let controller = new Controller(document);
    let player = new Player(floor.spawnTile.position.x, floor.spawnTile.position.z);
    player.setController(controller);
    scene.add(player);
    camera.follow(player);

    // main animation loop
    let frame = 0;

    const animate = () => {
        renderer.render(scene, camera);

        if(player.playSound) {
            audioManager.playSound('wooden-percussion-shot');
        }

        player.animate(floor);
        camera.follow(player, .1);

        if (player.completionPending) {
            player.completionPending = false;
            $('#site-body').css('display', 'inline');
            // location.hash = 'about';
            changePage(location.hash);
            player.completedLevel = true;
        }

        if(frame % 200 == 0) {
            // console.log(planet[0].getPositions());
            console.log(player.position);
            // console.log(player.isFalling);
        }

        frame += 1;
        requestAnimationFrame(animate);
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

function setupScene(window, document) {
    initialScreenWidth = window.innerWidth;
    initialScreenHeight = window.innerHeight;

    scene = new THREE.Scene();
    camera = new Camera(window);
    renderer = new THREE.WebGLRenderer({alpha: true});
    
    let container = document.getElementById('canvas-container');
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.zIndex = 0;
    
    let focalPoint = scene.position.clone();
    focalPoint.y += 3;
    camera.lookAt(focalPoint);

    let dirLight = new THREE.DirectionalLight();
    scene.add(dirLight);
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