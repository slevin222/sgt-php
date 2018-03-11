
class SGTContent {
    constructor(sgtOptions) {
        this.model = new SGT_model();
        this.view = new SGT_view(sgtOptions);
    }
    initialize() {
        this.view.initialize();
    }
}

class SGT_view {
    constructor(viewOptions) {
        this.interfaceElements = {};
        const defaultOptions = ['addButton', 'cancelButton', 'nameInput', 'gradeInput', 'courseInput', 'studentDisplay'];
        for (var option_i; option_i < defaultOptions.length; option_i++) {
            if (viewOptions[defaultOptions[option_i]]) {
                this.interfaceElements[defaultOptions[option_i]] = viewOptions[defaultOptions[option_i]];
            } else {
                console.error(`missing option ${defaultOptions[option_i]}: terminating`);
                return false;
            }
        }

    }

    initialize() {
        this.findDomElements();

    }

    findDomElements() {
        for (let key in this.interfaceElements) {
            let element = $(this.interfaceElements[key]);
            if (element.length) {
                this.interfaceElements[key] = element;
            } else {
                console.error(`missing elelment ${this.interfaceElements[key]}: terminating`);
                return false;
            }
        }
    }
}

class SGT_model {
    constructor() {

    }
}