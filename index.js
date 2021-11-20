/*
 *
 * TAO BUILD DAEMON
 *
 */

const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
const port = 3333

const { exec } = require('child_process');

function buildContentCreation(cb) {
  console.log('__ Pulling content-creation branch')
  const ccbProcess = exec('cd ../animals-as-objects-content-creation && git pull && npm run generate');
  ccbProcess.stderr.on('data', data => console.log(data));
  ccbProcess.stdout.on('data', data => console.log(data));
  ccbProcess.on('exit', code => {
    console.log(`%% Content-creation branch done. Code: ${code}`)
    cb()
  });
}

function buildMain(cb) {
  console.log('__ Pulling main branch')
  const mbProcess = exec('cd ../animals-as-objects && git pull && npm run generate && npm run pdf')
  mbProcess.stderr.on('data', data => console.log(data));
  mbProcess.stdout.on('data', data => console.log(data));
  mbProcess.on('exit', code => {
    console.log(`%% Main branch done. Code: ${code}`)
    cb()
  });
}

const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()

let allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
}
app.use(allowCrossDomain)

app.post("/", jsonParser, (req, res) => {
  console.log('___ POST')
  console.time("build");
  buildContentCreation(() => {
    buildMain(() => {
      console.log('§§§§ All done')
      console.timeEnd("build")
    })
  })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
