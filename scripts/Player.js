class Player extends THREE.Mesh {
    constructor(x, z, y=1, scale=0.9, color='red') {
        let cubeGeometry = new THREE.BoxGeometry(scale, scale, scale);
        let cubeMaterial = new THREE.MeshPhongMaterial();
        cubeMaterial.color = new THREE.Color(color);
        cubeMaterial.blending = THREE.NoBlending;
        super(cubeGeometry, cubeMaterial);
        
        this.name = 'player';
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        this.gravity = 0.025;
        this.fallVelocity = 0;
        
        this.isReadyToMove = true;
        this.isFalling = false;
        this.isDead = false;
        
        this.animations = [];
        this.framesLeftOfAnimation = 0;
    };

    move(direction, framesPerRoll=10) {
        let rotVel = (Math.PI/2) / framesPerRoll;

        if(this.isReadyToMove == true) {
            if (direction == 'up') {
                this.animations.push([() => {
                    this.position.x += 1/framesPerRoll;
                    this.rotation.z -= rotVel;
                }, framesPerRoll]);
            } else if (direction == 'down') {
                this.animations.push([() => {
                    this.position.x -= 1/framesPerRoll;
                    this.rotation.z += rotVel;
                }, framesPerRoll]);
            } else if (direction == 'left') {
                this.animations.push([() => {
                    this.position.z -= 1/framesPerRoll;
                    this.rotation.x -= rotVel
                }, framesPerRoll]);
            } else if (direction == 'right') {
                this.animations.push([() => {
                    this.position.z += 1/framesPerRoll;
                    this.rotation.x += rotVel;
                }, framesPerRoll]);
            }

            this.playSound = true;
            this.isReadyToMove = false;
        }
    };

    animate(floor) {
        if (!this.isDead) {
            for (let i = 0; i < this.animations.length; i++) {
                if (this.animations[i][1] > 0) {
                    this.animations[i][0].bind(this)();
                    this.animations[i][1]--;
                }
            }
            this.removeCompletedAnimations();        
            this.checkReadyToWin(floor);
            this.checkReadyToFall(floor);
            this.checkReadyToMove();
        }
        this.playSound = false;
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
        if (this.animations.length == 0 && this.isFalling == false) {
            this.rotation.set(0,0,0);
            this.position.round();
            this.isReadyToMove = true;
        }
    };

    checkReadyToFall(floor) {        
        let totAnimationFrames = 50;

        if (this.isFalling) {
            return;
        }
        if (!floor.hasBlockInLocation(this.position.x, this.position.z)) {
            this.isFalling = true;
            
            this.animations.push([() => {
                this.position.y -= this.fallVelocity;
                this.fallVelocity += this.gravity;
            }, totAnimationFrames]);
        }
    };

    checkReadyToWin(floor) {
        if (floor.hasGoalInLocation(this.position.x, this.position.z)) {
            this.winner = true;
            floor.completeLevel();
        }
    }

}