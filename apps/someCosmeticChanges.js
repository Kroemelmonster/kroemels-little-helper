import {Settings} from "./settings.js";
import {log} from "./utils.js";

export class SomeCosmeticChanges {
    static _name = 'some-cosmetic-changes';

    static setup() {
        Settings.registerBoolean(this._name);
    }

    static isEnabled() {
        return Settings.get(this._name);
    }

    static async onRenderChatMessage(chatMessage, $html, message) {
        if (!this.isEnabled()) return;
        const type = this._getMessageType(message);
        if (type === 'initiative') await this._renderInitiativeRoll(chatMessage, $html);
        else if (['skill', 'check', 'save'].includes(type)) await this._renderRoll(chatMessage, $html);
    }

    static async _renderInitiativeRoll(chatMessage, $html) {
        // initiative Messages just get invisible
        $html.toggle();
    }

    static async _renderRoll(chatMessage, $html) {
        const roll = chatMessage.rolls[0];
        const requestdata = {
            rollName: chatMessage.flavor.replace(/ \(.*/gm, ''),
            total: roll.total
        };
        const token = canvas.tokens?.objects?.children?.find(token => token.id === chatMessage.speaker.token);
        const actor = await fromUuid('Actor.' + chatMessage.speaker.actor);
        if (!token) {
            requestdata.id = chatMessage.speaker.token;
            requestdata.name = chatMessage.speaker.alias;
            requestdata.icon = actor.prototypeToken.texture.src;
        } else {
            requestdata.id = token.id;
            requestdata.name = token.name;
            requestdata.icon = (token.document.texture.src.endsWith('webm') ? token.actor.img : token.document.texture.src);
        }
        const $newHtml = $(await renderTemplate("./modules/kroemels-little-helper/templates/svgthrowchatmsg.html", requestdata));
        $html.find('.flavor-text').remove();
        $newHtml.find(game.user.isGM ? ".player-only" : ".gm-only").remove();
        const $item = $('.item', $newHtml);
        $item.find('.dice-roll').append($html.find('.dice-tooltip'));
        $item.on('click', () => $('.dice-tooltip', $item).toggle());

        $html.find('.message-content').replaceWith($newHtml);
    }


    static _getMessageType(message) {
        const flags = message?.message?.flags;
        return flags?.dnd5e?.roll?.type || (flags?.core?.initiativeRoll ? 'initiative' : '');
    }
}