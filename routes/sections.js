const express = require('express');
const mongoose = require('mongoose');
const { Batch } = require('../models/batch');
const router = express.Router();
const { Section, validate } = require('../models/section');
const auth = require('../middleware/auth');
const privilege = require('../middleware/privilege');

router.get('/', async (req, res) => {
  try {
    if (req.query.batch) {
      return res.send(await Section.find({ 'batch._id': req.query.batch }));
    }

    return res.send(await Section.find().select('-__v'));
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).select('-__v');
    if (!section)
      return res.status(404).send('Section with the given ID was not found.');
    return res.send(section);
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

router.post('/', [auth, privilege(1000)], async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);
    const batch = await Batch.findById(req.body.batchId);
    if (!batch)
      res
        .status(400)
        .send('Attempting to add a section to a batch that does not exist.');

    const sectionWithSameNumber = await Section.findOne({
      'batch._id': batch._id,
      number: req.body.number,
    });

    if (sectionWithSameNumber)
      return res.status(400).send('Section already exists in batch...');
    const newSection = new Section({
      batch: {
        _id: batch._id,
        number: batch.number,
      },
      number: req.body.number,
      groupChatId: req.body.groupChatId,
      channelId: req.body.channelId,
      leader: req.body.leader,
    });
    const dbConnection = mongoose.connection;
    const dbSession = await dbConnection.startSession();
    try {
      dbSession.startTransaction();
      await newSection.save({ dbSession });
      batch.sections.push({
        _id: newSection._id,
        number: newSection.number,
      });
      await batch.save({ dbSession });
      dbSession.commitTransaction();
      dbSession.endSession();
      return res.send(newSection);
    } catch (exc) {
      await dbSession.abortTransaction();
      return res.status(500).send('Section Batch transaction failed..');
    }
  } catch (exc) {
    return res.status(500).send(exc.message);
  }
});

router.delete('/:id', [auth, privilege(1000)], async (req, res) => {
  const section = await Section.findByIdAndDelete(req.params.id);
  if (!section)
    return res.status(404).send('Section with the given ID was not found.');
});

module.exports = router;
