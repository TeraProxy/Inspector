##### :heavy_exclamation_mark: Status :heavy_exclamation_mark:
Should work on all regions as long as the opcodes are mapped but I personally only test modules on NA with Caali's tera-proxy: https://discord.gg/maqBmJV  

##### :heavy_exclamation_mark: Installation for Caali's tera-proxy :heavy_exclamation_mark:
1) Download Inspector: https://github.com/TeraProxy/Inspector/archive/master.zip
2) Extract the contents of the zip file into "\tera-proxy\bin\node_modules\"
3) Done! (the module will auto-update when a new version is released)

##### :heavy_exclamation_mark: Installation for PinkiePie's tera-proxy :heavy_exclamation_mark:
1) Update your tera-data: https://github.com/meishuu/tera-data
2) Download Inspector: https://github.com/TeraProxy/Inspector/archive/master.zip
3) Download tera-game-state: https://github.com/hackerman-caali/tera-game-state/archive/master.zip
4) Extract the contents of both zip files into "\tera-proxy\bin\node_modules\"
5) Done!
6) Check back here once in a while for updates

If you enjoy my work and wish to support future development, feel free to drop me a small donation: [![Donate](https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=A3KBZUCSEQ5RJ&lc=US&item_name=TeraProxy&curency_code=USD&no_note=1&no_shipping=1&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)

# Inspector  
A tera-proxy module that automatically inspects players when they apply for your group and logs details about them in your console and ingame chat.  
Only inspects when you are out of combat so you don't get distracted while fighting.  
  
![Screenshot](https://i.imgur.com/C3v27Zn.png)
![Screenshot](https://i.imgur.com/oxTNFhO.png)

## Usage
The script is enabled by default and will automatically inspect players that apply for your group.  
  
While in game, open a proxy chat session by typing "/proxy" or "/8" in chat and hitting the space bar.  
This serves as the script's command interface.  
The following commands are supported:  
  
* inspect - enable/disable Inspector  
  
## Safety
Whatever you send to the proxy chat in game is intercepted client-side. The chat is NOT sent to the server.

## Changelog
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