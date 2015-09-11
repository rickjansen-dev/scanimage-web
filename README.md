Web frontend for scanimage
==========================

This is a web frontend for the linux command line tool 'scanimage' to scan documents using a connected scanner.
Most useful to run on a server with a connected printer/scanner.

Installation
============

Make sure you have nodejs, npm & bower installed. Clone this repository or download a snapshot, then:

```
bower install
npm install
node scanimage-web.js
```

Make sure there's a ../scans/ directory that's readable by the user that runs the nodejs instance.

Unfinished features & bugs
==========================

* cancelling a started scan is not currently supported.
* output folder specification is not currently supported (hardcoded - not hard to edit of course).
* the nodejs servers uses some deprecated methods
