const express = require('express');
const auth = require('../middleware/auth');
const privilege = require('../middleware/privilege');
const router = express.Router();
const { Batch, validate } = require('../models/batch');

router.get('/', async (req, res) => {
  try {
    if (req.query.year) {
      const batch = await Batch.findOne({ year: req.query.year }).select(
        '-__v'
      );
      if (!batch)
        return res
          .status(404)
          .send('Batch with the given year was not found..');
      return res.send(batch);
    }
    return res.send(await Batch.find().select('-__v'));
  } catch (exc) {
    return res.status(404).send(exc.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).select('-__v');
    if (batch) {
      return res.send(batch);
    } else {
      return res.status(404).send('Batch with the given ID was not found');
    }
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.post('/', [auth, privilege(1000)], async (req, res) => {
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

router.put('/:id', [auth, privilege(1000)], async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!batch)
      return res.status(404).send('Batch with the given ID was not found');
    return res.send(batch);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.delete('/:id', [auth, privilege(1000)], async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch)
      return res.status(404).send('The batch with the given ID was not found.');
    return res.send(batch);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

module.exports = router;
