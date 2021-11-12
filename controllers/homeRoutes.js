const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user/comment data
    const postData = await Post.findAll({
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

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
        posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
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
    ],
});

    const post = postData.get({ plain: true });

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

module.exports = router;