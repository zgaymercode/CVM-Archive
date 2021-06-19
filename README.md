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

## Self-Hosting requirements / guide
[ubuntu 18.04 server](https://releases.ubuntu.com/18.04/) - incase you need the iso for it<br>
[MariaDB Server](https://mariadb.com/kb/en/installing-mariadb-deb-files/) - (focus on installing with APT for ease of install) <br>
[node 14.x](https://github.com/nvm-sh/nvm) - I am using node 14.17.0, nvm will install it using [ nvm install 14.17.0 ] <br>
[pm2](https://pm2.io/docs/runtime/guide/installation/) - you can install pm2 using npm, [npm install pm2 -g] this is used to keep the bot online <br>
[the bot](https://github.com/zgaymercode/CommunityVoiceManager) - fork this repository (or use master branch here!) gh repo clone zgaymercode/CommunityVoiceManager <br>
once the bot is ready, these commands will get the bot online and running on startup using pm2 <br>
### get the db setup
sudo apt-get install mariadb-server <br>
set up credentials for the bot - DO NOT USE ROOT CREDENTIALS <br>
add the [bot's database](https://github.com/zgaymercode/CommunityVoiceManager/blob/main/schema.sql) as a new db <br>
add that new database to the bot's user so the bot can access. It's going to need permission to UPDATE, SELECT, DELETE, and INSERT with that database. (i usually give the bot full perms on it's db (other than GRANT), but i run a local install with no outside access, do how you please with your install)


### install the bot
(as root)<br>
cd /path/to/voicemanager.js<br>
pm2 start voicemanager.js<br>
pm2 save<br>
DONE!! The bot will now run on startup and restart on failure/restart command

## Future Plans
Things that will come to the bot in the near future
- [ ] Slash Commands
- [ ] Auto-Locking channel (on create, channel locked (allows invite cmd to be used, but not lock/unlock))
- [ ] Suggestions command (for bot use only, sends suggestions to dev server)
- [ ] Addition of Leaders, full perms of owners except adding new leaders
- [ ] Hand raise Queue (request to talk for the activity channels)
- [ ] unchangable channel prefix's (addition to server settings `prefix`new channel name)
- [ ] lock emoji added to all locked rooms
- [ ] setup guide (maybe a website?)
- [ ] Admin Panel (pending Discord bot UI update)
- [ ] Win the game
