import { GameObject } from "../game_object/base.js";

class Player extends GameObject {
    constructor(root, info) {
        super(root);

        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        // this.boxX = info.boxX;
        // this.boxY = info.boxY;
        this.direction = info.direction;
        this.width = info.width;
        this.height = info.height;

        this.vx = 0;
        this.vy = 0;

        this.gravity = 50;
        this.speedX = 400;
        this.speedYJumpBegin = -800;
        this.ctx = this.root.gameMap.ctx;

        this.hp = (info.hp);
        this.$hp = this.root.$kof.find(`.Player${this.id}Hp>div`);
        this.fistDamage = (info.fistDamage);
        //用box模拟
        // this.color = info.color;

        this.controller = this.root.gameMap.controller.underPressed;
        this.stateMap = new Map();
        this.stateMap = {
            "idle": 0,
            "walkforward": 1,
            "walkback": 2,
            "jump": 3,
            "fist": 4,
            "attacked": 5,
            "died": 6
        };
        this.state = this.stateMap["jump"];

        this.animtions = new Map();
        this.hasPassedFrameCnt = 0;
    }

    init() {

    }

    updateMove() {
        this.vy += this.gravity;

        this.x += this.vx * this.timeSkip / 1000;
        this.y += this.vy * this.timeSkip / 1000;

        if (this.y > 420) {
            this.y = 420;
            this.vy = 0;
            if (this.state === this.stateMap["jump"])
                this.state = this.stateMap["idle"];
        }

        if (this.x <= 0)
            this.x = 0;
        if (this.x >= this.ctx.canvas.width - this.width)
            this.x = this.ctx.canvas.width - this.width;
    }

    updateControll() {
        let walkforward, walkback, jump, fist;
        if (this.id === 0) {
            walkforward = this.controller.has('d');
            walkback = this.controller.has('a');
            jump = this.controller.has('w');
            fist = this.controller.has(' ');
        } else {
            walkforward = this.controller.has('ArrowRight');
            walkback = this.controller.has('ArrowLeft');
            jump = this.controller.has('ArrowUp');
            fist = this.controller.has('Enter');
        }

        if (this.state === this.stateMap["idle"] || this.state === this.stateMap["walkforward"] || this.state === this.stateMap["walkback"]) {
            if (fist) {
                this.state = this.stateMap["fist"];
                this.vx = this.vy = 0;
                this.hasPassedFrameCnt = 0;
            }
            else if (jump) {
                if (walkforward) {
                    this.vx = this.speedX;
                } else if (walkback) {
                    this.vx = -this.speedX;
                } else
                    this.vx = 0;
                this.vy = this.speedYJumpBegin;
                this.state = this.stateMap["jump"];
                this.hasPassedFrameCnt = 0;
            } else if (walkforward) {
                this.vx = this.speedX;
                this.state = this.stateMap["walkforward"];
            } else if (walkback) {
                this.vx = -this.speedX;
                this.state = this.stateMap["walkback"];
            } else {
                this.vx = this.vy = 0;
                this.state = this.stateMap["idle"];
            }

        }
    }

    updateDirection() {
        let players = this.root.allPlayers;
        if (players[1] && players[2]) {
            let self = this, opponent = players[2 - this.id];
            if (self.x < opponent.x) {
                self.direction = 1;
            } else {
                self.direction = -1;
            }
        }
    }

    underFistAttacked() {
        this.state = this.stateMap["attacked"];
        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 500)
        this.hasPassedFrameCnt = 0;
        if (this.hp <= 0) {
            this.state = this.stateMap["died"];
            this.hasPassedFrameCnt = 0;
            this.vx = 0;
        }
    }

    checkCollision(r1, r2) {
        let xDirLeft = Math.max(r1.x1, r2.x1), xDirRight = Math.min(r1.x2, r2.x2);
        let yDirLeft = Math.max(r1.y1, r2.y1), yDirRight = Math.min(r1.y2, r2.y2);
        return xDirLeft <= xDirRight && yDirLeft <= yDirRight;
    }
    updateAttack() {
        if (this.state === this.stateMap["fist"] && this.hasPassedFrameCnt === 16) {
            let players = this.root.allPlayers;
            if (players[1] && players[2]) {
                let self = this, opponent = players[2 - this.id];
                let r1, r2;
                if (self.direction > 0) {
                    r1 = {
                        x1: self.x + 110,
                        y1: self.y + 40,
                        x2: self.x + 110 + 120,
                        y2: self.y + 40 + 20
                    }
                } else {
                    r1 = {
                        x1: self.x + this.width - 110 - 120,
                        y1: self.y + 40,
                        x2: self.x + this.width - 110 - 120 + 120,
                        y2: self.y + 40 + 20
                    }
                }
                r2 = {
                    x1: opponent.x,
                    y1: opponent.y,
                    x2: opponent.x + opponent.width,
                    y2: opponent.y + opponent.height
                }
                if (this.checkCollision(r1, r2) && opponent.state !== opponent.stateMap["died"]) {
                    opponent.hp = Math.max(opponent.hp - this.fistDamage, 0);
                    opponent.underFistAttacked();
                }
            }
        }
    }

    update() {
        let $timer = this.root.gameMap.$timer;
        if (parseInt($timer.text()) <= 0) {
            if (this.state !== this.stateMap["died"]) {
                this.state = this.stateMap["died"];
                this.vx = 0;
                this.hasPassedFrameCnt = 0;
            }
            $timer.text("0");
        }
        if (parseInt($timer.text()) > 0) {
            this.root.gameMap.leftTime -= this.timeSkip / 2;
            $timer.text(parseInt(this.root.gameMap.leftTime / 1000));
        }
        this.updateControll();
        this.updateMove();
        if (this.state !== this.stateMap["died"]) {
            this.updateDirection();
            this.updateAttack();
        }
        this.render();
    }

    render() {
        //box-edge
        // if (this.direction > 0) {
        //     this.ctx.fillStyle = this.color;
        //     this.ctx.fillRect(this.x, this.y, this.width, this.height);
        //     this.ctx.fillStyle = "green";
        //     this.ctx.fillRect(this.x + 110, this.y + 40, 120, 20);
        // } else {
        //     this.ctx.fillStyle = this.color;
        //     this.ctx.fillRect(this.x, this.y, this.width, this.height);
        //     this.ctx.fillStyle = "green";
        //     this.ctx.fillRect(this.x + this.width - 110 - 120, this.y + 40, 120, 20);
        // }

        let nowState = this.state;
        let perImage = this.animtions.get(nowState);
        if (perImage && perImage.hasLoaded) {
            if (this.direction > 0) {
                let nowFrame = (parseInt(this.hasPassedFrameCnt / perImage.frameRate)) % perImage.frameCnt;
                let image = perImage.gif.frames[nowFrame].image;
                this.ctx.drawImage(image, this.x, this.y + perImage.fixY, image.width * perImage.scale, image.height * perImage.scale);
            } else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.ctx.canvas.width, 0);

                let nowFrame = (parseInt(this.hasPassedFrameCnt / perImage.frameRate)) % perImage.frameCnt;
                let image = perImage.gif.frames[nowFrame].image;
                this.ctx.drawImage(image, this.ctx.canvas.width - this.x - this.width, this.y + perImage.fixY, image.width * perImage.scale, image.height * perImage.scale);

                this.ctx.restore();
            }
        }
        if (this.state === this.stateMap["fist"] || this.state === this.stateMap["attacked"] || this.state === this.stateMap["died"]) {
            if (this.hasPassedFrameCnt === perImage.frameRate * (perImage.frameCnt - 1)) {
                if (this.state === this.stateMap["died"])
                    this.hasPassedFrameCnt--;
                else {
                    this.state = this.stateMap["idle"];
                    this.hasPassedFrameCnt = 0;
                }
            }
        }
        this.hasPassedFrameCnt++;
    }
}

export {
    Player
}