const { Role, validate } = require('../models/role');
const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    return res.send(await Role.find().select('-__v'));
  } catch (exc) {
    return res.status(404).send(exc.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).select('-__v');
    if (!role)
      return res.status(404).send('Role with the given ID was not found');
    return res.send(role);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const roleInDb = await Role.findOne({ name: req.body.name });
    if (roleInDb)
      return res.status(400).send('Role with the same name already stored.');

    const newRole = new Role(req.body);
    await newRole.save();
    return res.send(newRole);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const roleInDb = await Role.findOne({ name: req.body.name });

    if (roleInDb && !roleInDb._id.equals(req.params.id))
      return res.status(400).send('Role with the same name already stored.');

    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!role)
      return res.status(404).send('Role with the given ID was not found');
    return res.send(role);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role)
      return res.status(404).send('Role with the given ID was not found.');
    return res.send(role);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

module.exports = router;
