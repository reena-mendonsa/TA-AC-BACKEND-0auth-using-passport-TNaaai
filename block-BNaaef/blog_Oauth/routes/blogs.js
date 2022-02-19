var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

var Blog = require('../models/Blog');
var Comment = require('../models/Comment');

router.get('/', function (req, res, next) {
  Blog.find({})
    .populate('author')
    .exec((err, blogs) => {
      if (err) return next(err);
      res.render('blogs', { blogs });
    });
});

router.get('/new', auth.loggedInUser, function (req, res, next) {
  res.render('newBlog');
});

router.post('/', auth.loggedInUser, function (req, res, next) {
  console.log(req.session.user);
  var data = req.body;
  data.author = req.user._id;
  data.tags = data.tags.trim().split(',');
  Blog.create(data, (err, blog) => {
    if (err) return next(err);
    res.redirect('/blogs');
  });
});

// DashBoard
router.get('/dashBoard', function (req, res, next) {
  Blog.find({})
    .populate('author')
    .exec((err, blogs) => {
      if (err) return next(err);
      res.render('dashBoard', { blogs });
    });
});

router.get('/:id', function (req, res, next) {
  var id = req.params.id;
  Blog.findById(id)
    .populate({
      path: 'comments',
      populate: {
        path: 'writer',
      },
    })
    .populate('author', 'name email')
    .exec((err, blog) => {
      if (err) return next(err);
      var isOwner = false;
      if (req.user && req.user.id && blog.author.id === req.user.id) {
        isOwner = !isOwner;
      }
      res.render('blogDetails', { blog, isOwner });
    });
});

router.get('/:id/delete', auth.loggedInUser, function (req, res, next) {
  var id = req.params.id;
  Blog.findByIdAndRemove(id, (err, blog) => {
    if (err) return next(err);
    res.redirect('/blogs');
  });
});

router.get('/:id/edit', auth.loggedInUser, function (req, res, next) {
  var id = req.params.id;
  Blog.findById(id, (err, blog) => {
    if (err) return next(err);
    res.render('editBlog', { blog });
  });
});

router.post('/:id', auth.loggedInUser, function (req, res, next) {
  var id = req.params.id;
  var data = req.body;
  Blog.findByIdAndUpdate(id, data, (err, updatedBlog) => {
    if (err) return next(err);
    res.redirect('/blogs/' + id);
  });
});

router.use(auth.loggedInUser);

// Routes For Comments
router.post('/:id/comments', function (req, res, next) {
  var id = req.params.id;
  var data = req.body;
  data.blogId = id;
  data.writer = req.user._id;
  Comment.create(data, (err, comment) => {
    if (err) return next(err);
    Blog.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, updatedBook) => {
        if (err) return next(err);
        res.redirect('/blogs/' + id);
      }
    );
  });
});

// Routes For Reactions
router.get('/click/:id/likes', function (req, res, next) {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, { $inc: { likes: +1 } }, (err, updatedBlog) => {
    if (err) return next(err);
    res.redirect('/blogs/' + id);
  });
});

router.get('/click/:id/dislikes', function (req, res, next) {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, { $inc: { dislikes: +1 } }, (err, updatedBlog) => {
    if (err) return next(err);
    res.redirect('/blogs/' + id);
  });
});

router.get('/click/:id/flames', function (req, res, next) {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, { $inc: { flames: +1 } }, (err, updatedBlog) => {
    if (err) return next(err);
    res.redirect('/blogs/' + id);
  });
});

router.get('/click/:id/hearts', function (req, res, next) {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, { $inc: { hearts: +1 } }, (err, updatedBlog) => {
    if (err) return next(err);
    res.redirect('/blogs/' + id);
  });
});

router.get('/click/:id/applauses', function (req, res, next) {
  var id = req.params.id;
  Blog.findByIdAndUpdate(
    id,
    { $inc: { applauses: +1 } },
    (err, updatedBlog) => {
      if (err) return next(err);
      res.redirect('/blogs/' + id);
    }
  );
});

module.exports = router;