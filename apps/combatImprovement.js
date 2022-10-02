import {timeout} from "./utils.js";
import {Settings} from "./settings.js";

export class CombatImprovement {
    static _name = 'combat-improvement';

    static setup() {
        Settings.registerBoolean(this._name);
    }

    static isEnabled() {
        return Settings.get(this._name);
    }
    static async onCreateCombatant(combatant) {
        if (!this.isEnabled()) return;
        if (!combatant.isNPC) return;
        if (combatant.combat.started) return;
        // For NPC we just roll immediately, if the combat did not start already
        combatant.rollInitiative();
    }

    static async onCreateCombat(combat) {
        if (!this.isEnabled()) return;
        if (combat.started) return;
        await timeout(1000);
        const pcTokens = game.combat.combatants.filter((combatant) => !combatant.isNPC);
        const pcTokenNames = pcTokens.map((combatant) => ({'token': combatant.token.name}))
        game.MonksTokenBar.requestRoll(pcTokenNames, {
            request:'misc:init',
            silent:false,
            fastForward:false,
            rollMode:'roll'
        });
    }
}