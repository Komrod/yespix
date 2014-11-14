#
# Installs grunt and grunt-cli globaly
# Installs necessary packages to run the grunt tasks "packupdate"
# Runs "packageupdate" to update the rest
#

npm install grunt
npm install grunt-cli
npm install grunt-shell --save-dev
grunt packupdate
