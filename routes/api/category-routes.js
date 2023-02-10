const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try {
    const allCat = await Category.findAll({
      include: [{ model: Product}],
    })
    res.status(200).json(allCat)
  } catch (err) {
    res.status(500)
  }
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCat = await Category.create(req.body);
    res.status(200).json(newCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updateCat = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json(updateCat)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deleteCat = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if(!deleteCat) {
      res.status(404).json('no category with id beep bop boop')
    }
    res.status(200).json(deleteCat)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
