# Screeps Automation Script
This is a work in progress AI script for the MMO programming game Screeps.

This project is based on [this repo](https://github.com/AydenRennaker/screeps-starter) by @AydenRennaker . In particular, the Gruntfile setup for deploying onto Screeps is amazing.

This script is by no means complete and the completed portions are not optimal. I recommend looking at established codebases like [Overmind](https://github.com/bencbartlett/Overmind) for examples of efficient, complete AIs.

## Setup
Requires VS Code, Node.js, and npm.
1. Clone or download the .zip for this repository.
2. Open the folder in VS Code.
3. Run `npm install` in the VS Code terminal.
4. In Gruntfile.js, change the `dest:` path to the one given by clicking "Open local folder" in the bottom right of Screeps.
5. For normal deployment, use `grunt merge` followed by `grunt write-private` to deploy the script to your Screeps client.
