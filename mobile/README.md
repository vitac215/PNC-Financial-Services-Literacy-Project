# Financial-Services-Literacy-Project

dbp2.apt.ri.cmu.edu:8080

Notes on testing it locally
- Open 2 terminal windows, one for node server and one for mongodb
- In 1 window: cd to directory: /data/db
run command "sudo mongod"
- In the other window: node server.js
- Type in the url "http://127.0.0.1:50000/" into the browser

Notes on editing stylesheets
- Make sure SASS is installed
- cd to public/css directory
- type into terminal
    sass --watch style.scss:style.css
- all changes should be made to style.scss (not .css) or files imported in style.scss
- SASS will automatically complile and update the .css file.


Notes on testing it on a server
- Install node.js and mongodb
https://www.liquidweb.com/kb/how-to-install-node-js-on-fedora-23/
http://www.liquidweb.com/kb/how-to-install-nvm-node-version-manager-on-fedora-23/
https://github.com/creationix/nvm

- Copy files from local to server (must be on the local to do this)
scp -r local/file/path username@dbp2.apt.ri.cmu.edu:~/

- Log into the server
ssh <username>@dbp2.apt.ri.cmu.edu

- Config the IP address and port number 
nslookup dbp2.apt.ri.cmu.edu  // look up the IP address
- Start the server

- Use screen to keep the server alive forever
screen -S proceeName
(control + A, then d to quit from the screen session)
screen -ls 
<detach the session once it’s created>
screen -r processName
<kill a screen session>
screen -X -S processName quit

- Find session
ps -ef | grep node
