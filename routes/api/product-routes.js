const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    // finds all products, including associated Category and Tag data
    const productsData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }]
    });
    res.status(200).json(productsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    // finds a single product by its `id`, including associated Category and Tag data
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  };
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      category_id: 1,
      tagIds: [1, 2, 3, 4]
    }
  */
 try {
  //creates the product
  const product = await Product.create(req.body);
  //checks if the user passed in a tagId array, and creates new ProductTags if so
  if (req.body.tagIds.length) {
    const productTagIdArr = req.body.tagIds.map((tag_id) => {
      return {
        product_id: product.id,
        tag_id,
      };
    });
    const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
    res.status(201).json(productTagIds)
  } else {
  // if no product tags, just respond
  res.status(200).json(product);
  }
 } catch (err) {
    console.log(err);
    res.status(400).json(err);
 }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    // updates product
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    //checks if the user passed in a tagId array, and updates related ProductTags if so
    if (req.body.tagIds) {
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      const updatedProductTags = await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);

      res.status(201).json(updatedProductTags);
    } else {
      // if no product tags changed, just respond
      res.status(200).json(`Product #${req.params.id} updated.`)
    };
  } catch (err) {
    res.status(400).json(err);
  };
});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    // deletes the product and any associated product_tags
    await Product.destroy({ where: { id: req.params.id } });
    res.status(200).json(`Poduct #${req.params.id} deleted.`);
  } catch (err) {
    res.status(500).json(err);
  };
});

module.exports = router;