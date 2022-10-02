import {InherentLightningSystem} from "./apps/inherentLightningSystem.js"
import {SomeCosmeticChanges} from "./apps/someCosmeticChanges.js"
import {log, isCurrentUser} from "./apps/utils.js";
import {CombatImprovement} from "./apps/combatImprovement.js";
import {Settings} from "./apps/settings.js";

export class KroemelsLittleHelper {
    static logLevel = true;
    static name = "kroemels-little-helper";

    static _onItemEquip(item, actor, equipped) {
        InherentLightningSystem.onItemEquip(item, actor, equipped);
    }

    static async _onRenderChatMessage(chatMessage, $html, message) {
        await SomeCosmeticChanges.onRenderChatMessage(chatMessage, $html, message);
    }

    static init() {
        log(`Initializing`);
        InherentLightningSystem.setup();
        SomeCosmeticChanges.setup();
        CombatImprovement.setup();

        Hooks.on('updateItem', async (item, changes, data, userID) => {
            if (!isCurrentUser(userID)) return;
            if (changes?.system?.equipped === undefined) return;
            KroemelsLittleHelper._onItemEquip(item, item.parent, changes?.system?.equipped);
        });
        Hooks.on('createCombatant', async (combatant, changes, userID) => {
            if (!isCurrentUser(userID)) return;
            await CombatImprovement.onCreateCombatant(combatant);
        });

        Hooks.on('createCombat', async (combat, changes, userID) => {
            if (!isCurrentUser(userID)) return;
            await CombatImprovement.onCreateCombat(combat, changes);
        });

        Hooks.on("renderSettingsConfig", (app, html) => {
            Settings.onRender(html);
        });

        Hooks.on('renderChatMessage', KroemelsLittleHelper._onRenderChatMessage);
    }
}

Hooks.once('init', async function () {
    KroemelsLittleHelper.init();
});
