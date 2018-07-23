#!/usr/bin/env node
const {get} = require('https')
const {readFileSync, createWriteStream} = require('fs')
const env = process.env

function downloadNotebook() {
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

downloadNotebook().then(() => {}).catch(err => {
  console.error('Error downloading notebook: ', err)
  console.trace()
})
