import { GameObject } from "../items/game_object/base.js";
import { Controller } from "../controller/base.js"

class GameMap extends GameObject {
    constructor(root) {
        super(root);

        this.root = root;

        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();

        this.controller = new Controller(this.$canvas);

        this.root.$kof.append($(`
        <div class="kofHead">
            <div class="Player0Hp">
                <div></div>
            </div>
            <div class="timer">60</div>
            <div class="Player1Hp">
                <div></div>
            </div>
        </div>
        `));
        this.$timer = this.root.$kof.find(`.timer`);
        this.leftTime = parseInt(this.$timer.text()) * 1000;
        console.log(this.leftTime);
    }

    init() {

    }

    update() {
        this.render();
    }

    render() {
        // this.ctx.fillStyle = "black";
        // this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}

export {
    GameMap
}