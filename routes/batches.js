const express = require('express');
const router = express.Router();
const { Batch, validate } = require('../models/batch');

router.get('/', async (req, res) => {
  try {
    return res.send(await Batch.find());
  } catch (exc) {
    return res.status(404).send(exc.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (batch) {
      return res.send(batch);
    } else {
      res.status(404).send('Batch with the given ID was not found');
    }
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newBatch = new Batch(req.body);
    await newBatch.save();
    return res.send(newBatch);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!batch)
      return res.status(404).send('Batch with the given ID was not found');
    res.send(batch);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

module.exports = router;
