// global variables
let renderer;
let scene;
let camera;
let control;

let initialScreenWidth;
let initialScreenHeight;

let pageName

async function init() { 
    console.log('VER: 0.1.6');

    pageName = window.location.pathname.split('/').pop().split('.html')[0];

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
    await floor.loadTemplate(`levels/${pageName}.tsv`);
    floor.addToScene(scene);

    // add player
    let controller = new Controller(document);
    let player;
    if(pageName == 'projects')
        player = new RectangularPrismPlayer(floor.spawnTile.position.x, floor.spawnTile.position.z);
    else
        player = new CubePlayer(floor.spawnTile.position.x, floor.spawnTile.position.z);
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
            player.completedLevel = true;
            $('#site-body').toggleClass('fade');
            setTimeout(() => {
                $('#site-body').toggleClass('fade');
                $('#site-body').toggleClass('active');
                $('html').css('touch-action','auto')
            }, 100);
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
// window.addEventListener('resize', onWindowResize, false);

function setupScene(window, document) {
    initialScreenWidth = window.innerWidth;
    initialScreenHeight = window.innerHeight;

    scene = new THREE.Scene();
    camera = new Camera(window, scene);
    renderer = new THREE.WebGLRenderer({alpha: true});
    
    let container = document.getElementById('canvas-container');
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.zIndex = 0;

    let dirLight = new THREE.DirectionalLight();
    scene.add(dirLight);
    dirLight.position.set(-20,100,50);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function scrollTransition() {
    $('body').css('overflow', 'auto');

    window.scrollBy({
        top: window.innerHeight,
        left: 0,
        behavior: 'smooth'
    });
}