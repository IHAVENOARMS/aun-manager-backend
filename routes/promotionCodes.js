const { PromotionCode, validate } = require('../models/promotionCode');
const express = require('express');
const { Role } = require('../models/role');
const { Batch } = require('../models/batch');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (req.query.code)
      return res.send(
        await PromotionCode.findOne({ code: req.query.code })
          .select('-__v')
          .select('-timesToBeUsed')
      );
    return res.send(await PromotionCode.find().select('-__v').select('-code'));
  } catch (exc) {
    return res.status(404).send(exc.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const promotionCode = await PromotionCode.findById(req.params.id)
      .select('-__v')
      .select('-code');
    if (!promotionCode)
      return res
        .status(404)
        .send('Promotion code with the given ID was not found');
    return res.send(promotionCode);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const promotionCodeInDb = await PromotionCode.findOne({
      code: req.body.code,
    });
    if (promotionCodeInDb)
      return res.status(400).send('Promotion Code already exists.');

    const role = await Role.findById(req.body.roleId);
    if (!role)
      return res.status(400).send('Role with the given ID does not exist.');
    let batch;
    if (req.body.batchId) {
      batch = await Batch.findById(req.body.batchId);
      if (!batch)
        return res.status(400).send('Batch with the given ID does not exist.');
    }
    const newPromotionCode = new PromotionCode(req.body);
    newPromotionCode.role = role._id;
    if (batch) newPromotionCode.batch = batch._id;

    await newPromotionCode.save();
    return res.send(newPromotionCode);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const promotionCodeInDb = await PromotionCode.findOne({
      code: req.body.code,
    });

    if (promotionCodeInDb && !roleInDb._id.equals(req.params.id))
      return res.status(400).send('Promotion code already stored.');

    const promotionCode = await PromotionCode.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!promotionCode)
      return res
        .status(404)
        .send('Promotion code with the given ID was not found');
    return res.send(promotionCode);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const promotionCode = await PromotionCode.findByIdAndDelete(req.params.id);
    if (!promotionCode)
      return res
        .status(404)
        .send('Promotion code with the given ID was not found.');
    return res.send(promotionCode);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

module.exports = router;
