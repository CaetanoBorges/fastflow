const uiEntrar = `
    <br><br><br>
    <h3>POR FAVOR<br>INSIRA UM NOME</h3><br>
    <br>
    <input type="text" placeholder="NOME" class="form-control" id="nome-mesa"><br>
    <button class="form-control btn btn-outline-danger hvr-bounce-out" style="border-radius: 0;" onclick='Funcoes.verApenasMenu()'>VER APENAS O MENU</button>
    <br><br><br><br>
    <button class="form-control btn btn-danger botao hvr-bounce-out" onclick="Requests.usarMesa()">USAR MESA</button>
`;
const uiMenu = `
   <div id="render">

        
    </div>
`;
const uiSimples = `
   <div id="render">

        <h1>AbrirCamara</h1>
    </div>
`;

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
}

const vaiTela = (route) => {
    window.history.pushState({}, "", route);
    handleLocation();
}


const anima = () => {
    setInterval(function () {
        var itens = document.querySelectorAll('.hvr-bounce-out');
        itens.forEach(function (e) {
            $(e).on("click", function () {
                $(e).animate({ "opacity": "0" }, "fast");
                $(e).animate({ "opacity": "1" }, "fast");
            })
        })
    }, 1000)
}

const routes = {
    404: "/pages/404.html",
    "/": "/pages/inicio.html",
    "/home": "/pages/home.html",
    "/reclamacao": "/pages/reclamacao.html",
    "/privacidade": "/pages/privacidade.html",
    "/conta": "/pages/conta.html",
    "/definicoes": "/pages/definicoes.html",
    "/categoria": "/pages/categoria.html",
    "/mesaIndisponivel": "/pages/mesaIndisponivel.html",
    "/mesas": "/pages/mesas.html",
    "/menu": "/pages/menu.html",
    "/produtos": "/pages/produtos.html"
}

const handleLocation = async () => {
    const path = window.location.pathname;
    const hash = window.location.hash;


    const route = routes[path] || routes[404];
    const html = await fetch(route).then(function (data) {
        var res = data.text();
        res.then(function (ui) {
            document.querySelector(".corpo").innerHTML = ui;

            if (path == "/") {
                menu.fechar();
                var conta = localStorage.getItem("mesa");

                if (conta) {
                    
                    vaiTela("home");
                    return;
                }
                var query = (new URLSearchParams(window.location.search).toString().split("="));
                console.info(hash.split("#")[1]);
                //if(query[0] == "menu"){
                    //vaiTela("menu#"+hash.split("#")[1]);
                    //return;
                //}
                if(hash.split("#")[1]){
                    document.querySelector(".corpo").innerHTML = uiEntrar;
                    loader.abrir();
                    Requests.slidePub();
                    var slide = JSON.parse(localStorage.getItem("slide"));
                    document.querySelector(".corpo").prepend((new debliwuislideimg($, slide)));

                    setTimeout(function () {
                        Requests.entrar();
                        loader.fechar();
                    }, 1000);
                    return;
                }
                
                if((new URLSearchParams(window.location.search).toString().split("=")[0])){
                    document.querySelector(".corpo").innerHTML = uiMenu;
                    Requests.slidePub();
                    loader.abrir();
                    var slide = JSON.parse(localStorage.getItem("slide"));
                    document.querySelector(".corpo").prepend((new debliwuislideimg($, slide)));
                    setTimeout(function () {
                        Requests.verMenu((new URLSearchParams(window.location.search).toString().split("=")[0]));
                        loader.fechar();
                    }, 1000);
                    return;
                }else{
                    document.querySelector(".corpo").innerHTML = uiSimples;
                }
            }
            if (path == "/reclamacao") {
                loader.abrir();

                setTimeout(function () {

                    Funcoes.reclamou();

                    loader.fechar();
                }, 1000);
            }


            if (hash == "") {

            }
            if (hash == "#categoria") {

            }

            if (path == "/home") {
                Requests.slidePub();
                Requests.verProdutos();
                loader.abrir();
                menu.abrir();
                var slide = JSON.parse(localStorage.getItem("slide"));
                document.querySelector(".corpo").prepend((new debliwuislideimg($, slide)));
                setTimeout(function () {



                    loader.fechar();
                }, 1000);
            }
            if (path == "/menu") {
                menu.fechar();
                Requests.slidePub();
                loader.abrir();
                var slide = JSON.parse(localStorage.getItem("slide"));
                document.querySelector(".corpo").prepend((new debliwuislideimg($, slide)));
                setTimeout(function () {
                    Requests.verMenu(hash.split("#")[1]);
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
            if (path == "/categoria") {
                loader.abrir();
                setTimeout(function () {
                    if (hash) {

                        Funcoes.renderProduto(hash.split("#")[1]);

                    }



                    loader.fechar();
                }, 1000);

            }
            if (path == "/produtos") {
                loader.abrir();
                setTimeout(function () {
                    if (hash) {

                        Funcoes.mostraProduto(hash.split("#")[1]);

                    }



                    loader.fechar();
                }, 1000);

            }
            if (path == "/mesaIndisponivel") {
                loader.abrir();
                setTimeout(function () {


                    loader.fechar();
                }, 1000);

            }
            if (path == "/mesas") {
                loader.abrir();
                setTimeout(function () {

                    Requests.verMesas(((window.location.hash).split("#")[1]));
                    loader.fechar();
                }, 1000);

            }

        });

    })


}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
//anima();