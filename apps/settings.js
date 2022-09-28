import {KroemelsLittleHelper} from "../main.js";

export class Settings {
	static registerBoolean(key, settings = { scope: 'world', default: 'true'}) {
		game.settings.register(KroemelsLittleHelper.name, key, {
			name: game.i18n.localize(`${KroemelsLittleHelper.name}.settings.${key}.name`),
			hint: game.i18n.localize(`${KroemelsLittleHelper.name}.settings.${key}.hint`),
			scope: settings.scope,
			config: true,
			default: settings.default,
			type: Boolean,
		});
	}

	static get = key => {
		return game.settings.get(KroemelsLittleHelper.name, key);
	};

	static onRender($html) {
		// TODO folders
		//$('<div>').addClass('form-group group-header').html(i18n("MonksTokenbar.TokenbarSettings")).insertBefore($('[name="monks-tokenbar.allow-player"]').parents('div.form-group:first'));
	}
}
