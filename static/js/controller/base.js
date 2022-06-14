class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;

        this.underPressed = new Set();

        this.PressEvent();
    }

    PressEvent() {
        let controller = this;

        controller.$canvas.keydown((e) => {
            controller.underPressed.add(e.key);
        });
        controller.$canvas.keyup((e) => {
            controller.underPressed.delete(e.key);
        })
    }
}

export {
    Controller
}