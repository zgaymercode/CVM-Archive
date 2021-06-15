# This script is set up as a cron job on the server
# it is set to run every minute so even while working on
# the bot, if changes are pushed, they're automatically 
# pushed to the server 

# instructions: Be sure to pull this file out of the 
# directory that the repo is in, it will overwrite 
# the file permissions and cause the script to 
# no longer be able to run due to lack of
# execution perms

# to add to the crontab:
#     crontab -e

# at the bottom add:
#     */1 * * * * /path/to/file/autopull.sh
# save crontab and it should be automated now :3

cd /home/wadmin/communityvoice/
git stash --include-untracked
git reset --hard
git clean -fd
git pull