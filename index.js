const jobs = require('./jobs'),
	races = require('./races')

module.exports = function Inspector(dispatch) {
	let enabled = false,
		cid = null,
		player = '',
		inCombat = false
		
	dispatch.hook('S_LOGIN', 1, event => {
		({cid} = event)
		player = event.name
		enabled = true
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
			setTimeout( function inspect() {
					dispatch.toServer('C_REQUEST_USER_PAPERDOLL_INFO', 1, { name: name })
				}, 2000)
		}
		console.log('[Inspector] ' + name + ' (Level ' + level + ' ' + getJob(job) + ', ' + getGender(gender) + ' ' + getRace(race, gender) + ') has applied to your group')
	})
	
	dispatch.hook('S_USER_STATUS', 1, event => { 
		if(event.target.equals(cid)) {
			if(event.status == 1) {
				inCombat = true
			}
			else inCombat = false
		}
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
		else if(gender == 0) return "male"
		else return "Undefined"
	}
  
	// ################# //
	// ### Chat Hook ### //
	// ################# //
	
	dispatch.hook('C_WHISPER', 1, (event) => {
		if(event.target.toUpperCase() === "!Inspector".toUpperCase()) {
			if (/^<FONT>on?<\/FONT>$/i.test(event.message)) {
				enabled = true
				message('Inspector <font color="#56B4E9">enabled</font>.')
				console.log('Inspector enabled.')
			}
			else if (/^<FONT>off?<\/FONT>$/i.test(event.message)) {
				enabled = false
				message('Inspector <font color="#E69F00">disabled</font>.')
				console.log('Inspector enabled.')
			}
			else message('Commands: "on" (enable Inspector),'
								+ ' "off" (disable Inspector)'
						)
			return false
		}
	})
	
	function message(msg) {
		dispatch.toClient('S_WHISPER', 1, {
			player: cid,
			unk1: 0,
			gm: 0,
			unk2: 0,
			author: '!Inspector',
			recipient: player,
			message: msg
		})
	}
	
	dispatch.hook('C_CHAT', 1, event => {
		if(/^<FONT>!inspect<\/FONT>$/i.test(event.message)) {
			if(!enabled) {
				enabled = true
				message('Inspector <font color="#56B4E9">enabled</font>.')
				console.log('Inspector enabled.')
			}
			else {
				enabled = false
				message('Inspector <font color="#E69F00">disabled</font>.')
				console.log('Inspector disabled.')
			}
			return false
		}
	})
}