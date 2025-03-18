# SDX Sample Application
A simple, single-page React application to showcase the structure of queries to the SDX. 

## Prerequisites
- You need Node.js but this page for npm says not to use the Node installer!  https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
"We strongly recommend using a Node version manager like nvm to install Node.js and npm. We do not recommend using a Node installer, since the Node installation process installs npm in a directory with local permissions and can cause permissions errors when you run npm packages globally."
Instead, on Windows use Nodist or nvm-windows and on Apple or Linux use nvm.
-I used Nodist here https://github.com/nodists/nodist/releases from the 'Installation' section but note that it says to uninstall Node first if you already have Node installed.
- Yarn (this requires Yarn 1 which can currently be found here:  https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) and you should be able to install the old Yarn by using
npm install --global yarn
- Chrome or Firefox

## Generate an API Key
1. Navigate to https://sdxbeta.trihydro.com/
2. __Sign in__ with your credentials
    - If you don't already have an account, use the __Register__ button to sign up. You'll need to confirm your email before proceeding.
3. Click the dropdown arrow by your name on the right-side of the menu bar
4. Select __API Access__
5. Use the _Generate New API Key_ options to __Generate__ an API Key
6. Record your new API Key

## Setup
1. Clone this repository
2. Install dependencies using `yarn install`
3. Create a `.env` file in the project's root directory (at the same level as this README)
    - If on _Linux_ or _MacOS_, this can be accomplished in the terminal by running `touch .env`
4. Open the `.env` file. Add the following contents. Replace `<api-key>` with your API Key. Do not include any quotes or double quotes or angle brackets around the API Key.  
DO NOT INCLUDE A TRAILING SLASH ON THE REACT_APP_URL!  
DO NOT INCLUDE index.html  
**Either a trailing slash or /index.html will cause CORS to fail!**  
```
REACT_APP_API_KEY=<insert your apikey here>
REACT_APP_URL=https://sdxbeta-service.trihydro.com
```

5. Start the application using `yarn start`

After starting, the application should automatically load in your browser. If not, navigate to [http://localhost:3000/](http://localhost:3000/). Note that the SDX application is set up to accept traffic from this application on port 3000 only. Other ports will fail CORS.

If you get a webpage at localhost:3000 but there seems to be no reaction at all to any button presses, the likely cause is that your .env file is incorrect.

## Usage
Use the Query text area to modify query parameters. After a query has been run, results are displayed in the Results area.