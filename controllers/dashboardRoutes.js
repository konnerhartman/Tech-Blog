const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Use withAuth middleware to prevent access to route
router.get('/', withAuth, async (req, res) => {
    try {
      // Get all posts and JOIN with user/comment data
      const postData = await Post.findAll({
        where: {
          user_id: req.session.user_id
        },
        attributes: [ 
          'id', 
          'title', 
          'content', 
          'date_created'
        ],
        include: [
          {
              model: User,
              attributes: ['username'],
          },
          {
              model: Comment,
              attributes: ['id', 'user_comment', 'post_id', 'date_created'],
              include: {
                  model: User,
                  attributes: ['username']
              }
          }
        ]
      });
  
      // Serialize data so the template can read it
      const posts = postData.map((post) => post.get({ plain: true }));
  
      // Pass serialized data and session flag into template
      res.render('dashboard', { 
          posts, 
        logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
router.get('/:id', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const postData = await Post.findAll(req.session.user_id, {
        attributes: [ 'id', 'title', 'content', 'date_created'],
        include: [
          {
              model: User,
              attributes: ['username'],
          },
          {
              model: Comment,
              attributes: ['id', 'user_comment', 'post_id', 'date_created'],
              include: {
                  model: User,
                  attributes: ['username']
              }
          }
        ]
      });
  
      const post = postData.get({ plain: true });
  
      res.render('dashboard', {
        ...post,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;