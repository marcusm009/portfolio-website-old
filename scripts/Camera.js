class Camera extends THREE.OrthographicCamera {
    constructor(window, zoom=192) {
        super();
        this.left = window.innerWidth / -zoom;
        this.right = window.innerWidth / zoom;
        this.top = window.innerHeight / zoom;
        this.bottom = window.innerHeight / -zoom;

        this.near = -300;
        this.far = 1500;

        this.updateProjectionMatrix();

        this.position.set(-1, 4, 1);
    };

    follow(player) {
        this.position.x = player.position.x;
        this.position.z = player.position.z;
    };
}