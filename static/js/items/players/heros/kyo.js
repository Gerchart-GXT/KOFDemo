import { Player } from "../base.js";
import { GIF } from "../../../../utils/gif.js";

class HeroKyo extends Player {
    constructor(root, info) {
        super(root, info);
        this.root = root;
        this.InitAnimations();
    }

    InitAnimations() {
        let player = this;
        let offsetY = [0, -22, -22, -130, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            let nowGif = GIF();
            nowGif.load(`/static/images/heros/kyo/${i}.gif`);
            this.animtions.set(i, {
                gif: nowGif,
                frameCnt: 0,
                frameRate: 0,
                fixY: 0,
                scale: 2,
                hasLoaded: false
            });
            nowGif.onload = () => {
                let perImage = player.animtions.get(i);
                perImage.frameCnt = nowGif.frames.length;
                perImage.frameRate = i === 3 ? 4 : 5;
                perImage.fixY = offsetY[i];
                perImage.hasLoaded = true;
            }
        }
    }
}

export {
    HeroKyo
}