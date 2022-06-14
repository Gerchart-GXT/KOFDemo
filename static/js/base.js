import { GameMap } from './game_map/base.js'
import { HeroKyo } from './items/players/heros/kyo.js'



//项目主类，游戏底层页
class Kof {
    constructor(id) {
        this.$kof = $("#" + id);
        this.allPlayers = [];
        this.gameMap = new GameMap(this);
        this.player0 = new HeroKyo(this, {
            id: 0,
            x: 300,
            y: 0,
            width: 100,
            height: 200,
            direction: 1,
            hp: 100,
            fistDamage: 20,
            // color: 'blue'
        });
        this.player1 = new HeroKyo(this, {
            id: 1,
            x: 880,
            y: 0,
            width: 100,
            height: 200,
            direction: -1,
            hp: 100,
            fistDamage: 20,
            // color: 'red'
        });
    }


}

export {
    Kof
}