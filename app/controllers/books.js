const express = require('express'),
  router = express.Router(),
  schema = require('../models/book'),
  Picture = schema.models.Picture,
  cloudinary = require('cloudinary').v2,
  fs = require('fs'),
  multipart = require('connect-multiparty'),
  multipartMiddleware = multipart();

module.exports = function (app) {
  app.use('/', router);
};

// Get pictures list
router.get('/books', (req, res, next) => {
  Picture.all()
    .then(photos => {
      console.log(photos);

      res.render('book/books', {
        title: 'PhotoBook',
        photos: photos,
        cloudinary
      });
  });
});

// Get form upload
router.get('/books/add', (req, res, next) => {
  res.render('book/add-photo', {
    title: 'Upload Picture'
  });
});

// Post to
router.post('/books/add', multipartMiddleware, (req, res, next) => {
    // Checking the file received
    console.log(req.files);
    // create a new instance using Picture Model
    const photo = new Picture(req.body);
    // Get temp file path
    const imageFile = req.files.image.path;

     // Upload file to Cloudinary
    cloudinary.uploader.upload(imageFile, {
      tags: 'photobook',
      folder: req.body.category + '/',
      public_id: req.files.image.originalFilename
      // eager: {
      // width: 280, height: 200, crop: "fill", gravity: "face"
      // }
    }).then(image => {
      console.log('Picture uploaded to Cloudinary');
      // Check the image Json file
      console.dir(image);
      // Added image informations to picture model
      photo.image = image;
      // Save photo with image metadata
      return photo.save();
    })
      .then(photo => {
        console.log('Successfully saved');
        // Remove image from local folder
        const filePath = req.files.image.path;
        fs.unlinkSync(filePath);
      })
      .finally(() => {
        // Show the result with image file
        res.render('book/posted-photo', {
          title: 'Upload with Success',
          photo,
          upload: photo.image
        });
      });
});
