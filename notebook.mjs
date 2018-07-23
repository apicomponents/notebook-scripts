// URL: https://beta.observablehq.com/@benatkin/notebook-scripts
// Title: Notebook Scripts
// Author: Benjamin Atkin (@benatkin)
// Version: 143
// Runtime version: 1

const m0 = {
  id: "43302f62d0ea2b8d@143",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Notebook Scripts

These are some scripts to improve the workflow of
[building an NPM module](https://beta.observablehq.com/@benatkin/building-an-npm-module-with-observable)
with an observable notebook.

Each script comes in a separate package, so only the necessary dependencies will
be installed.`
)})
    },
    {
      name: "viewof dlNbMd",
      inputs: ["md"],
      value: (function(md)
{
  const src = `## Download a notebook

This downloads a notebook to \`notebook.js\`. It's recommended to commit the notebook source to the repository, so it can be checked against the notebook on observablehq.com in case it changes.

### Usage

To install:

\`\`\`
npm install @apicomponents/download-notebook --save-dev
\`\`\`

To configure, add the \`notebook-scripts\` custom property to \`package.json\` and a script to download the notebook. The notebook URL will be converted to an API URL by changing \`beta.observablehq.com\` to \`api.observablehq.com\` and appending \`.js\` to it.

\`\`\`
  "notebookScripts": {
    "notebook": "https://beta.observablehq.com/@benatkin/building-an-npm-module-with-observable"
  },
  "scripts": {
    "download-notebook": "download-notebook"
  }
\`\`\`

To run the script, first set \`OBSERVABLE_API_KEY\` to the key in the URL for downloading a notebook (found at the end of the URL obtained by clicking *Download code* from the dot menu next to the *Publish* button at the top of the notebook), and then run the npm script:

\`\`\`
export OBSERVABLE_API_KEY=YOUR_KEY
npm run download-notebook
\`\`\``
  const el = md`${src}`
  el.value = src
  return el
}
)
    },
    {
      name: "dlNbMd",
      inputs: ["Generators","viewof dlNbMd"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["JSZip","dlNbFileSrc","dlNbMd","dlNbPkg","DOM"],
      value: (async function(JSZip,dlNbFileSrc,dlNbMd,dlNbPkg,DOM)
{
  const zip = new JSZip()
  const folder = zip.folder('packages').folder('download-notebook')
  folder.file('download-notebook.js', dlNbFileSrc)
  folder.file('README.md', dlNbMd)
  folder.file('package.json', JSON.stringify(dlNbPkg, null, 2))
  const blob = await zip.generateAsync({type: 'blob'})
  return DOM.download(blob, 'download-notebook.zip')
}
)
    },
    {
      name: "dlNb",
      value: (function(){return(
function dlNb(get, readFileSync, createWriteStream, env) {
  return function downloadNotebook() {
    return new Promise((resolve, reject) => {
      const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
      const observableUrl = pkg.notebookScripts.notebook
      if (!observableUrl) {
        throw new Error('notebookScripts.notebook must be set to the URL of an Observable notebook')
      }

      const observableApiKey = env.OBSERVABLE_API_KEY
      if (! observableApiKey) {
        throw new Error('OBSERVABLE_API_KEY environment variable is missing')
      }
      const apiUrl = observableUrl.replace('//beta.', '//api.') + '.js'
      const url = `${apiUrl}?key=${observableApiKey}`
      
      // https://stackoverflow.com/a/17676794/3461
      const f = createWriteStream('notebook.mjs')
      const req = get(url, res => {
        res.pipe(f)
        f.on('finish', () => { f.close(resolve) })
      })
      req.on('error', (e) => { throw e })
    })
  }
}
)})
    },
    {
      name: "viewof dlNbSrc",
      inputs: ["formatCode","dlNb","expandableCode"],
      value: (function(formatCode,dlNb,expandableCode)
{
  const src = formatCode(dlNb().toString())
  return expandableCode(src)
}
)
    },
    {
      name: "dlNbSrc",
      inputs: ["Generators","viewof dlNbSrc"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof dlNbFileSrc",
      inputs: ["expandableCode","dlNbSrc"],
      value: (function(expandableCode,dlNbSrc){return(
expandableCode(
`#!/usr/bin/env node
const {get} = require('https')
const {readFileSync, createWriteStream} = require('fs')
const env = process.env

${dlNbSrc}
downloadNotebook().then(() => {}).catch(err => {
  console.error('Error downloading notebook: ', err)
  console.trace()
})\n`)
)})
    },
    {
      name: "dlNbFileSrc",
      inputs: ["Generators","viewof dlNbFileSrc"],
      value: (G, _) => G.input(_)
    },
    {
      name: "dlNbPkg",
      value: (function()
{
  return {
    name: 'download-notebook',
    version: '1.0.0',
    description: 'Download an Observable notebook',
    main: 'download-notebook.js',
    bin: {
      'download-notebook': './download-notebook.js'
    },
    scripts: {},
    keywords: ['observable', 'literate-programming'],
    author: 'Benjamin Atkin <ben@benatkin.com> (https://github.com/benatkin)',
    repository: {
      type: 'git',
      url: 'git+https://github.com/apicomponents/notebook-scripts.git'
    }
  }
}
)
    },
    {
      name: "testDlNb",
      inputs: ["dlNb"],
      value: (async function(dlNb)
{
  const state = {}
  const mockGet = (url, cb) => {
    state.url = url
    state.res = {
      pipe(f) {
        state.piped = f
      }
    }
    state.req = {
      on(evt, cb) {
        // ignore error
      }
    }
    setTimeout(() => cb(state.res), 10)
    setTimeout(() => state.f.on('finish'), 50)
    return state.req
  }
  const mockRead = () => {
    return JSON.stringify({notebookScripts: {notebook: 'https://beta.observablehq.com/d/43302f62d0ea2b8d'}})
  }
  const mockCreateWriteStream = path => {
    state.path = path
    state.f = {
      on(evt, cb) {
        if (typeof cb == 'function') {
          state.finishCb = cb
        } else {
          state.finishCb()
        }
      },
      close(cb) {
        cb()
      }
    }
    return state.f
  }
  const downloadNotebook = dlNb(mockGet, mockRead, mockCreateWriteStream, { OBSERVABLE_API_KEY: 'MYAPIKEY' })
  await downloadNotebook()
  
  return state.url == 'https://api.observablehq.com/d/43302f62d0ea2b8d.js?key=MYAPIKEY'
}
)
    },
    {
      name: "expandableCode",
      inputs: ["html","md"],
      value: (function(html,md){return(
function expandableCode(src) {
  const el = html`<details>
<summary>${src.split("\n").length} lines</summary>
${md`\`\`\` javascript
${src}
\`\`\``}
  </details>`
  el.value = src
  return el
}
)})
    },
    {
      name: "formatCode",
      value: (function(){return(
function formatCode(src) {
  let result = src.trim()
  let secondLine = result.toString().split("\n", 3)[1]
  let dedent = new RegExp('^' + /^\s*/.exec(secondLine).toString().substr(2), 'gm')
  result = result.replace(dedent, '') + "\n"
  return result
}
)})
    },
    {
      name: "JSZip",
      inputs: ["require"],
      value: (function(require){return(
require('https://unpkg.com/jszip@3.1.5/dist/jszip.min.js')
)})
    }
  ]
};

const notebook = {
  id: "43302f62d0ea2b8d@143",
  modules: [m0]
};

export default notebook;
