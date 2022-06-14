let allPlayers;
class GameObject {
    constructor(root) {
        this.allPlayers = root.allPlayers;
        this.allPlayers.push(this);
        this.timeSkip = 0;//相邻两帧渲染的时间间隔
        this.AlreadyInit = false;
        allPlayers = this.allPlayers;
    }

    //每个player的初始化
    init() {

    }

    //相邻两帧的渲染更新
    update() {

    }

    //销毁当前的player对象
    destroy() {
        for (let item in this.allPlayers) {
            if (allPlayers[item] === this) {
                allPlayers.splice(item, 1);
                return;
            }
        }
    }
}

//用于计算timeSkip
let lastTimeStamp = 0;

let GamePerFrameUpdate = (timeStamp) => {
    for (let item of allPlayers) {
        if (item.AlreadyInit) {
            item.update();
            item.timeSkip = timeStamp - lastTimeStamp;//更新该player对象的timeSkip
        }
        else {
            item.init();
            item.AlreadyInit = true;
        }
    }
    lastTimeStamp = timeStamp;
    requestAnimationFrame(GamePerFrameUpdate);
}

requestAnimationFrame(GamePerFrameUpdate);

export {
    GameObject
}