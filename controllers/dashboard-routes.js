const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment} = require('../models');
const withAuth = require('../utils/auth');


router.get('/', withAuth, (req, res) => {
  console.log(req.session);
  console.log('======================');
  // get all posts for dashboard
  Post.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id',
      'title',
      'post_content',
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
      res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


// GET /dashboard/add-post
router.get('/add-post', withAuth, (req, res) => {
    // get single post
        res.render('add-post', {
          loggedIn: true
        });
});
// GET /dashboard/post/1
router.get('/post/:id', withAuth, (req, res) => {
    // get single post
  Post.findByPk(req.params.id, {
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
            }
        } 
    ]
  })
    .then(dbPostData => {
      if (dbPostData) {
        // serialize data
        const post = dbPostData.get({ plain: true });
        // render template
        res.render('user-post', {
          post,
          loggedIn: true
        });
      } else {
        res.status(404).end();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});


// GET /dashboard/edit/1
router.get('/edit/:id', withAuth, (req, res) => {
    // get single post
  Post.findByPk(req.params.id, {
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
            }
        } 
    ]
  })
    .then(dbPostData => {
      if (dbPostData) {
        // serialize data
        const post = dbPostData.get({ plain: true });
        // render template
        res.render('edit-post', {
          post,
          loggedIn: true
        });
      } else {
        res.status(404).end();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// GET /dashboard/comments
router.get('/comments', withAuth, (req, res) => { 
    console.log(req.session);
    console.log('======================');
    // get all user comments
    Comment.findAll({
      where: {
        user_id: req.session.user_id
      },
      attributes: [
        'id',
        'comment_text',
        'user_id',
        'post_id',
        'created_at',
      ],
      include: [
          {
              model: User,
              attributes: ['username']
          },
          {
              model: Post,
              attributes: ['id', 'title', 'created_at',],
              include: {
              model: User,
              attributes: ['username']
              }
          }
      ]
    })
      .then(dbCommentData => {
          // serialize data
        const comments = dbCommentData.map(comment => comment.get({ plain: true }));
        res.render('user-comments', { comments, loggedIn: true });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// GET /dashboard/edit-comment/1
router.get('/edit-comment/:id', withAuth, (req, res) => {
      // get single comment
    Comment.findByPk(req.params.id, {
      attributes: ['id', 'comment_text', 'user_id', 'created_at'],
      include: [
          {
              model: User,
              attributes: ['username']
          },
          {
            model: Post,
            attributes: ['id', 'title', 'created_at',],
            include: {
            model: User,
            attributes: ['username']
            }
          } 
      ]
    })
      .then(dbCommentData => {
        if (dbCommentData) {
            // serialize data
          const comment = dbCommentData.get({ plain: true });
        //   render template
          res.render('edit-comment', {
            comment,
            loggedIn: true
          });
        } else {
          res.status(404).end();
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

module.exports = router;
