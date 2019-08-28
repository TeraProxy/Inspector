"use strict"

const DefaultSettings = {
	"enabled": true,
	"showDungeonSkills": true,
	"showWindow": true,
	"inspectDelay": 0,
	"Antaroth's Abyss (Hard)": true,
	"Antaroth's Abyss": false,
	"Argon Corpus": false,
	"Bahaar's Sanctum": true,
	"Balder's Temple": false,
	"Channelworks (3-Person)": false,
	"Dark Reach Citadel (Hard)": false,
	"Dark Reach Citadel": false,
	"Demon's Wheel": false,
	"Forsaken Island": false,
	"Gossamer Vault (Hard)": false,
	"Gossamer Vault": false,
	"Grotto of Lost Souls (Hard)": true,
	"Grotto of Lost Souls": false,
	"Lilith's Keep": false,
	"Macellarius Catacombs": false,
	"Manaya's Core": false,
	"Manglemire": false,
	"RK-9 Kennel (Hard)": true,
	"RK-9 Kennel": false,
	"Ravenous Gorge (3-Person)": false,
	"Red Refuge": false,
	"Rift's Edge (10-Person)": false,
	"Ruinous Manor (Hard)": true,
	"Ruinous Manor": false,
	"Shadow Sanguinary": false,
	"Thaumetal Refinery": false,
	"Velik's Hold (7-Person)": false,
	"Velik's Sanctuary (Hard)": false,
	"Velik's Sanctuary": false
}

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
	if (from_ver === undefined) {
		// Migrate legacy config file
		return Object.assign(Object.assign({}, DefaultSettings), settings);
	} else if (from_ver === null) {
		// No config file exists, use default settings
		return DefaultSettings;
	} else {
		// Migrate from older version (using the new system) to latest one
		if (from_ver + 1 < to_ver) {
			// Recursively upgrade in one-version steps
			settings = MigrateSettings(from_ver, from_ver + 1, settings);
			return MigrateSettings(from_ver + 1, to_ver, settings);
		}

		// If we reach this point it's guaranteed that from_ver === to_ver - 1, so we can implement
		// a switch for each version step that upgrades to the next version. This enables us to
		// upgrade from any version to the latest version without additional effort!
		switch(to_ver)
		{
			// default is basically keeping the inspectDelay setting only
			default:
				let oldsettings = settings

				settings = Object.assign(DefaultSettings, {});

				for(let option in oldsettings) {
					if(settings[option]) {
						settings[option] = oldsettings[option]
					}
				}

				if(from_ver < to_ver) console.log('[Inspector] Your settings have been updated to version ' + to_ver + '. You can edit the new config file after the next relog.')
				break;
		}

		return settings;
	}
}