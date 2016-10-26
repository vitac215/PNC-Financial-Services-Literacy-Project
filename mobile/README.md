# Financial-Services-Literacy-Project

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
- Copy files from local to server
scp -r /Users/vitachen/Documents/FL2016/is/Financial-Services-Literacy-Project/mobile kezhouc@dbp2.apt.ri.cmu.edu:~/
- Log into the server
ssh kezhouc@dbp2.apt.ri.cmu.edu   (password: kezhouc)
- Install node.js and mongodb
https://www.liquidweb.com/kb/how-to-install-node-js-on-fedora-23/
http://www.liquidweb.com/kb/how-to-install-nvm-node-version-manager-on-fedora-23/
https://github.com/creationix/nvm

- PASSWD