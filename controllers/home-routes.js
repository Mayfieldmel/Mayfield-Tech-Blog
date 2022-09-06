const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');


// get all posts
router.get('/', (req, res) => {
    console.log(req.session);
    getAllPosts(req, res);
})

// GET /home
router.get('/home', (req, res) => {
    console.log(req.session);
    // get all posts
    getAllPosts(req, res);
})

// GET /login
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }
    res.render('login');
  });

// GET /sign-up
router.get('/sign-up', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }
    res.render('sign-up');
  });

//   GET /post/1
  router.get('/post/:id', (req, res) => {
    // get single post
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'post_content',
        'title',
        'created_at',
      ],
      include: [
        {
            model: User,
            attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          },
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        // serialize the data
        const post = dbPostData.get({ plain: true });
        // pass data to template
        res.render('single-post', { post, loggedIn: req.session.loggedIn });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

//   get all posts
function getAllPosts(req, res) {
  Post.findAll({
    attributes: [
        'id',
        'title',
        'post_content',
        'created_at'
    ],
    include: [
        {
            model: User,
            attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        } 
      ],
    order: [
        ['created_at', 'DESC']
    ]
})
.then(dbPostData => {
    // serialize data
    const posts = dbPostData.map(post => post.get({ plain: true }));
    // pass serialized post array into the homepage template
    res.render('homepage', { posts, loggedIn: req.session.loggedIn });
})
.catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
}

module.exports = router;