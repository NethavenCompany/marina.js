class Component extends HTMLElement {
    settings: Record<string, any> = {};
    
    constructor() {
        super() 
        this.settings = {};
    };
}

export default Component;