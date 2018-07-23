## Get a notebook

This downloads a notebook to `notebook.js`. It's recommended to commit the notebook source to the repository, so it can be checked against the notebook on observablehq.com in case it changes.

### Usage

To install:

```
npm install @apicomponents/get-notebook --save-dev
```

To configure, add the `notebook-scripts` custom property to `package.json` and a script to download the notebook. The notebook URL will be converted to an API URL by changing `beta.observablehq.com` to `api.observablehq.com` and appending `.js` to it.

```
  "notebookScripts": {
    "notebook": "https://beta.observablehq.com/@benatkin/building-an-npm-module-with-observable"
  },
  "scripts": {
    "get-notebook": "get-notebook"
  }
```

To run the script, first set `OBSERVABLE_API_KEY` to the key in the URL for downloading a notebook (found at the end of the URL obtained by clicking *Download code* from the dot menu next to the *Publish* button at the top of the notebook), and then run the npm script:

```
export OBSERVABLE_API_KEY=YOUR_KEY
npm run get-notebook
```