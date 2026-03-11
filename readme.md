## Setup Notes:
Before we begin, be sure you have nodedjs installed. Nodejs is the platform used to execute the project Nodejs version the project was tested and built with (just a suggestion incase you have issues setting up the project)

Node Version: `22.22.1`<br/>
NPM Version: `10.9.4`

## Setup Steps:
- To get started, navigate to the App directory in the terminal, and run `npm install`<br/>
*This will install all of the nodejs libraries for the project.*
- You can download nodejs from the official nodejs website.
<a href="https://nodejs.org/en/download">https://nodejs.org/en/download</a>
- Navigate to the `./App` directory, and run `npm install` in the terminal

## How to run the program
- Navigate to the `./App` directory in the Terminal
- `npm run start` to run the electron app


## How to build the standalone application
- Navigate to the `./Build` directory in the terminal<br/>
- run the `build.sh` script to compile the final electron app.<br/>
*The complied standalone apps will be stored in* `./Output`


## Notes:
#### Path references:
- `./Fragments`: <br/>*This directory is where i put proof of concept frameworks i want to use to create clean testing isolated environments that i want to re-use in the final app*
- `./App`:<br/>*This directory is where the electron app is stored for the final release. When you run the project, run it within this folder.*
- `./Build`:<br/>*This is where i store t he build scripts to automate building the app for other platforms/operating systems.*
- `./Output`:<br/>*This directory is where the built programs can be stored for people to download directly. The names will be standardized, so they can be used to download the latest nightly builds of the project for update solutions.*