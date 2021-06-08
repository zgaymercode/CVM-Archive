# This script is set up as a cron job on the server
# it is set to run every minute so even while working on
# the bot, if changes are pushed, they're automatically 
# pushed to the server

cd /home/wadmin/communityvoice/
git fetch --all
git reset --hard
git pull
