const debliwui_menu = document.createElement('template');
debliwui_menu.innerHTML = `
    <style>
        .container{
            position:fixed;
            width:fit-content;
            left: 0;
            top:0;
            height:fit-content;
            z-index: 9999999999;
            padding:0;
            font-size:12pt;
        }
        .conteudo{
            position:absolute;
            top:0;
            width:300px;
            height:100vh;
            background: #ffffff;
            z-index: 10102;
        }
        .relativa{
            position: relative;
            z-index: 10102;
            overflow:auto;
            height:100vh;
            background-color: #ffffff;
        }
        .backdrop{
            width:100%;
            height:100%;
            position:fixed;
            width:100%;
            left: 0;
            top:0;
            height:100vh;
            background: #00000074;
        }
        
        ul {
            list-style: none;
            width: 100%;
            margin-left: -50px;
        }
        
        ul a {
            text-decoration: none;
            color: #7a7a7a;
            font-weight: 600;
            text-align: left;
        }
        
        ul li:hover {
            background: #961A1A;
            color:white;
        }
        
        ul li {
            width: 100%;
            padding: 5px 5px 10px 5px;
            display: flex;
            align-items:center;
            margin: 7px 0;
            border-bottom:1px solid #00000010;
        }
        
        ul li img {
            width: 25px;
            margin: 0 30px 0 30px;
        }

        .aciona-menu{
            width:25px;
            margin: 18px 0 0 15px;
            cursor:pointer;
            z-index:11111;
        }
        .user{
            background-color:#9f0600;
            width:90%;
            height:25vh;
            display:flex;
            align-items:baseline;
            flex-direction:column;
            justify-content: flex-end;
            padding: 0 0 3vh 10%;
            color:white;
            position:relative;

        }
        .user div{
            width:72pt;height:72pt;
            border-radius:50%;
        }
        .user .perfil{
            width:100%;
            height:100%;
            border-radius:36pt;
            }
        .user .definicoes-user{
            position:absolute;
            top:20px;
            right:20px;
            width:40px;
            height:40px;
            cursor:pointer;
        }

        .sair{position:absolute;bottom:10pt;right:10pt;color:#9f0600;cursor:pointer;}
        @media screen and (max-width:700px) {
            .conteudo{
                display:none;
            }
        }
    </style>

    <div class="container">
        <img src="assets/barras-menu.svg" class="aciona-menu">
        
        <div class="conteudo" style="display:none">
            <div class="backdrop"></div>
            <div class="relativa">
                <span class="sair">Sair</span>
                <div class="user">
                    <a href="/definicoes" class="go-definicoes"><img class="definicoes-user" src="assets/gear.svg" style="z-index:2"></a>
                    <img src="pub.png" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:-0;text-shadow:0px 0px 2px 4px #000000;">
                    <p style="z-index:2;font-weight:bold;text-shadow:0px 0px 2px 4px #000000">Nome do cliente <br> MESA 2</p>
                </div>
                <ul>
                    <a href="/home" class="home">
                        <li> <img src="assets/home.svg"> <span>Início</span></li>
                    </a>
                    <div class="linha-divisoria"></div>
                    <a href="/conta" class="conta">
                        <li> <img src="assets/money-menu.svg"> <span>Conta</span></li>
                    </a>
                    <a href="/privacidade" class="privacidade">
                        <li> <img src="assets/handshake-menu.svg"> <span>Políticas de privacidade</span></li>
                    </a>
                    <a href="/reclamacao" class="reclamacao">
                        <li> <img src="assets/location-menu.svg"> <span>Livro de reclamações</span></li>
                    </a>
                </ul>
            </div>
        </div>
        
    </div>

    <script>
        
    </script>

`;

class debliwuimenu extends HTMLElement {

    constructor(route) {
        super(route);
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(debliwui_menu.content.cloneNode(true));
        this.route = route;
    }

    fechar(esse) {
        let container = esse.shadowRoot.querySelector('.container');

        if (container.style.display == "none") {
            container.style.display = "block";
        } else {
            container.style.display = "none";
        }
    }
    routes = {
    404: "/pages/404.html",
    "/": "/pages/inicio.html",
    "/home": "/pages/home.html",
    "/reclamacao": "/pages/reclamacao.html",
    "/privacidade": "/pages/privacidade.html",
    "/conta": "/pages/conta.html",
    "/definicoes": "/pages/definicoes.html"
}

handleLocation = async () => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    
    const route = routes[path] || routes[404];
    const html = await fetch(route).then(function(data){
        var res = data.text();
        res.then(function(ui){
            document.querySelector(".corpo").innerHTML = ui;
            if (path == "/reclamacao") {
                loader.abrir();
                setTimeout(function () {
                    Funcoes.reclamou();
                    loader.fechar();
                }, 1000);

            }else{
                
            }

        
            if (hash == "") {
                
            }
            if (hash == "#chamarotaxi") {
                
            }

            if (path == "/home") {
                loader.abrir();
                
                var slide = new debliwuislideimg($, ['<img src="pub.png" alt="">'], mostrarquantos = 1, pager = false, speed = 800, pause = 2000)
                document.querySelector(".corpo").prepend(slide);   
                setTimeout(function () {

                    

                    loader.fechar();
                }, 1000);
            }
            if (path == "/conta") {
                loader.abrir();
                
                setTimeout(function () {

                    Requests.verConta();

                    loader.fechar();
                }, 1000);
            }
        })
    })
    

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
        var esse = this;

        var route = this.getAttribute('route');
        this.shadowRoot.querySelector('.aciona-menu').addEventListener("click", function () {
            let container = esse.shadowRoot.querySelector('.conteudo');

            if (container.style.display == "none") {
                container.style.display = "block";
            } else {
                container.style.display = "none";
            }
        });
        this.shadowRoot.querySelector('.backdrop').addEventListener("click", function () {
            let container = esse.shadowRoot.querySelector('.conteudo');

            if (container.style.display == "none") {
                container.style.display = "block";
            } else {
                container.style.display = "none";
            }
        });
        let lis = this.shadowRoot.querySelectorAll('li');
        lis.forEach(element => {
            element.addEventListener("click", function () {
                let container = esse.shadowRoot.querySelector('.conteudo');

                if (container.style.display == "none") {
                    container.style.display = "block";
                } else {
                    container.style.display = "none";
                }
            });
        });

        this.shadowRoot.querySelector('.home').addEventListener("click", function (event) {
            event = event || window.event;
            event.preventDefault();
            window.history.pushState({}, "", "/" + (this.href).split("/")[3]);
            esse.handleLocation(esse.routes);
        });
        this.shadowRoot.querySelector('.conta').addEventListener("click", function (event) {
            event = event || window.event;
            event.preventDefault();
            window.history.pushState({}, "", "/" + (this.href).split("/")[3]);
            esse.handleLocation(esse.routes);
        });
        this.shadowRoot.querySelector('.privacidade').addEventListener("click", function (event) {
            event = event || window.event;
            event.preventDefault();
            window.history.pushState({}, "", "/" + (this.href).split("/")[3]);
            esse.handleLocation(esse.routes);
        });
        this.shadowRoot.querySelector('.reclamacao').addEventListener("click", function (event) {
            event = event || window.event;
            event.preventDefault();
            window.history.pushState({}, "", "/" + (this.href).split("/")[3]);
            esse.handleLocation(esse.routes);
        });
        this.shadowRoot.querySelector('.go-definicoes').addEventListener("click", function (event) {
            let container = esse.shadowRoot.querySelector('.conteudo');

            if (container.style.display == "none") {
                container.style.display = "block";
            } else {
                container.style.display = "none";
            }

            event = event || window.event;
            event.preventDefault();
            window.history.pushState({}, "", "/" + (this.href).split("/")[3]);
            esse.handleLocation(esse.routes);
        });


        this.shadowRoot.querySelector('.sair').addEventListener("click", function (event) {
            localStorage.clear();
            location.href = ".";
        });
    }

}
window.customElements.define('debliwui-menu', debliwuimenu)