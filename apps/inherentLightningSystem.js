import * as u from "./utils.js";
import {Settings} from "./settings.js";

export class InherentLightningSystem {
    static _name = 'inherent-lightning-system';
    static _settings = [];
    static _lightOffSetting = {
        dim: 0,
        bright: 0,
    };

    static setup() {
        Settings.registerBoolean(this._name);
        this.addLightning("Torch", {
            dim: 40,
            bright: 20,
            color: "#eca222",
            angle: 360,
            alpha: 0.05,
            animation: {
                intensity: 5,
                reverse: false,
                speed: 5,
                type: "flame"
            }
        });
    }

    static isEnabled() {
        return Settings.get(this._name);
    }

    static addLightning(name, settings) {
        if (this._settings.find(setting => setting.name === name))
            return u.error(`can't add ${name} to lighting settings as it already exists`);
        this._settings.push({name, data: settings})
    }

    static onItemEquip(item, actor, equipped) {
        if (!this.isEnabled()) return;
        const setting = this._settings.find(setting => setting.name === item.name);
        if (!setting) return;
        u.getAllTokensOfActor(actor._id)
            .forEach(token => {
                token.document.update({
                    light: (equipped ? setting.data : this._lightOffSetting)
                });
            });
    }
}