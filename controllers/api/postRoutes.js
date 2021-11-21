const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');
// The `/api/posts` endpoint
// get all posts
router.get('/', async (req, res) => {
  // find all posts
  // be sure to include its associated Category and Tag data
  try {
    const postData = await Post.findAll(req.params.id, {
      attributes: [
        'id',
        'title',
        'content',
        'date_created'
      ],
      order: [
        ['date_created', 'DESC']
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        },
      ],
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one post
router.get('/:id', async (req, res) => {
  // find a single post by its `id`
  // be sure to include its associated Category data
  try {
    const postData = await Post.findByPk(req.params.id, {
        attributes: [
            'id',
            'title',
            'content',
            'date_created'
        ],
        order: [
            ['date_created', 'DESC']
        ],
        include: [
            {
            model: User,
            attributes: ['username']
            },
        ],
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new post
router.post('/', withAuth, (req, res) => {
  Post.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.user_id
  }).then((result)=>{
    res.status(200).json(result)
  })
  
    .catch((err) => {
        console.log(err);
        res.status(400).json(err);
    });
});

// update post
router.put('/:id', withAuth, (req, res) => {
  // update post data
  Post.update({
    title: req.body.title,
    content: req.body.content,
  },
  {
    where: {
      id: req.params.id,
    },
  })
  .then(postData => {
    if (!postData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
    }
    res.json(postData);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

router.delete('/:id', async (req, res) => {
  // delete one post by its `id` value
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
