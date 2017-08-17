const jobs = require('./jobs'),
	races = require('./races'),
	ItemStrings = require('item-strings'),
	Command = require('command')

module.exports = function Inspector(dispatch) {
	let enabled = true,
		inCombat = false
		
	dispatch.hook('S_LOGIN', 1, event => {
		inCombat = false
	})

	dispatch.hook('S_OTHER_USER_APPLY_PARTY', 1, event => {
		if (!enabled) return
		let name = event.name,
			level = event.level,
			job = event.class,
			gender = event.gender,
			race = event.race
		if (!inCombat) {
			//setTimeout( function inspect() {
					dispatch.toServer('C_REQUEST_USER_PAPERDOLL_INFO', 1, { name: name })
				//}, 2000)
		}
		console.log('[Inspector] ' + name + ' has applied to your group')
	})
	
	dispatch.hook('S_USER_STATUS', 1, event => { 
		if(event.target.equals(cid)) {
			if(event.status == 1) {
				inCombat = true
			}
			else inCombat = false
		}
	})
	
	dispatch.hook('S_USER_PAPERDOLL_INFO', 4, event => {
		let name = event.name,
			level = event.level,
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
		console.log('[Inspector] ' + name + ' (Level ' + level + ' ' + getJob(job) + ' - ' + getGender(gender) + ' ' + getRace(race, gender) + ')')
		console.log('            ' + guild + ' - Itemlevel: ' + itemLevel + '(' + itemLevelInventory + ')')
		console.log('            ' + 'Weapon: ' + conv(weapon) + ' +' + weaponenchant)
		console.log('            ' + '        ' + weaponcrystal1)
		console.log('            ' + '        ' + weaponcrystal2)
		console.log('            ' + '        ' + weaponcrystal3)
		console.log('            ' + '        ' + weaponcrystal4)
		console.log('            ' + 'Armor: ' + conv(chest) + ' +' + chestenchant)
		console.log('            ' + '       ' + chestcrystal1)
		console.log('            ' + '       ' + chestcrystal2)
		console.log('            ' + '       ' + chestcrystal3)
		console.log('            ' + '       ' + chestcrystal4)
		console.log('            ' + 'Gloves: ' + conv(gloves) + ' +' + glovesenchant)
		console.log('            ' + 'Boots: ' + conv(boots) + ' +' + bootsenchant)
		console.log('            ' + 'Innerwear: ' + conv(innerwear))
		console.log('            ' + 'Circlet: ' + conv(circlet))
	})
	
	// ######################## //
	// ### Helper Functions ### //
	// ######################## //
	
	function get(obj, ...keys) {
		if(obj === undefined) return

		for(let key of keys)
			if((obj = obj[key]) === undefined)
				return

		return obj
	}
	
	function getJob(job) {
		return get(jobs, job, "name") || "Undefined"
	}
	
	function getRace(race, gender) {
		if((race == 4) && (gender == 1)) return "Elin"
		return get(races, race, "name") || "Undefined"
	}
	
	function getGender(gender) {
		if(gender == 1) return "female"
		else if(gender == 2) return "male"
		else return "Undefined"
	}
	
	function conv(s) {
		return ItemStrings(s) || "Undefined";
	}
  
	// ################# //
	// ### Chat Hook ### //
	// ################# //
	
	const command = Command(dispatch)
	command.add('inspect', () => {
		enabled = !enabled
		command.message('[Inspector] ' + (enabled ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'))
		console.log('[Inspector] ' + (enabled ? 'enabled' : 'disabled'))
	})
}