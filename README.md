# CommunityVoiceManager
Community Voice Manager is a Discord.js Bot made to create temporary voice channels<br>
[Invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=843080555012161546&permissions=288369680&scope=bot%20applications.commands)
## Features
- [X] Channel Name Templates
- [X] Update increment numbers via command (for manual overrides)
- [X] Ability to rename Channels
- [X] Lockable channels
- [X] Claim channels if owner is no longer present
- [X] invite members to locked channels
- [X] create multiple catagories with different templates
- [X] Allow enabling/disabling of lockable channels per-catagory
- [X] Filterable voice channels (banned words)
- [x] New channels copy join channel's permissions
- [x] Temporary stage-like channels ( controlable voice chats with video :3 )

## Automated Tasks
These tasks run every 1.5 minutes to keep things organzied :D <br>
-**ChannelCleanup** : Deletes Empty channels that didn't get deleted when the last member left, and removes stale db entries<br><br>
-**CatagoryCleanup** : Deletes stale catagory entries from the database.<br><br>
-**AutoPull** : Keeps this repository as the current live code running on the bot (restarts happen every X intervals, check ready listener)

## Future Plans
Things that will come to the bot in the near future
- [ ] Slash Commands
- [ ] Win the game
