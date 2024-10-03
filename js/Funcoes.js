var Funcoes = {
    esse: this,
    "mostraProduto": function (categoria) {
        document.querySelector(".categoria").innerHTML = categoria;
        tabelaProdutos.getItem("produtos").then(function (dados) {
            console.info(api);
            (dados[categoria]).forEach(element => {
                console.info(element);
                var item = $(`<div class="card  mb-4" style="position: relative;border-radius: 0;">
                        <div class="card-body" style="padding:5px;">
                            <div class="row d-flex justify-content-between align-items-center">
                            <div class="col-md-3 col-lg-3 col-xl-3">
                                <img src="${(api)}/img/${(element.img)}" style="width:100px">
                                <p class="lead fw-small mb-2" style="float:right;font-size:13px">${(element.nome)}</p>
                            </div>
                            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                <h5 class="mb-0 fw-normal" style="position:absolute;bottom:45px;right:5px;">${(element.preco)} <span style="font-weight:lighter">AOA</span></h5>
                            </div>
                            </div>
                        </div>
                        </div>             
                        `);

                document.querySelector("section").append(item[0]);

            });
        })

    },



    "renderProduto": function (categoria) {
        document.querySelector(".categoria").innerHTML = categoria;
        tabelaProdutos.getItem("produtos").then(function (dados) {
            console.info(api);
            (dados[categoria]).forEach(element => {
                console.info(element);
                var item = $(`<div class="card  mb-4" style="position: relative;border-radius: 0;">
                        <div class="card-body" style="padding:5px;">
                            <div class="row d-flex justify-content-between align-items-center">
                            <div class="col-md-3 col-lg-3 col-xl-3">
                                <img src="${(api)}/img/${(element.img)}" style="width:100px">
                                <p class="lead fw-small mb-2" style="float:right;font-size:13px">${(element.nome)}</p>
                            </div>
                            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                <h5 class="mb-0 fw-normal" style="position:absolute;bottom:45px;right:5px;">${(element.preco)} <span style="font-weight:lighter">AOA</span></h5>
                            </div>
                            <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                                <button class="btn btn-outline-danger hvr-bounce-out" style="border-radius:0;opacity:.7;position:absolute;bottom:5px;right:5px;"> Add ao pedido</button>
                            </div>
                            </div>
                        </div>
                        </div>
                                        
                        `);

                item[0].querySelector("button").addEventListener("click", function () {
                    console.warn((element.nome))
                    $(this).animate({ "opacity": "0" }, "fast");
                    $(this).animate({ "opacity": "1" }, "fast");
                    tabelaCarrinho.getItem((element.nome)).then(function (dados) {
                        if (dados) {
                            dados.qtd += 1;
                            dados.total = dados.qtd * dados.preco;
                            tabelaCarrinho.setItem((element.nome), dados);
                            notificacao.sms("(+1) " + element.nome + "<br>Agora são " + dados.qtd);
                        } else {
                            tabelaCarrinho.setItem((element.nome), { nome: (element.nome), preco: (element.preco), qtd: 1, total: (element.preco) });
                            notificacao.sms("Adicionou (1) " + element.nome + " ao carrinho");
                        }
                    })
                })


                document.querySelector("section").append(item[0]);

            });
        })

    },



    //CARRINHO

    carrinho: function () {
        document.querySelector(".section").innerHTML = "";
        tabelaCarrinho.iterate(function (valor, chave, iterationNumber) {
            console.log(valor, chave);
            var item = $(`<div class="card  mb-4" style="position: relative;border-radius: 0;">
                        <div class="card-body" style="padding:5px;">
                            <div class="row d-flex justify-content-between align-items-center">
                            <div class="col-md-3 col-lg-3 col-xl-3">
                                <p class="lead fw-normal mb-2">${(valor.nome)}</p>
                            </div>
                            <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                                <button class="btn btn-info menos hvr-bounce-out" style="border-radius: 0"
                                onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                                -
                                </button>

                                <input id="item_qtd" min="0" name="quantity" value="${(valor.qtd)}" type="number"
                                class="form-control form-control-sm item_qtd" />

                                <button class="btn btn-info mais hvr-bounce-out" style="border-radius: 0"
                                onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                                +
                                </button>
                            </div>
                            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                <div style="display:flex;justify-content: space-between;align-items: center;margin-top:5px">
                                    <h5 class="mb-0" style="font-weight:lighter;">${(valor.preco)}</h5>
                                    <h5 class="mb-0 total">${(valor.total)}</h5>
                                </div>
                            </div>
                            <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                                <button class="btn btn-danger apagar hvr-bounce-out" style="border-radius: 50%;width:20px;height:25px; position: absolute;top:5px;right:5px;"> </button>
                            </div>
                            </div>
                        </div>
                        </div>
                        
        `);

            item[0].querySelector(".mais").addEventListener("click", function () {
                console.warn((valor.nome))
                $(this).animate({ "opacity": "0" }, "fast");
                $(this).animate({ "opacity": "1" }, "fast");
                var qtd = item[0].querySelector("#item_qtd").value;
                tabelaCarrinho.getItem((valor.nome)).then(function (dados) {
                    dados.qtd = qtd;
                    dados.total = qtd * dados.preco;

                    item[0].querySelector(".total").innerHTML = dados.total;
                    return dados;
                }).then(function (dados) {
                    tabelaCarrinho.setItem((valor.nome), dados);
                    Funcoes.carrinhoTotal();
                })
            });
            item[0].querySelector(".menos").addEventListener("click", function () {
                console.warn((valor.nome))
                $(this).animate({ "opacity": "0" }, "fast");
                $(this).animate({ "opacity": "1" }, "fast");
                var qtd = item[0].querySelector("#item_qtd").value;
                tabelaCarrinho.getItem((valor.nome)).then(function (dados) {
                    dados.qtd = qtd;
                    dados.total = qtd * dados.preco;

                    item[0].querySelector(".total").innerHTML = dados.total;
                    return dados;
                }).then(function (dados) {
                    tabelaCarrinho.setItem((valor.nome), dados);
                    Funcoes.carrinhoTotal();
                })
            });
            item[0].querySelector(".item_qtd").addEventListener("change", function () {
                console.warn((valor.nome))
                $(this).animate({ "opacity": "0" }, "fast");
                $(this).animate({ "opacity": "1" }, "fast");
                var qtd = item[0].querySelector("#item_qtd").value;
                tabelaCarrinho.getItem((valor.nome)).then(function (dados) {
                    dados.qtd = qtd;
                    dados.total = qtd * dados.preco;

                    item[0].querySelector(".total").innerHTML = dados.total;
                    return dados;
                }).then(function (dados) {
                    tabelaCarrinho.setItem((valor.nome), dados);
                    Funcoes.carrinhoTotal();
                })
            });
            item[0].querySelector(".apagar").addEventListener("click", function () {
                $(this).animate({ "opacity": "0" }, "fast");
                $(this).animate({ "opacity": "1" }, "fast");
                tabelaCarrinho.removeItem((valor.nome)).then(function () {
                    document.querySelector(".section").innerHTML = '';
                    Funcoes.carrinho();
                })
            });

            document.querySelector(".section").append(item[0]);

        }).then(function () {
            Funcoes.carrinhoTotal();

        })


    },

    carrinhoTotal: function () {
        var zero = Number(0);
        tabelaCarrinho.length().then(function (numberOfKeys) {

            setTimeout(function () {


                tabelaCarrinho.iterate(function (valor, chave, iterationNumber) {
                    console.log(valor, chave, iterationNumber);
                    zero += Number(valor.total)
                    if (iterationNumber == numberOfKeys) {
                        return zero;
                    }
                }).then(function (zero) {
                    if (!zero) {
                        document.querySelector(".carrinhoTotal").innerHTML = 0;
                        document.querySelector(".carrinhoPedir").setAttribute("disabled", "disabled");

                        return;
                    }
                    document.querySelector(".carrinhoTotal").innerHTML = zero;
                    document.querySelector(".carrinhoPedir").removeAttribute("disabled");
                })
            }, 1000)
        }).catch(function (err) {

            console.log(err);
        });

    },

    "reclamou": function () {
        if (localStorage.getItem("reclamou")) {
            document.querySelector(".faz_reclamacao").style.display = "none";
            document.querySelector(".reclamou").style.display = "block";
            return;
        }

        document.querySelector(".faz_reclamacao").style.display = "block";
        document.querySelector(".reclamou").style.display = "none";
    },


    "urlParam": function () {
        const urlParams = new URLSearchParams(window.location.search);
        var para = null;
        if (urlParams.size > 0) {
            para = (urlParams.toString()).split("=")[0];
        }
        var restaurante = localStorage.getItem("restaurante");
        if (restaurante) {
            if (restaurante.length > 10) {
                para =  restaurante
            }
        }
        return para;
    },

    "verApenasMenu": function(){
        var para = this.urlParam();
        vaiTela("/menu#"+para);
    }

}