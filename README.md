# CommunityVoiceManager
Community Voice Manager is a Discord.js Bot made to create temporary voice channels<br>

## Features
- [X] Channel Name Templates
- [X] Update increment numbers via command (for manual overrides)
- [X] Ability to rename Channels
- [X] Lockable channels
- [X] Claim channels if owner is no longer present
- [X] invite members to locked channels
- [X] create multiple catagories with different templates
- [X] Allow enabling/disabling of lockable channels per-catagory

## Commands
In order for commands to run, you must either be in a voice chat, or have the Manage Server / Administrator perms<br><br>
**Public**<br>
-**owner** : Shows who the current owner of the channel is<br><br>
-**claim** : Claim the voice chat if the owner has left<br><br><br>
**Voice Channel Owners**<br>
-**kick @member** : Kicks the mentioned member from the current voice chat<br><br>
-**rename** : allows the channel owner to rename the voice chat<br><br>
-**lock** : Locks the channel and makes it visible and joinable by those who are invited.<br><br>
-**unlock** : unlocks a voice chat and allows it to be seen and joined by anyone<br><br>
-**invite @member** : allows a mentioned member to see and join the channel<br><br><br>
**Server Management**<br>
-**newcat** : Generates a new category and a join channel for that category<br><br>
-**template** : Updates the Channel's template<br>
%INC% = Increment&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%USERNAME% = username<br><br>
-**increment** : Overrides the Channel's increment<br><br>
-**lockable <category_id> enable|disable** : Enables/Disables the ability to lock a channel within a category<br><br>
-**debug** : Debugs the bot's perms for the server or a channel<br><br>

## Automated Tasks

-**ChannelCleanup** : Deletes Empty channels that didn't get deleted when the last member left, and removes stale db entries<br><br>
-**CatagoryCleanup** : Deletes stale catagory entries from the database.<br><br>

## Future Plans
Things that will come to the bot in the near future

- [ ] Win the game
