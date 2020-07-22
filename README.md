# SDX Sample Application
A simple, single-page React application to showcase the structure of queries to the SDX. 

## Prerequisites
- Node.js (available at [https://nodejs.org/](https://nodejs.org/))
- Chrome or Firefox

## Generate an API Key
1. Navigate to https://sdx.trihydro.com/
2. __Sign in__ with your credentials
    - If you don't already have an account, use the __Register__ button to sign up. You'll need to confirm your email before proceeding.
3. Click the dropdown arrow by your name on the right-side of the menu bar
4. Select __API Access__
5. Use the _Generate New API Key_ options to __Generate__ an API Key
6. Record your new API Key
## Setup
1. Clone this repository
2. Install dependencies using `npm install`
3. Create a `.env` file in the project's root directory (at the same level as this README)
    - If on _Linux_ or _MacOS_, this can be accomplished in the terminal by running `touch .env`
4. Open the `.env` file. Add the following contents. Replace `<api-key>` with your API Key. Do not include any quotes or double quotes around the API Key.
```
REACT_APP_API_KEY=<api-key>
```
4. Start the application using `npm start`

After starting, the application should automatically load in your browser. If not, navigate to [http://localhost:3000/](http://localhost:3000/). Note that the SDX application is set up to accept traffic from this application on port 3000 only. Other ports will fail CORS.

## Usage
Use the Query text area to modify query parameters. After a query is ran, results are displayed in the Results area.