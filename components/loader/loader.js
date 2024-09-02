const debliwui_loader = document.createElement('template');
debliwui_loader.innerHTML = `
    <style>
        .container{
            position:fixed;
            width:98%;
            left: 1%;
            top:1vh;
            height:98vh;
            background: #fe718d10;
            z-index: 99999999999;
            display:none;
        }
        

        .backdrop{    
            position:relative;
            width:100%;
            height:100hv;
        }
        img{
            
            width:150px;
            display:block;
            margin:40vh auto
            }
    
    </style>

    <div class="container">
        <div class="backdrop">
        </div>
        <img src="assets/loader.svg">
    </div>
`;

class debliwuiloader extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(debliwui_loader.content.cloneNode(true));
    }

    fechar() {
        let container = this.shadowRoot.querySelector('.container');
        container.style.display = "none";
    }
    abrir() {
        let container = this.shadowRoot.querySelector('.container');
        container.style.display = "block";
    }

    connectedCallback() {

    }


}

window.customElements.define('debliwui-loader', debliwuiloader)