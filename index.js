'use strict'

const Data = require('./data')

module.exports = function PlayerInspector(mod) {

    const races = Data["races"],
        jobs = Data["jobs"]

    let name = '',
        appliedInCombat = false,
        niceName = mod.proxyAuthor !== 'caali' ? '[Inspect] ' : '',
        dungeons = {}

    mod.queryData('/StrSheet_Dungeon/String/', [], true, false).then(results => {
        results.forEach(entry => { if(mod.game.data.continents.has(entry.attributes.id)) dungeons[entry.attributes.id] = entry.attributes.string })
    })

    // ############# //
    // ### Hooks ### //
    // ############# //

    mod.hook('S_OTHER_USER_APPLY_PARTY', 1, S_OTHER_USER_APPLY_PARTY)

    mod.hook('S_USER_PAPERDOLL_INFO', mod.majorPatchVersion >= 85 ? 10:9, S_USER_PAPERDOLL_INFO)

    mod.hook('S_DUNGEON_CLEAR_COUNT_LIST', 1, S_DUNGEON_CLEAR_COUNT_LIST)

    // ################# //
    // ### Functions ### //
    // ################# //

    function S_OTHER_USER_APPLY_PARTY(event) {
        if(!mod.settings.enabled) return
        let name = event.name,
            level = event.level,
            job = event.class,
            gender = event.gender,
            race = event.race

        setTimeout( () => {
            if(mod.game.me.inCombat) appliedInCombat = true
            if(mod.majorPatchVersion >= 85) mod.toServer('C_REQUEST_USER_PAPERDOLL_INFO', 2, { unk: true, name: name })
            else mod.toServer('C_REQUEST_USER_PAPERDOLL_INFO', 1, { name: name })
        }, mod.settings.inspectDelay)

        console.log('[Inspector] ' + name + ' has applied to your group')
    }

    function S_USER_PAPERDOLL_INFO(event) {
        name = event.name

        let level = event.level,
            talentLevel = event.talentLevel,
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

        mod.command.message(niceName + name + '\'s Item Level: ' + itemLevel + '/' + itemLevelInventory)

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
                    '            ' + guild + ' ~ Talent-Level: ' + talentLevel + ' ~ Item-Level: ' + itemLevel + '(' + itemLevelInventory + ')\n' +
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
        if(appliedInCombat || !mod.settings.showWindow) {
            appliedInCombat = false
            return false
        }
    }

    function S_DUNGEON_CLEAR_COUNT_LIST(event) {
        if(mod.game.me.playerId == event.pid) return // for some reason to game retrieves our own dungeon clears as well

        console.log('            ' + name + '\'s dungeon skills:')

        for(let dungeon of event.dungeons) {
            let zone_string = dungeons[dungeon.id]
            if(mod.settings[zone_string]) {
                let clearstring = zone_string + ' - ' + (dungeon.rookie ? 'Rookie' : 'Skilled')
                if(mod.settings.showDungeonSkills) mod.command.message(niceName + '\t\t' + clearstring)
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
        const data = mod.game.data.items.get(s)
        return data ? data.name : "Undefined"
    }

    // ################ //
    // ### Commands ### //
    // ################ //

    mod.command.add('inspect', (value) => {
        if(!value) {
            mod.settings.enabled = !mod.settings.enabled
            mod.command.message(niceName + 'Inspector ' + (mod.settings.enabled ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'))
            console.log('Inspector ' + (mod.settings.enabled ? 'enabled' : 'disabled'))
        }
        else if(value == "clears" || value == "skills" || value == "skill") {
            mod.settings.showDungeonSkills = !mod.settings.showDungeonSkills
            mod.command.message(niceName + 'Showing dungeon clears ' + (mod.settings.showDungeonSkills ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'))
            console.log('[Inspect] Showing dungeon clears ' + (mod.settings.showDungeonSkills ? 'enabled' : 'disabled'))
        }
        else if(value == "window") {
            mod.settings.showWindow = !mod.settings.showWindow
            mod.command.message(niceName + 'Showing inspect window ' + (mod.settings.showWindow ? '<font color="#56B4E9">enabled</font>' : '<font color="#E69F00">disabled</font>'))
            console.log('[Inspect] Showing inspect window ' + (mod.settings.showWindow ? 'enabled' : 'disabled'))
        }
        else if(Number.isInteger(value)) {
            mod.settings.inspectDelay = value
        }
        else mod.command.message('Commands:\n'
            + ' "inspect" (enable/disable Inspector),\n'
            + ' "inspect skills" (show/hide dungeon skills),\n'
            + ' "inspect window" (show/hide inspect window for applicants),\n'
            + ' "inspect [x]" (change inspect delay to x in ms, e.g. "inspect 2000")'
        )
    })
}