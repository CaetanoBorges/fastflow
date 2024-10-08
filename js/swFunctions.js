var deferredPrompt;
var swRegistration;
if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            swRegistration = registration;

        })
        .catch(err => {
            console.log(`Service Worker registration failed: ${err}`);
        });

}
var logo = localStorage.getItem("logo");
var pathLogo = api + "img/" + logo;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevents the default mini-infobar or install dialog from appearing on mobile
    e.preventDefault();

    deferredPrompt = e;

});

async function instalar() {
    if (!deferredPrompt) {
        notificacao("A aplicação já está instalada");
        swRegistration.showNotification("A aplicação já está instalada", { body: "Muito bem", icon: pathLogo });
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
        swRegistration.showNotification("Instalação bem sucedida!", { body: "Muito bem", icon: pathLogo });
    } else if (outcome.outcome === 'dismissed') {
        notificacao("Precisa instalar a aplicação para melhor uso.");
        swRegistration.showNotification("Precisa instalar a aplicação para melhor uso.", { body: "oOh", icon: pathLogo });
    }
}

function permissaoNotificacao() {
    var res = Notification.requestPermission();
    res.then(function (e) {
        if (e == "granted") {
            swRegistration.showNotification("Já tem as notificações ativadas", { body: "Muito bem", icon: pathLogo });
            $(menu.shadowRoot.querySelector(".sair")).html("Notificações ativas").css({color:"#0022ff"});
            var not = localStorage.getItem("notificacao");
            if(not){
                return;
            }
            registraNotificacao();
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
            pushSubscribe = { endpoint: push.endpoint, auth: push.keys.auth, p256dh: push.keys.p256dh };
            var restaurante = localStorage.getItem("restaurante");
            $.post(api + "/ativarPush.php", { restaurante: restaurante, endpoint: push.endpoint, auth: push.keys.auth, pdh: push.keys.p256dh }).done(function (res) {
                console.error(res);
                localStorage.setItem("notificacao", 1);
            });
        });

}

function registaUserNaNotificacao() {
    var status = localStorage.getItem("notificacao");
    if (status) {
        var restaurante = localStorage.getItem("restaurante");
        if (restaurante) {
            registraNotificacao();
        }
    }
}


registaUserNaNotificacao();