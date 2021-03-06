class Floor {
    constructor(scale, colors=[0xffffff], colorProb=[1]) {
        this.tiles = [];
        this.goalTile = undefined;

        this.scale = scale;

        this.colors = colors;
        this.colorProb = colorProb;

        this.dimensions = new THREE.Vector3(9,9);
        this.position = new THREE.Vector3();

    }

    async loadTemplate(templatePath) {
        await fetch(templatePath)
        .then(res => res.text())
        .then((template) => {
            this.template = template.split('\n').map(row => row.split('\t'));
            this.addTiles();
        });
    };

    addTiles() {
        for (let z = 0; z < this.template.length; z++) {
            for (let x = 0; x < this.template[z].length; x++) {
                if (this.template[z][x].toLowerCase() == 'x') {
                    this.tiles.push(new Tile(x, z));
                }
                else if (this.template[z][x].toLowerCase() == 'g') {
                    if (this.goalTile != undefined) {
                        console.log('ERROR: Multiple goal tiles! Please fix level template')
                    }
                    this.goalTile = new Tile(x, z, 0, .9, 0xffbd9e, 'goal');
                    this.tiles.push(this.goalTile);
                }
            }
        }
    }

    addToScene(scene) {
        for (let tile of this.tiles) {
            scene.add(tile);
        }
    }

    getBlockInLocation(x, z) {
        let xInt = Math.round(x);
        let zInt = Math.round(z);
        if (xInt < 0 || zInt < 0 || xInt >= this.template[0].length || zInt >= this.template.length) {
            return '';
        }
        return this.template[zInt][xInt].toLowerCase();
    }

    hasBlockInLocation(x, z) {
        return this.getBlockInLocation(x, z) == 'x';
    }

    hasGoalInLocation(x, z) {
        return this.getBlockInLocation(x, z) == 'g';
    }

    getPositions() {
        let positions  = [];
        for (let tile of this.tiles) {
            positions.push(tile.position);
        }
        return positions;
    }

    completeLevel() {
        this.goalTile.position.z = 100000;
    }
}