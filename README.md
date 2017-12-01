##### :heavy_exclamation_mark: Elin Gunner Patch Info :heavy_exclamation_mark:
This module should be working with the latest https://github.com/TeraProxy/tera-data.  
Please note that I did not test the opcodes for a long time yet but I'm quite positive they are correct.  
If you do not mind helping me test, feel free to use my tera-data fork.  

# Inspector  
A tera-proxy module that automatically inspects players when they apply for your group and logs details about them in your console.  
Only inspects when you are out of combat so you don't get distracted while fighting.  

![Screenshot](http://i.imgur.com/iEn1mtV.png)
  
## Usage  
The script is enabled by default and will automatically inspect players that apply for your group.  
  
While in game, open a proxy chat session by typing "/proxy" or "/8" in chat and hitting the space bar.  
This serves as the script's command interface.  
The following commands are supported:  
  
* inspect - enable/disable Inspector  
  
## Safety
Whatever you send to the proxy chat in game is intercepted client-side. The chat is NOT sent to the server.  
  
## Changelog
### 1.2.0
* [*] Some code cleanup
* [*] Full conversion to Pinkie Pie's command module
### 1.1.0
* [+] Added logging of a character's information to the console
### 1.0.0
* [*] Initial Release
