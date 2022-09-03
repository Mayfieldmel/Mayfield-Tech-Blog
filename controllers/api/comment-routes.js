const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /api/comments
router.get('/', (req, res) => {
    // get all comments
  Comment.findAll({
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Post,
        attributes: ["title"],
      },
    ],
  })
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
  });
});

// GET /api/comments/1
router.get('/:id', (req, res) => {
    // get single comment
  Comment.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Post,
        attributes: ["title"],
      },
    ],
  })
    .then((dbCommentData) => {
        if(!dbCommentData) {
            res.status(404).json({message: 'No comment found with this id!'});
            return;
        }
        res.json(dbCommentData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
  });
});

// POST /api/comments
router.post('/', withAuth, (req, res) => {
  // create comment
  Comment.create({
    comment_text: req.body.comment_text,
    user_id: req.session.user_id,
    post_id: req.body.post_id
  })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

// PUT /api/comments/1
router.put('/:id', (res, req) => { // ADD WITH AUTH AFTER TEST
    // edit comment
    Comment.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if(!dbCommentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

// DELETE /api/comments/1
router.delete('/:id', withAuth, (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbCommentData => {
      if (!dbCommentData) {
        res.status(404).json({ message: 'No comment found with this id!' });
        return;
      }
      res.json(dbCommentData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
