# Community Voice Manager (CVM)

<br>
Community Voice Manager is a Discord.js Bot made to create temporary voice channels<br>
**Note from Management:** <br>
This project has been removed from liscensing, any copies grabbed from current code must be approved by Management of this git project.<br>
[Invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=843080555012161546&permissions=288369680&scope=bot%20applications.commands) <br>
## Features<br>
- [X] Channel Name Templates with configurable Channel prefix's<br>
- [X] Update increment numbers via command (for manual overrides)<br>
- [X] Ability for users to rename Channels<br>
- [X] Lockable channels: Invite / kick members<br>
- [X] Claim channels if owner is no longer present (after timer is finished)<br>
- [X] create multiple join channels with different templates<br>
- [X] Allow enabling/disabling of lockable channels per-catagory<br>
- [X] Filterable voice channels (banned words)<br>
- [x] Temporary stage-like channels ( controlable voice chats with video :3 )<br>
- [x] Addition of Co-Owners, full perms of owners except adding new Co-Owners<br>
- [x] Auto-Locking channel (on create, channel locked (allows invite cmd to be used, but not lock/unlock))<br>
- [x] Hand raise Queue (request to talk for the activity channels)<br>

## Automated Tasks
These tasks run every 1.5 minutes to keep things organzied :D <br>
-**ChannelCleanup** : Deletes Empty channels that didn't get deleted when the last member left, and removes stale db entries<br><br>
-**JoinChannelCleanup** : Deletes stale Join Channel entries from the database.<br><br>
-**AutoPull** : Keeps this repository as the current live code running on the bot (restarts happen every X intervals, check ready listener)


## Future Plans
Things that will come to the bot in the near future
- [ ] Slash Commands
- [ ] setup guide (maybe a website?)
- [ ] Admin Panel (pending Discord bot UI update)
- [ ] Win the game
