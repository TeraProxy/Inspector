"use strict"

const DefaultSettings = {
    "inspectDelay": 0,
	"MM": true,
	"AAHM": true,
	"HH20": true,
	"AANM": true,
	"RKHM": true,
	"RRHM": true,
	"RMHM": true,
	"BPNM": false,
	"SCNM": false,
	"RKNM": false,
	"RRNM": false,
	"RMNM": false,
	"LKHM": false,
	"TRHM": false,
	"KDNM": false,
	"LKNM": false,
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
        throw new Error('So far there is only one settings version and this should never be reached!');
    }
}