class Player extends THREE.Mesh {
    constructor(x, z, scale=0.9, color='red', multiplier=1) {
        let cubeGeometry = new THREE.BoxGeometry(scale, scale, scale);
        let cubeMaterial = new THREE.MeshPhongMaterial();
        cubeMaterial.color = new THREE.Color(color);
        cubeMaterial.blending = THREE.NoBlending;
        // cubeMaterial.wireframe = true;
        super(cubeGeometry, cubeMaterial);
        
        // super(x, 0, z, 0.9, 0xff0000);
        // super(x, 0, z, 0.9, 'purple');

        this.name = 'player';
        this.multiplier = multiplier;
        this.position.y += multiplier;
        this.speed = multiplier;

        this.gravity = 0.025;
        this.fallVelocity = 0;
        
        this.keyHeldDown = false;
        this.isReadyToMove = true;
        this.isFalling = false;
        this.isDead = false;
        
        this.animations = [];
        this.framesLeftOfAnimation = 0;
        
        // keyboard event listeners
        document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
        document.addEventListener('keyup', this.handleKeyUp.bind(this), false);

        // touch event listeners
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), false);        
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), false);

        // touch control variables
        this.xDown = null;                                                        
        this.yDown = null;
    };

    move(direction) {
        let rotVel = 0.1 * (Math.PI/2);
        let totAnimationFrames = (Math.PI/2) / rotVel;

        if(this.isReadyToMove == true) {
            if (direction == 'up') {
                this.animations.push([() => {
                    this.position.x += this.speed/totAnimationFrames;
                    this.rotation.z -= rotVel;
                }, totAnimationFrames]);
            } else if (direction == 'down') {
                this.animations.push([() => {
                    this.position.x -= this.speed/totAnimationFrames;
                    this.rotation.z += rotVel;
                }, totAnimationFrames]);
            } else if (direction == 'left') {
                this.animations.push([() => {
                    this.position.z -= this.speed/totAnimationFrames;
                    this.rotation.x -= rotVel
                }, totAnimationFrames]);
            } else if (direction == 'right') {
                this.animations.push([() => {
                    this.position.z += this.speed/totAnimationFrames;
                    this.rotation.x += rotVel;
                }, totAnimationFrames]);
            }

            this.playSound = true;
            this.isReadyToMove = false;
        }
    };

    handleKeyDown(event) {
        let keyCode = event.which;
        if (keyCode == 87 || keyCode == 38) {
            this.move('up');
        } else if (keyCode == 83 || keyCode == 40) {
            this.move('down');
        } else if (keyCode == 65 || keyCode == 37) {
            this.move('left');
        } else if (keyCode == 68 || keyCode == 39) {
            this.move('right');
        } else {
            console.log('Key pressed: ' + keyCode);
        }
        this.keyHeldDown = true;
    };

    handleKeyUp() {
        this.keyHeldDown = false;
    };

    getTouches(event) {
        return event.touches ||             // browser API
               event.originalEvent.touches; // jQuery
    };

    handleTouchStart(event) {
        const firstTouch = this.getTouches(event)[0];                                      
        this.xDown = firstTouch.clientX;                                      
        this.yDown = firstTouch.clientY;                                      
    };

    handleTouchMove(event) {
        if (!this.xDown || !this.yDown) {
            return;
        }

        let xUp = event.touches[0].clientX;                                    
        let yUp = event.touches[0].clientY;

        let xDiff = this.xDown - xUp;
        let yDiff = this.yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff) ) {
            if (xDiff > 0) {
                this.move('left');
            } else {
                this.move('right');
            }                       
        } else {
            if (yDiff > 0) {
                this.move('up');
            } else { 
                this.move('down');
            }                                                                 
        }
        /* reset values */
        this.xDown = null;
        this.yDown = null;                                             
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
        if (this.keyHeldDown == false && this.animations.length == 0 && this.isFalling == false) {
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
            // if (!floor.hasBlockInLocation(this.getPosition()[0], this.getPosition()[1])) {
            this.isFalling = true;
            
            this.animations.push([() => {
                this.position.y -= this.fallVelocity;
                this.fallVelocity += this.gravity;
            }, totAnimationFrames]);
        }
    }

}