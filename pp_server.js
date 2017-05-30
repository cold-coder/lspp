const fs = require('fs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const config = require('./config')
const PickedPhoto = require('./app/models/PickedPhoto')

let port = process.env.PORT || 9001

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(morgan('dev'))

mongoose.Promise = global.Promise;
mongoose.connect(config.database)

const IMG_PATH = config.imagePath

/**
 * Allow CORS
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  next();
});

//Enable all options request for CORS preflight
app.options('*/*', (req, res) => {
  res.json({})
})

app.get('/', (req, res) => {
  res.send(`Hello! My name is Yao Cheng, nice to meet you.`)
})

/**
 * 获取备选照片列表
 * @type {[type]}
 */
app.get('/photo', (req, res) => {
  let code = req.body.code || req.query.code
  console.log(`the extract code is => ${code}`);
  getPhotosByExtractCode(code).then(function(l) {
    res.json(l)
  })
})

/**
 * 提交选择的照片列表
 * @type {[type]}
 */
app.post('/photo', (req, res) => {
  let code = req.body.code
  let photos = req.body.photos
  let pickedPhoto = new PickedPhoto({
    code: code,
    photos: photos,
    createdTime: new Date()
  })

  let promise = pickedPhoto.save()
  promise.then(function(doc) {
    console.log('pickedPhoto Saved')
    res.json({
      success: true,
      data: doc
    })
  })
})

/**
 * 获取已选照片列表
 * @type {[type]}
 */
app.get('/result', (req, res) => {
  let code = req.body.code || req.query.code
  PickedPhoto.findOne({ code: code }).select('code photos createdTime').sort({ createdTime: -1 }).exec(function(err, doc) {
    if (err) throw err
    res.json(doc)
  })
})

app.listen(port)
console.log(`Magic happens at http://localhost:${port}`)


/**
 * 根据选片码列出所有对应的备选照片
 * @param  {string} code 选片码
 * @return {Promise}      [description]
 */
function getPhotosByExtractCode(code) {
  return new Promise(function(resolve, reject) {
    let photoList = []
    let limit = 0

    const config = JSON.parse(fs.readFileSync('./client.json', 'utf-8'))

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
