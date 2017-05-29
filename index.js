const fs = require('fs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

let port = process.env.PORT || 9001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**
 * Allow CORS
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  next();
});

app.get('/', (req, res) => {
  res.send(`Hello! My name is Yao Cheng, nice to meet you.`)
})

app.get('/photo', (req, res) => {
  let code = req.body.code || req.query.code
  console.log(`the extract code is => ${code}`);
  getPhotosByExtractCode(code).then(function(l) {
    res.json(l)
  })
})

app.listen(port)
console.log(`Magic happens at http://localhost:${port}`)

const IMG_PATH = "/Users/yaocheng/ls_portal/img/" // for testing

/**
 * 根据选片码列出所有对应的备选照片
 * @param  {string} code 选片码
 * @return {Promise}      [description]
 */
function getPhotosByExtractCode(code) {
  return new Promise(function(resolve, reject) {
    let photoList = []
    let limit = 0

    const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))

    let r = config.filter(function(c) {
      return c.code.toLowerCase() === code.toLowerCase()
    })

    if (r.length === 1) {
      limit = parseInt(r[0].size, 10)
      let folder = r[0].folder
      let folderPath = IMG_PATH + folder
      photoList = fs.readdirSync(folderPath).map(function(p) {
        return folder + '/' + p
      })
    }

    resolve(
      {
        photoList,
        limit
      }
    )
  });
}
