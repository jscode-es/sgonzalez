class BlockInfo extends HTMLElement {

    // Contructor
    constructor() { super() }

    // Inicializar 
    connectedCallback() {

        this.render()
    }

    private async render() {

        let action = this.getAttribute('action')
        let title = this.getAttribute('title')
        let desc = this.getAttribute('desc')
        let img = this.getAttribute('img')

        let html = `
        <a href="${action}" class="block">
            <div class="img" style="background:url(./img/${img});background-position: center;background-size: cover;"></div>
            <h2 class="title">${title}</h2>
            <p class="desc">${desc}</p>
        </a>
        
        `
        this.innerHTML = html
    }
}

customElements.define('block-info', BlockInfo)
