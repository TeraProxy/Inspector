// Version 1.3.2

'use strict'

const Command = require('command'),
	GameState = require('tera-game-state'),
	ItemStrings = require('./strings'),
	Data = require('./data'),
	Config = require('./config_1-3-2')

module.exports = function PlayerInspector(dispatch) {
	const command = Command(dispatch),
		game = GameState(dispatch),
		races = Data["races"],
		jobs = Data["jobs"],
		dungeons = Data["dungeons"],
		strings = ItemStrings["item"]

	let enabled = true,
		name = '',
		inspectDelay = Config.inspectDelay

	// ############# //
	// ### Hooks ### //
	// ############# //

	dispatch.hook('S_OTHER_USER_APPLY_PARTY', 1, applying)

	dispatch.hook('S_USER_PAPERDOLL_INFO', 4, inspect)

	dispatch.hook('S_DUNGEON_CLEAR_COUNT_LIST', 1, clearCount)

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
		if(!game.me.inCombat) {
			setTimeout( () => {
				dispatch.toServer('C_REQUEST_USER_PAPERDOLL_INFO', 1, { name: name })
			}, inspectDelay)
		}
		console.log('[Inspector] ' + name + ' has applied to your group')
	}

	function inspect(event) {
		name = event.name

		let	level = event.level,
			race = Math.floor((event.model - 100) / 200 % 50), // 0 Human, 1 High Elf, 2 Aman, 3 Castanic, 4 Popori/Elin, 5 Baraka
			gender = Math.floor(event.model / 100 % 2) + 1, // 1 female, 2 male
			job = event.model % 100 - 1, // 0 Warrior, 1 Lancer, [...], 12 Valkyrie
			weapon = event.weapon,
			chest = event.chest,
			gloves = event.gloves,
			boots = event.boots,
			innerwear = event.innerwear,
			circlet = event.head,
			itemLevel = event.itemLevel,
			itemLevelInventory = event.itemLevelInventory,
			guild = event.guild != '' ? 'Guild: ' + event.guild : 'Not in a guild',
			weaponenchant, chestenchant, glovesenchant, bootsenchant,
			weaponcrystal1, weaponcrystal2, weaponcrystal3, weaponcrystal4,
			chestcrystal1, chestcrystal2, chestcrystal3, chestcrystal4

		command.message('[Inspector] ' + name + '\'s Item Level: ' + itemLevel + '/' + itemLevelInventory)

		for(let item of event.items) {
			switch(item.slot) {
				case 1: // weapon
					weaponenchant = item.enchantment
					weaponcrystal1 = item.crystal1 != 0 ? conv(item.crystal1) : 'none'
					weaponcrystal2 = item.crystal2 != 0 ? conv(item.crystal2) : 'none'
					weaponcrystal3 = item.crystal3 != 0 ? conv(item.crystal3) : 'none'
					weaponcrystal4 = item.crystal4 != 0 ? conv(item.crystal4) : 'none'
					break;
				case 3: // chest
					chestenchant = item.enchantment
					chestcrystal1 = item.crystal1 != 0 ? conv(item.crystal1) : 'none'
					chestcrystal2 = item.crystal2 != 0 ? conv(item.crystal2) : 'none'
					chestcrystal3 = item.crystal3 != 0 ? conv(item.crystal3) : 'none'
					chestcrystal4 = item.crystal4 != 0 ? conv(item.crystal4) : 'none'
					break;
				case 4: // gloves
					glovesenchant = item.enchantment
					break;
				case 5: // boots
					bootsenchant = item.enchantment
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
		if(game.me.playerId == event.pid) return // for some reason to game retrieves our own dungeon clears as well

		command.message('\t\t' + name + '\'s dungeon clears:')
		console.log('            ' + name + '\'s dungeon clears:')

		for(let dungeon of event.dungeons) {
			if(dungeon.id in dungeons && Config[dungeons[dungeon.id]]) {
				let clearstring = dungeons[dungeon.id] + '\t' + dungeon.clears + ' clears'
				command.message('\t\t' + clearstring)
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

	command.add('inspect', (value) => {
		if(!value) {
			enabled = !enabled
			command.message('[Inspector] ' + (enabled ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'))
			console.log('[Inspector] ' + (enabled ? 'enabled' : 'disabled'))
		}
		else if(Number.isInteger(value)) {
			inspectDelay = value
		}
		else command.message('Commands:<br>'
								+ ' "inspect" (enable/disable Inspector),<br>'
								+ ' "inspect [x]" (change inspect delay to x in ms, e.g. "inspect 2000")'
			)
	})
}