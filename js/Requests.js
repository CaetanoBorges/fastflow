var Requests = {
    esse : this,
    "verProdutos": function () {
        var restaurante = localStorage.getItem("restaurante");
        $.get(api + "/verProdutos.php",{restaurante:restaurante}).done(function (data) {
            console.log(data);
            var res = JSON.parse(data);
            if (res.ok) {
                tabelaProdutos.setItem("produtos", res.payload);
            }
        })
    },

    "entrar": function () {
        loader.abrir();
        const hash = window.location.hash;
        var num = hash.split("#")[1];
        var restaurante = Funcoes.urlParam();
        localStorage.setItem("restaurante",restaurante);
        this.verProdutos();
        $.get(api + "/entrar.php", { mesa: num, restaurante: restaurante }).done(function (data) {
            console.log(data);
            var res = JSON.parse(data);
            if (res.ok) {
                notificacao.sms("Insira o nome para usar a mesa...");
                localStorage.setItem("restaurante",restaurante);
                loader.fechar();
            } else {
                console.error(hash);
                
                vaiTela("/mesaIndisponivel#"+restaurante);
                loader.fechar();
            }
        })
    },
    "usarMesa": function () {

        const hash = window.location.hash;
        var num = hash.split("#")[1];
        var restaurante = Funcoes.urlParam();
        var nome = document.querySelector("#nome-mesa").value;
        var restaurante = localStorage.getItem("restaurante");
        if (nome.length < 6) {
            notificacao.sms("O nome deve ter pelo menos 6 caracteres", 1)
            return;
        }
        loader.abrir();
        $.get(api + "/usarMesa.php", { mesa: num, nome: nome, restaurante: restaurante }).done(function (data) {
            console.log(data);
            var res = JSON.parse(data);
            if (res.ok) {
                localStorage.setItem("conta", res.payload.idconta);
                localStorage.setItem("mesa", res.payload.mesa);
                localStorage.setItem("descricao", res.payload.descricao);
                localStorage.setItem("quando", res.payload.quando);
                localStorage.setItem("nome", nome);
                localStorage.setItem("fechado", "");
                localStorage.setItem("restaurante",restaurante);
                setTimeout(function () {
                    menu.shadowRoot.querySelector(".user p").innerHTML = nome + '<br> Mesa ' + num;
                }, 1000)
                vaiTela("/home");
                loader.fechar();
            } else {
                loader.fechar();
            }
        })
    },

    "reclamar": function () {

    },
    "pullingPedidos": function () {
        var esse = this;
        setInterval(function () {
            var conta = localStorage.getItem("conta")
            var restaurante = localStorage.getItem("restaurante");
            $.get(api + "/pullingPedido.php", { conta: conta, restaurante: restaurante}).done(function (data) {
                
                
                //console.log(data);

                var contaatual = localStorage.getItem("contaatual");
                var contanova = data;

                if(contaatual != contanova){
                    notificacao.sms("Conta atualizada");
                    $(".conta").html("");
                    esse.verConta();
                    tabelaPedidos.setItem("contaatual",JSON.parse(contanova));
                    localStorage.setItem("contaatual",(contanova));
                    
                }
                //var res = JSON.parse(data);
                
            })
        }, 5000)
    },
    "pullingConta": function () {
        setInterval(function () {
            var num = localStorage.getItem("mesa")
            var restaurante = localStorage.getItem("restaurante");
            $.get(api + "/pullingMesa.php", { mesa: num,  restaurante: restaurante }).done(function (data) {
                console.log(data);
                var res = JSON.parse(data);
                if (res.ok) {
                    if (res.payload.ocupada == "0") {
                        localStorage.removeItem("conta");
                        localStorage.removeItem("mesa");
                        localStorage.removeItem("descricao");
                        localStorage.removeItem("quando");
                        localStorage.removeItem("fechado");
                        localStorage.removeItem("reclamou");
                        tabelaCarrinho.clear();
                        vaiTela("/")
                        loader.fechar();
                    }
                } else {
                    loader.fechar();
                }
            })
        }, 5000)
    }
    ,
    "pedir": function () {
        tabelaCarrinho.length().then(function (numberOfKeys) {

            setTimeout(function () {

                var zero = [];
                tabelaCarrinho.iterate(function (valor, chave, iterationNumber) {
                    console.log(valor, chave, iterationNumber);
                    //REVER ITEMNUM
                    valor.itemnum = Date.now();
                    //------
                    zero.push(valor)
                    if (iterationNumber == numberOfKeys) {
                        return zero;
                    }
                }).then(function (zero) {
                    console.log(zero);
                    loader.abrir();
                    var total = document.querySelector(".carrinhoTotal").innerHTML;
                    var itens = JSON.stringify(zero);
                    var conta = localStorage.getItem("conta");
                    var restaurante = localStorage.getItem("restaurante");
                    $.post(api + "/pedir.php", { conta: conta, itens: itens, total: total, restaurante: restaurante }).done(function (data) {
                        console.log(data);
                        var res = JSON.parse(data);
                        if (res.ok) {
                            notificacao.sms("O seu pedido esta a ser processado")
                            tabelaCarrinho.clear();
                            Funcoes.carrinho();
                            loader.fechar();
                        } else {
                            loader.fechar();
                        }
                    })
                })
            }, 1000)
        }).catch(function (err) {

            console.log(err);
        });
    },

    "verConta": function () {
        var conta = localStorage.getItem("conta");
        var restaurante = localStorage.getItem("restaurante");
        $.get(api + "/verConta.php", { conta: conta, restaurante:restaurante }).done(function (data) {
            var res = JSON.parse(data);
            console.log(res);
            ((res.payload)).forEach(element => {
                var itens = (element.itens);
                var htmlItem = $("<div></div>") ;
                itens.forEach(elemento => {
                //console.log(htmlItem);
                    var html = $(`<div class="card  mb-1" style="position: relative;border-radius: 0;display:block;">
                        <div style="padding:2px 5px;">
                            <div class="row d-flex justify-content-between align-items-center" style="background:none;">
                                <div class="col-md-3 col-lg-3 col-xl-3" style="margin:0">
                                    <p class="lead fw-normal" style="font-size:15px;margin:0">${(elemento.nome)}</p>
                                </div>
                                <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                    <div style="display:flex;justify-content: space-between;align-items: center;margin:0;font-size:14px">
                                        <h5 class="mb-0" style="font-weight:normal;margin:0;font-size:15px;">${(elemento.preco)}</h5>
                                        <h5 class="mb-0 total" style="margin:0;font-size:15px;">${(elemento.qtd)}</h5>
                                        <h5 class="mb-0 total" style="margin:0;font-size:15px;">${(elemento.total)}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>`)[0];

                    htmlItem.append(html);
                });
                var aceite = (element.aceite) ? "#0dcaf0" : "#ffc107";
                var aceiteLabel = (element.aceite) ? "Aceite" : "";
                var pedido = $(`<div style="display:block;width:100%;padding:1%;border:1px solid #eaeaea;margin:20px 0;background:${aceite}">
                        <h3 style="float:right;font-size:15px;font-weight:bold;">${(element.total)}</h3>
                        <h3 style="text-align:left;font-size:15px;margin:0">Itens: ${(itens.length)}</h3>
                        <h3 style="text-align:left;font-size:10px;margin:0">${(element.quando)}</h3>
                </div>`);
                pedido.append(htmlItem);

                $(".conta").append(pedido);
            });

        })
    },
    "fazReclamacao": function () {
        
            var telefone = document.querySelector("#rec_telefone").value;
            var email = document.querySelector("#rec_email").value;
            var detalhes = document.querySelector("#rec_detalhes").value;
            var nome = localStorage.getItem("nome");

            if(telefone.length < 5 || email.length < 5 || detalhes.length <5 ){
                notificacao.sms("Preenca todos campos.");
                return;
            }

            $.post(api + "/fazReclamacao.php", { telefone: telefone, email:email, detalhes: detalhes, nome: nome }).done(function (data) {
                console.log(data);
                var res = JSON.parse(data);
                if (res.ok) {
                   localStorage.setItem("reclamou","sim");
                   notificacao.sms("A sua reclamacao esta a ser processada.");
                   vaiTela("home");
                } else {
                    loader.fechar();
                }
            })
        
    },
    "verMesas": function(res){
        $.get(api + "/verMesas.php", { usuario: res }).done(function (data) {
                console.log(data);
                var res = JSON.parse(data);
                if (res.ok) {
                    const hash = window.location.hash;
                    var usuario = hash.split("#")[1];

                    (res.payload).forEach( (element) => {
                        console.log(element);
                        var vip = Number(element.vip) ? "VIP" : "";
                        if(Number(element.ocupada)){
                            var el = $(`<div class="mesas">
                                            
                                            <p class="vipmesa">${vip}</p>
                                            <p class="numeromesa">${element.numeromesa}</p>
                                        
                                    </div>`)
                        }else{
                            var el = $(`<div class="mesas">
                                            <a href="/?${usuario}#${element.numeromesa}">
                                            <p class="vipmesa">${vip}</p>
                                            <p class="numeromesa">${element.numeromesa}</p>
                                        <a>
                                    </div>`)
                        }
                        
                        $("#render").append(el);
                    })
                    //localStorage.setItem("reclamou","sim");
                    //notificacao.sms("A sua reclamacao esta a ser processada.");
                   
                } else {
                    loader.fechar();
                }
            })
    }
}