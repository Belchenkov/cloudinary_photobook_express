const Schema = require('jugglingdb').Schema;

const schema = new Schema('mongodb', {
  url: 'mongodb://Belchenkov:12qwasZX@ds329668.mlab.com:29668/cloudinary-photobook'
});
  // Setup Books Schema
  const Picture = schema.define('Picture', {
    title : { type: String, length: 255 },
    description: {type: Schema.Text},
    category: {type: String, length: 255 },
    image : { type: JSON}
  });
  module.exports = schema;
