# Inspector  
A tera-proxy module that automatically inspects players when they apply for your group and logs details about them in your console.  
Only inspects when you are out of combat so you don't get distracted while fighting.  

![Screenshot](http://i.imgur.com/iEn1mtV.png)
  
## Usage  
While in game, open a whisper chat session with "!Inspector" by typing "/w !inspector" in chat and hitting the space bar.
This serves as the script's command interface. 
The following commands are supported:  
  
* on - Enables the script (default)  
* off - Disables the script  
  
Any other input returns a summary of above commands in the game.  
  
Alternative commands in all other chats:  
* !inspect - Toggles between "on" and "off" state  
  
## Safety
Whatever you send to "!Inspector" in game is intercepted client-side. The chat is NOT sent to the server.