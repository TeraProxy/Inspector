"use strict"

const DefaultSettings = {
    "inspectDelay": 0,
	"GLSHM": true,
	"GLSNM": true,
	"MM": false,
	"AAHM": true,
	"DRCHM": true,
	"HH20": true,
	"AANM": true,
	"DRCNM": true,
	"RKHM": false,
	"RRHM": false,
	"RMHM": false,
	"BPNM": false,
	"SCNM": false,
	"RKNM": false,
	"RRNM": false,
	"RMNM": false,
	"LKHM": false,
	"TRHM": false,
	"KDNM": false,
	"LKNM": false,
	"VHNM": false,
	"TRNM": false,
	"RG": false,
	"SF": false,
	"KC": false,
	"MCata": false,
	"SA": false,
	"BT": false,
	"AC": false,
	"MCore": false
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