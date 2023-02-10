const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const allTag = await Tag.findAll({
      include: [{model: Product, through: ProductTag}]
    })
    res.status(200).json(allTag);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const idTag = await Tag.findByPk({
      include: [{model: Product, through: ProductTag}]
    })
    res.status(200).json(idTag);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updateTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json(updateTag)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deleteTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if(!deleteTag) {
      res.status(404).json('no tag with that id beep bop boop')
    }
    res.status(200).json(deleteTag)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
