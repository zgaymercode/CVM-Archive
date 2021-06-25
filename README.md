# Community Voice Manager (CVM)

<br>
Community Voice Manager is a Discord.js Bot made to create temporary voice channels<br>
**Request from the author:** Please do not turn this into a close source project, if you modify it, I'd like to see what improvements you made!<br>
[Invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=843080555012161546&permissions=288369680&scope=bot%20applications.commands)
## Features
- [X] Channel Name Templates with configurable Channel prefix's
- [X] Update increment numbers via command (for manual overrides)
- [X] Ability for users to rename Channels
- [X] Lockable channels: Invite / kick members
- [X] Claim channels if owner is no longer present (after timer is finished)
- [X] create multiple join channels with different templates
- [X] Allow enabling/disabling of lockable channels per-catagory
- [X] Filterable voice channels (banned words)
- [x] Temporary stage-like channels ( controlable voice chats with video :3 )
- [x] Addition of Co-Owners, full perms of owners except adding new Co-Owners
- [x] Auto-Locking channel (on create, channel locked (allows invite cmd to be used, but not lock/unlock))
- [x] Hand raise Queue (request to talk for the activity channels)

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
