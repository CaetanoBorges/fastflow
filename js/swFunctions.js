var deferredPrompt;
var swRegistration;
if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            swRegistration = registration;
            swRegistration.sync.register('sincronizar');
            //console.log(`Service Worker registered! Scope: ${registration.scope}`);
        })
        .catch(err => {
            console.log(`Service Worker registration failed: ${err}`);
        });

}
// This variable will save the event for later use.

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevents the default mini-infobar or install dialog from appearing on mobile
    e.preventDefault();
    // Save the event because you'll need to trigger it later.
    deferredPrompt = e;
    // Show your customized install prompt for your PWA
    // Your own UI doesn't have to be a single element, you
    // can have buttons in different locations, or wait to prompt
    // as part of a critical journey.
    //showInAppInstallPromotion();
});

async function instalar() {
    if (!deferredPrompt) {
        notificacao("A aplicação já está instalada");
        swRegistration.showNotification("A aplicação já está instalada", { body: "Muito bem", icon: "_icones/ico.png" });
        return;
    }
    deferredPrompt.prompt();

    var outcome = await deferredPrompt.userChoice;
    // The deferredPrompt can only be used once.
    deferredPrompt = null;
    //console.log(outcome);
    // Act on the user's choice
    if (outcome.outcome === 'accepted') {
        notificacao("Instalação bem sucedida!");
        swRegistration.showNotification("Instalação bem sucedida!", { body: "Muito bem", icon: "_icones/ico.png" });
    } else if (outcome.outcome === 'dismissed') {
        notificacao("Precisa instalar a aplicação para melhor uso.");
        swRegistration.showNotification("Precisa instalar a aplicação para melhor uso.", { body: "oOh", icon: "_icones/ico.png" });
    }
}

function permissaoNotificacao() {
    var res = Notification.requestPermission();
    res.then(function(e) {
        if (e == "granted") {
            swRegistration.showNotification("Já tem as notificações ativadas", { body: "Muito bem", icon: "_icones/ico.png" });
            tbUser.getItem("notificacao").then(function(not) {
                if (not) {
                    return;
                }
                registraNotificacao();
            })
            return
        }
        notificacao("Precisa ativar as notificações com urgencia");
    })

}

function mostraNotificacao(res) {
    swRegistration.showNotification("Notificacao", res);
}

var push;
var pushSubscribe;

function registraNotificacao() {
    let applicationServerKey = "BEFaVrgobTOVp0MFfQi_m9LkfkOi-J5p1hvDPxgypixHLlbXxgT277aqx3YNkVdPyADGTHgQ-fZBQNVceKjZvLA";
    const options = {
        userVisibleOnly: true,
        applicationServerKey,
    };

    swRegistration.pushManager.subscribe(options)
        .then((pushSubscription) => {
            // handle subscription

            push = pushSubscription.toJSON();
            pushSubscribe = { endpoint: push.endpoint, auth: push.keys.auth, p256dh: push.keys.p256dh }
            tbUser.getItem("token").then(function(token) {
                var user = '';
                if (token) {
                    user = token;
                }
                $.post("_API/push/add.php", { token: user, endpoint: push.endpoint, auth: push.keys.auth, pdh: push.keys.p256dh }).done(function(res) {
                    tbUser.setItem("notificacao", true);
                })
            })
        });

}

function registaUserNaNotificacao() {
    tbUser.getItem("notificacao").then(function(status) {
        if (status) {
            tbUser.getItem("token").then(function(token) {
                if (token) {
                    registraNotificacao();
                }
            })
        }
    })
}

tbUser.getItem("install").then(function(e) {
    if (e === true) {
        $("body").css({ overflow: "auto" });
        $(".splash-container").hide();
        getProdutos();
        getCategorias();
        getSlide();
        getSugestoes();
        getCestaBasica();
        return
    }

    getProdutos();
    getCategorias();
    getSlide();
    getSugestoes();
    getCestaBasica();

    tbUser.setItem("install", true).then(function(e) {
            setTimeout(function() {
                tbUser.length().then(function(numberOfKeys) {
                    // Outputs the length of the database.
                    if (numberOfKeys > 1) {
                        location.reload();
                    } else {
                        setTimeout(function() {
                            location.reload();
                        }, 3000)
                    }

                })
            }, 3000);
        })
        //var user = getUser();
        //var compras = getCompras();


})

/*
setTimeout(function() {
    tbUser.getItem("install").then(function(e) {
        if (e === true) {
            return
        }
        tbUser.setItem("install", true).then(function(i) {
            location.reload();
        })

    })
}, 5000)
*/


registaUserNaNotificacao();