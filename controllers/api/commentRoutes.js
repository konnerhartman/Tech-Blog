const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');
// The `/api/comments` endpoint
// get all comments
router.get('/', async (req, res) => {
  // find all comments
  // be sure to include its associated Category and Tag data
  try {
    const commentData = await Comment.findAll({});
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new comment
router.post('/', withAuth, (req, res) => {
  Comment.create({
    user_comment: req.body.user_comment,
    post_id: req.body.post_id,
    user_id: req.session.user_id
  }).then((result)=>{
    res.status(200).json(result)
  })
  
    .catch((err) => {
        console.log(err);
        res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one comment by its `id` value
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;