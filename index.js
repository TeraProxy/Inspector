// Version 1.3.4

'use strict'

const ItemStrings = require('./strings'),
	Data = require('./data')

module.exports = function PlayerInspector(mod) {

	if(mod.proxyAuthor !== 'caali') {
		const options = require('./module').options
		if(options) {
			const settingsVersion = options.settingsVersion
			if(settingsVersion) {
				mod.settings = require('./' + (options.settingsMigrator || 'module_settings_migrator.js'))(mod.settings._version, settingsVersion, mod.settings)
				mod.settings._version = settingsVersion
			}
		}
	}

	const races = Data["races"],
		jobs = Data["jobs"],
		dungeons = Data["dungeons"],
		strings = ItemStrings["item"]

	let enabled = true,
		name = '',
		inspectDelay = mod.settings.inspectDelay

	// ############# //
	// ### Hooks ### //
	// ############# //

	mod.hook('S_OTHER_USER_APPLY_PARTY', 1, applying)

	mod.hook('S_USER_PAPERDOLL_INFO', 6, inspect)

	mod.hook('S_DUNGEON_CLEAR_COUNT_LIST', 1, clearCount)

	// ################# //
	// ### Functions ### //
	// ################# //

	function applying(event) {
		if(!enabled) return
		let name = event.name,
			level = event.level,
			job = event.class,
			gender = event.gender,
			race = event.race
		if(!mod.game.me.inCombat) {
			setTimeout( () => {
				mod.toServer('C_REQUEST_USER_PAPERDOLL_INFO', 1, { name: name })
			}, inspectDelay)
		}
		console.log('[Inspector] ' + name + ' has applied to your group')
	}

	function inspect(event) {
		name = event.name

		let	level = event.level,
			race = Math.floor((event.templateId - 100) / 200 % 50), // 0 Human, 1 High Elf, 2 Aman, 3 Castanic, 4 Popori/Elin, 5 Baraka
			gender = Math.floor(event.templateId / 100 % 2) + 1, // 1 female, 2 male
			job = event.templateId % 100 - 1, // 0 Warrior, 1 Lancer, [...], 12 Valkyrie
			weapon = event.weapon,
			chest = event.body,
			gloves = event.hand,
			boots = event.feet,
			innerwear = event.underwear,
			circlet = event.head,
			itemLevel = event.itemLevel,
			itemLevelInventory = event.itemLevelInventory,
			guild = event.guild != '' ? 'Guild: ' + event.guild : 'Not in a guild',
			weaponenchant, chestenchant, glovesenchant, bootsenchant,
			weaponcrystal1, weaponcrystal2, weaponcrystal3, weaponcrystal4,
			chestcrystal1, chestcrystal2, chestcrystal3, chestcrystal4

		mod.command.message(name + '\'s Item Level: ' + itemLevel + '/' + itemLevelInventory)

		for(let item of event.items) {
			switch(item.slot) {
				case 1: // weapon
					weaponenchant = item.enchant
					weaponcrystal1 = item.crystal1 != 0 ? conv(item.crystal1) : 'none'
					weaponcrystal2 = item.crystal2 != 0 ? conv(item.crystal2) : 'none'
					weaponcrystal3 = item.crystal3 != 0 ? conv(item.crystal3) : 'none'
					weaponcrystal4 = item.crystal4 != 0 ? conv(item.crystal4) : 'none'
					break;
				case 3: // chest
					chestenchant = item.enchant
					chestcrystal1 = item.crystal1 != 0 ? conv(item.crystal1) : 'none'
					chestcrystal2 = item.crystal2 != 0 ? conv(item.crystal2) : 'none'
					chestcrystal3 = item.crystal3 != 0 ? conv(item.crystal3) : 'none'
					chestcrystal4 = item.crystal4 != 0 ? conv(item.crystal4) : 'none'
					break;
				case 4: // gloves
					glovesenchant = item.enchant
					break;
				case 5: // boots
					bootsenchant = item.enchant
					break;
			}
		}
		console.log('[Inspector] ' + name + ' (Level ' + level + ' ' + getJob(job) + ' - ' + getGender(gender) + ' ' + getRace(race, gender) + ')\n' +
					'            ' + guild + ' - Itemlevel: ' + itemLevel + '(' + itemLevelInventory + ')\n' +
					'            ' + 'Weapon: ' + conv(weapon) + ' +' + weaponenchant + '\n' +
					'            ' + '        ' + weaponcrystal1 + '\n' +
					'            ' + '        ' + weaponcrystal2 + '\n' +
					'            ' + '        ' + weaponcrystal3 + '\n' +
					'            ' + '        ' + weaponcrystal4 + '\n' +
					'            ' + 'Armor: ' + conv(chest) + ' +' + chestenchant + '\n' +
					'            ' + '       ' + chestcrystal1 + '\n' +
					'            ' + '       ' + chestcrystal2 + '\n' +
					'            ' + '       ' + chestcrystal3 + '\n' +
					'            ' + '       ' + chestcrystal4 + '\n' +
					'            ' + 'Gloves: ' + conv(gloves) + ' +' + glovesenchant + '\n' +
					'            ' + 'Boots: ' + conv(boots) + ' +' + bootsenchant + '\n' +
					'            ' + 'Innerwear: ' + conv(innerwear) + '\n' +
					'            ' + 'Circlet: ' + conv(circlet) + '\n'
		)
	}

	function clearCount(event) {
		if(mod.game.me.playerId == event.pid) return // for some reason to game retrieves our own dungeon clears as well

		mod.command.message('\t\t' + name + '\'s dungeon clears:')
		console.log('            ' + name + '\'s dungeon clears:')

		for(let dungeon of event.dungeons) {
			if(dungeon.id in dungeons && mod.settings[dungeons[dungeon.id]]) {
				let clearstring = dungeons[dungeon.id] + '\t' + dungeon.clears + ' clears'
				mod.command.message('\t\t' + clearstring)
				console.log('            ' + clearstring)
			}
		}
		console.log('\n')
	}

	function getJob(job) {
		return jobs[job] || "Undefined"
	}

	function getRace(race, gender) {
		if(race == 4 && gender == 1) return "Elin"
		return races[race] || "Undefined"
	}

	function getGender(gender) {
		if(gender == 1) return "female"
		else if(gender == 2) return "male"
		else return "Undefined"
	}

	function conv(s) {
		return strings[s] || "Undefined"
	}

	// ################ //
	// ### Commands ### //
	// ################ //

	mod.command.add('inspect', (value) => {
		if(!value) {
			enabled = !enabled
			mod.command.message((enabled ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'))
			console.log('[Inspector] ' + (enabled ? 'enabled' : 'disabled'))
		}
		else if(Number.isInteger(value)) {
			inspectDelay = value
		}
		else mod.command.message('Commands:<br>'
								+ ' "inspect" (enable/disable Inspector),<br>'
								+ ' "inspect [x]" (change inspect delay to x in ms, e.g. "inspect 2000")'
			)
	})
}