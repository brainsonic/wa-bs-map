// Chargement de la lib JS de WA
import { } from "https://unpkg.com/@workadventure/scripting-api-extra@^1";

//Prompt des zones
let escaliers;
let welcome;

let msgGuillaume;
let msgFlavien;
let msgBrice;
let msgCyril;

let userWaId;
let userPseudo;
let userName;
let userLastname;
let userEmail;
let userScore;

let is_first_quest_achieved = false;
let is_second_quest_achieved = false;
let is_third_quest_achieved = false;

let is_registered = true;

WA.onInit().then(() => {
    userPseudo = WA.player.name;
    userWaId = WA.player.id;
    WA.player.state.score = 0;
    userScore = WA.player.state.score;
    // WA.player.setOutlineColor(255, 153, 51);
    // WA.chat.sendChatMessage('Hello world', 'Mr Robot');
});

////////// WEBSOCKET //////////

const port = 8000;
// const socket = new WebSocket(`ws://localhost:${port}`);
const socket = new WebSocket(`wss://workadventure-ws-bs.herokuapp.com`);

// Envoi de données JSON lorsque la connexion est ouverte
socket.onopen = function () {
    console.log("WebSocket opened !");
    const data = {
        action: "instantiate",
        wa_id: WA.player.id
    }
    socket.send(JSON.stringify(data));
};
  
// Réception de données JSON
socket.onmessage = async function (event) {
    const data = JSON.parse(event.data);
    if (data.action === "instantiate" && data.success === true) {
        userScore = data.score;
        is_first_quest_achieved = data.quest_1;
        is_second_quest_achieved = data.quest_2;
        is_third_quest_achieved = data.quest_3;
        is_registered = data.is_registered;

        // console.log("Here -> " + is_first_quest_achieved + is_second_quest_achieved + is_registered);

        let formWebsite;

        if (is_registered === false) {
            formWebsite = await WA.nav.openCoWebSite('https://nft-bs.s3.amazonaws.com/typeform.html', true, "", 50, 1, false, false);
        }

        // Close the popup when we leave the zone.
        WA.room.onLeaveLayer("_register_form").subscribe(() => {
            if (is_registered === false) {
                formWebsite.close();
            }
        })
    }
};

socket.onclose = function() {
    console.log('Connexion WebSocket fermée');
};

WA.room.onEnterLayer("_website_perso_guillaumeM_tribune").subscribe(() => {
    msgGuillaume = WA.ui.openPopup("messageGuillaume", "Guillaume Mikowski : 'Norme ISO 20121, on nous prend vraiment pour des cons ! Je vous en parle sur Linkedin.''", [{
        label: "Je veux la lire",
        className: "primary",
        callback: (popup) => {
            WA.nav.openTab("https://www.linkedin.com/pulse/norme-iso-20121-nous-prend-vraiment-pour-des-cons-mikowski-/");
        }
    }]);

});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("_website_perso_guillaumeM_tribune").subscribe(() => {
    msgGuillaume.close();
})

///////////////////////////////////////////////

WA.room.onEnterLayer("_website_heroes").subscribe(() => {
    msgBrice = WA.ui.openPopup("LabMessage", "Bienvenue dans le lab Heroes ! Ici, on fabrique les talents pour renforcer les équipes de nos clients.", [{
        label: "Génial, je veux en savoir plus !",
        className: "primary",
        callback: (popup) => {
            WA.nav.openTab("https://heroes.brainsonic.com/");
        }
    }]);

});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("_website_heroes").subscribe(() => {
    msgBrice.close();
})

///////////////////////////////////////////////

WA.room.onEnterLayer("_website_cyril").subscribe(() => {
    msgCyril = WA.ui.openPopup("msgCyril", "Salut, c'est Cyril. Ici, je vous propose une sélection des meilleurs livres consacrés au marketing. Revenez régulièrement, on met à jour toutes les semaines !", [{
        label: "Carrément !",
        className: "primary",
        callback: (popup) => {
            WA.nav.openTab("https://cdhenin.notion.site/Livres-La-s-lection-du-p-le-Editorial-0b58151e539a4895936e62d3aabc2b7d");
        }
    }]);

});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("_website_cyril").subscribe(() => {
    msgCyril.close();
})

///////////////////////////////////////////////

WA.room.onEnterLayer("_website_perso_flav").subscribe(() => {
    msgFlavien = WA.ui.openPopup("messageFlavien", "Flavien Lefort : Evénement digital, ce que 20 ans (ou presque) nous ont appris - à lire sur Linkedin", [{
        label: "Je veux la lire",
        className: "primary",
        callback: (popup) => {
            WA.nav.openTab("https://www.linkedin.com/pulse/ev%C3%A9nement-digital-ce-que-20-ans-ou-presque-nous-ont-appris-lefort/?originalSubdomain=fr");
        }
    }]);
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("_website_perso_flav").subscribe(() => {
    msgFlavien.close();
})

///////////////////////////////////////////////

WA.room.onEnterLayer("_prompt_escaliers").subscribe(() => {
    escaliers = WA.ui.openPopup("promptEscaliers", "Toutes nos excuses, le 1er étage est en travaux ! Revenez un peu plus tard.", [{
        label: "Tant pis",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    }]);
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("_prompt_escaliers").subscribe(() => {
    escaliers.close();
})

///////////////////////////////////////////////

WA.room.onEnterLayer("_prompt_welcome").subscribe(() => {
    welcome = WA.ui.openPopup("promptWelcome", "Bonjour " + userPseudo + ", et bienvenue chez Brainsonic ! RDV à notre accueil pour obtenir quelques conseils pratiques !", [{
        label: "J'ai compris !",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();

        }
    }]);
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("_prompt_welcome").subscribe(() => {
    welcome.close();
})

///////////////////////////////////////////////

let queteBegin;

WA.room.onEnterLayer("_quete_begin").subscribe(() => {
    if (!is_first_quest_achieved) {
        queteBegin = WA.ui.openPopup("queteBegin", "Aventurier " + userPseudo + ", BrainsoMinion s'est caché quelque part dans l'agence, retrouve le pour remporter des BrainsoPoints !", [{
            label: "Compris !",
            className: "primary",
            callback: (popup) => {
                // Close the popup when the "Close" button is pressed.
                popup.close();
            }
        }]);
    }
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("_quete_begin").subscribe(() => {
    if (!is_first_quest_achieved) {
        queteBegin.close();
    }
})

///////////////////////////////////////////////

let brainsoMinion;

WA.room.onEnterLayer("_brainso_minion").subscribe(() => {
    if (!is_first_quest_achieved) {
        userScore += 5;
        is_first_quest_achieved = true;

        let data = {
            action: "update_score",
            wa_id: WA.player.id,
            new_score: userScore
        }
        socket.send(JSON.stringify(data));

        brainsoMinion = WA.ui.openPopup("brainsoMinion", "Bien joué " + userPseudo + ", tu viens de remporter 5 BrainsoPoints !"
                                                        + "\n Tu as maintenant " + userScore + " BrainsoPoints !"
                                                        + "\n Un autre personnage t'attends en dehors de l'agence...", [{
            label: "Super !",
            className: "primary",
            callback: (popup) => {
                // Close the popup when the "Close" button is pressed.
                popup.close();
            }
        }]);

        data = {
            action: "update_quest",
            wa_id: WA.player.id,
            quest_nbr: 1
        }
        socket.send(JSON.stringify(data));
    }
    else {
        if (!is_second_quest_achieved) {
            brainsoMinion = WA.ui.openPopup("brainsoMinion", userPseudo + ", n'essaye pas de gratter des BrainsoPoints, tu as déjà trouvé BrainsoMinion..."
                                                                    + "\n Il te reste toujours un personnage à trouver en dehors de l'agence !", [{
                label: "Bon ok !",
                className: "primary",
                callback: (popup) => {
                    // Close the popup when the "Close" button is pressed.
                    popup.close();
                }
            }]);
        }
        else {
            brainsoMinion = WA.ui.openPopup("brainsoMinion", userPseudo + ", n'essaye pas de gratter des BrainsoPoints, tu as déjà trouvé BrainsoMinion..."
                                                        + "\n Il te reste un dernier personnage à découvrir...", [{
                label: "Bon ok !",
                className: "primary",
                callback: (popup) => {
                    // Close the popup when the "Close" button is pressed.
                    popup.close();
                }
            }]);
        }
    }
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("_brainso_minion").subscribe(() => {
    brainsoMinion.close();
})

///////////////////////////////////////////////

let brainsoBatman;

WA.room.onEnterLayer("_brainso_batman").subscribe(() => {
    if (is_first_quest_achieved && !is_second_quest_achieved) {
        userScore += 10;
        is_second_quest_achieved = true;

        let data = {
            action: "update_score",
            wa_id: WA.player.id,
            new_score: userScore
        }
        socket.send(JSON.stringify(data));

        brainsoBatman = WA.ui.openPopup("Batman", "Bien joué " + userPseudo + ", tu viens de remporter 10 BrainsoPoints !"
                                                + "\n Tu as maintenant " + userScore + " BrainsoPoints !"
                                                + "\n Il te reste un dernier personnage à découvrir...", [{
            label: "Super !",
            className: "primary",
            callback: (popup) => {
                // Close the popup when the "Close" button is pressed.
                popup.close();
            }
        }]);

        data = {
            action: "update_quest",
            wa_id: WA.player.id,
            quest_nbr: 2
        }
        socket.send(JSON.stringify(data));
    }
    else {
        brainsoBatman = WA.ui.openPopup("Batman", userPseudo + ", n'essaye pas de gratter des BrainsoPoints, tu as déjà trouvé BrainsoBatman..."
                                                + "\n Il te reste toujours un dernier personnage à trouver !", [{
            label: "Bon ok !",
            className: "primary",
            callback: (popup) => {
                // Close the popup when the "Close" button is pressed.
                popup.close();
            }
        }]);
    }
});

// Close the popup when we leave the zone.
WA.room.onLeaveLayer("_brainso_batman").subscribe(() => {
    brainsoBatman.close();
})

///////////////////////////////////////////////

class Popup {

    close() {};
}
