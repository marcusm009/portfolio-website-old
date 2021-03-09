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

    move(direction, totalFrames=10) {
        if(this.isReadyToMove == true) {
            if (direction == 'up') {
                this.animations.push([() => {
                    this.position.x += 1/totalFrames;
                }, totalFrames]);
            } else if (direction == 'down') {
                this.animations.push([() => {
                    this.position.x -= 1/totalFrames;
                }, totalFrames]);
            } else if (direction == 'left') {
                this.animations.push([() => {
                    this.position.z -= 1/totalFrames;
                }, totalFrames]);
            } else if (direction == 'right') {
                this.animations.push([() => {
                    this.position.z += 1/totalFrames;
                }, totalFrames]);
            }
            this.isReadyToMove = false;
        }
    };

    animate() {
        for (let i = 0; i < this.animations.length; i++) {
            if (this.animations[i][1] > 0) {
                this.animations[i][0].bind(this)();
                this.animations[i][1]--;
            }
        }
        this.removeCompletedAnimations();        
        this.checkReadyToMove();
    };

    removeCompletedAnimations() {
        let newAnimations = [];
        for (let i = 0; i < this.animations.length; i++) {
            if (this.animations[i][1] > 0)
                newAnimations.push(this.animations[i]);
        }
        this.animations = newAnimations;
    };

    checkReadyToMove() {
        if (this.animations.length == 0) {
            this.position.round();
            this.isReadyToMove = true;
        }
    };
}