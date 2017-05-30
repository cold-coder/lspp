let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PickedPhotoSchema = new Schema({
  code: String,
  photos: [String],
  createdTime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('PickedPhoto', PickedPhotoSchema);
