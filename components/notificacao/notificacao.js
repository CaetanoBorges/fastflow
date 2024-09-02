const debliwui_notificacao = document.createElement('template');
debliwui_notificacao.innerHTML = `
    <style>
        .container{
            position:fixed;
            width:94%;
            left: 3%;
            top:1.5vh;
            height:fit-content;
            background: #dc3545;
            z-index: 9999999999999 !important;
            border-radius:5px;
            display:none
        }
        

        .header{
            
            position:relative;
            width:100%;
            height:fit-content;
        }
       
       #sms{display:flex;justify-content:center;align-items:center;padding:1vh 5%;font-size:23px;text-transform:capitalize;font-weight:bold;text-align:center;color:white}
    </style>

    <div class="container" style="z-index: 9999999999999 !important"> 
        <div class="header">
        <div id="sms">
        <slot name="notificacao"></slot>
        </div>
        </div>
    </div>
`;

class debliwuinotificacao extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(debliwui_notificacao.content.cloneNode(true));
    }

    fechar(esse) {
        let container = esse.shadowRoot.querySelector('.container');
        container.style.display = "none";
    }
    abrir() {
        let container = this.shadowRoot.querySelector('.container');
        container.style.display = "block";
    }

    connectedCallback() {
        var esse = this;
        var fechar = this.fechar;
        this.shadowRoot.querySelector('.container').addEventListener("click", function() {
            fechar(esse);
        });
    }

    sms(mensagem,tipo = 0) {
        var esse = this;
        var fechar = this.fechar;
        let sms = this.shadowRoot.querySelector('#sms');
        sms.innerHTML = mensagem;
        if(tipo == 1){
            this.shadowRoot.querySelector('.container').style.background = "#dc3545";
        }else{
            this.shadowRoot.querySelector('.container').style.background = "#428bca";
        }

        this.abrir();
        setTimeout(function() {
            fechar(esse);
        }, 5000);
    }


}

window.customElements.define('debliwui-notificacao', debliwuinotificacao)