##### :heavy_exclamation_mark: Status :heavy_exclamation_mark:
Should work on all regions as long as the opcodes are mapped. Works on Caali's and Pinkie Pie's tera-proxy.

##### :heavy_exclamation_mark: Installation for Caali's tera-proxy :heavy_exclamation_mark:
1) Download Inspector: https://github.com/TeraProxy/Inspector/archive/master.zip
2) Extract the contents of the zip file into "\tera-proxy\bin\node_modules\"
3) Done! (the module will auto-update on Caali's proxy when a new version is released)
  
Users of Pinkie's proxy also need to install tera-game-state: https://github.com/caali-hackerman/tera-game-state/archive/master.zip  
  
If you enjoy my work and wish to support future development, feel free to drop me a small donation: [![Donate](https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=A3KBZUCSEQ5RJ&lc=US&item_name=TeraProxy&curency_code=USD&no_note=1&no_shipping=1&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)

# Inspector  
A tera-proxy module that automatically inspects players when they apply for your group and logs details about them in your console and ingame chat.  
Only inspects when you are out of combat so you don't get distracted while fighting.  
  
![Screenshot](https://i.imgur.com/C3v27Zn.png)
![Screenshot](https://i.imgur.com/oxTNFhO.png)

## Usage
The script is enabled by default and will automatically inspect players that apply for your group.  
To change which dungeon clears are shown on inspect edit the "\tera-proxy\settings\Inspector.json" file and set dungeons to either "true" or "false".  
To change the delay of the automatic inspect edit the "\tera-proxy\settings\Inspector.json" file and set the "inspectDelay" to your desired value (in ms).  
  
While in game, open a proxy chat session by typing "/proxy" or "/8" in chat and hitting the space bar.  
This serves as the script's command interface.  
The following commands are supported:  
  
* inspect - enable/disable Inspector
* inspect [x] - change inspect delay to x in ms, e.g. "inspect 2000" for 2 seconds
  
## Safety
Whatever you send to the proxy chat in game is intercepted client-side. The chat is NOT sent to the server.

## Changelog
<details>

### 1.3.5
* [-] Removed support for patch versions < 75
### 1.3.4
* [*] Updated S_USER_PAPERDOLL_INFO version
* [+] Added a branch for Pinkie Pie's tera-proxy
### 1.3.3
* [~] Code changes due to Caali's recent tera-proxy updates
* [-] Removed support for Pinkie Pie's tera-proxy
### 1.3.2
* [+] Added option to edit which dungeons are shown via config.json
* [+] Added option to edit delay of auto-inspect
* [*] Performance optimization
### 1.3.0
* [+] Rewrote code to use Caali's "tera-game-state" module in order to reduce overhead
* [+] Now supports auto-updating via Caali's tera-proxy
* [+] Now prints applicant's item level to ingame chat
* [+] Now prints applicant's clear count of currently relevant dungeons to ingame chat and console (thanks tera-love)
* [~] Now using a json database instead of additional js files
### 1.2.1
* [*] Updated hook versions for compatibility with the latest tera-proxy
### 1.2.0
* [*] Some code cleanup
* [*] Full conversion to Pinkie Pie's command module
### 1.1.0
* [+] Added logging of a character's information to the console
### 1.0.0
* [~] Initial Release

</details>