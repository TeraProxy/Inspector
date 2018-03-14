##### :heavy_exclamation_mark: Status :heavy_exclamation_mark:
Working on NA Counterpunch patch with the latest https://github.com/meishuu/tera-data.  
Please always keep your tera-data up-to-date.  
Other regions will work if the opcodes are mapped but I personally only test modules on NA.  

If you enjoy my work and wish to support future development, feel free to drop me a small donation: [![Donate](https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=A3KBZUCSEQ5RJ&lc=US&item_name=TeraProxy&curency_code=USD&no_note=1&no_shipping=1&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)
  
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
