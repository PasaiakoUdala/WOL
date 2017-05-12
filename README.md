# WOL
====================================================================

This App does some magic like:

   - Obtain LAN host info from OCS database
   - Check if a host is alive with a Ping (Every 10 minutes)
   - If the host is alive and is windows:
      + Checks if host is with screensaver
      + Show buttons to perfom some actions: Logout current host session, Reboot host, Shutdown host
   - If host is turned off, make a Wake On Lan call


Insatallation notes:
====================================================================

  - git clone this repo
  - rename config.json.dist to config.json and configure parameters
  - npm install
  - install wmi-client ( We need winexe to run windows processes remotelly )
  - install and configure PM2 for node server
  - access to http://localhost:3000