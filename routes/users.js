const mongoose = require('mongoose');
const _ = require('underscore');
const express = require('express');
const router = express.Router();
const joseph = require('../services/JOSEPH/joseph');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const { PromotionCode } = require('../models/promotionCode');
const { Role } = require('../models/role');
const { Batch } = require('../models/batch');
const { MoodleInfo } = require('../models/moodle/info');

router.get('/', async (req, res) => {
  try {
    return res.send(await User.find().select('-__v').select('-password'));
  } catch (exc) {
    return res.status(404).send(exc.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-__v')
      .select('-password');
    if (user) {
      return res.send(user);
    } else {
      return res.status(404).send('User the given ID was not found');
    }
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = req.body;
    if (await userAlreadyExists(user))
      return res.status(400).send('Username is already taken.');

    const promotionCodeInDb = await PromotionCode.findById(
      req.body.promotionCodeId
    );
    if (!promotionCodeInDb && req.body.promotionCodeId) {
      return res
        .status(400)
        .send('Promotion code with the given ID does not exist.');
    }
    let roleId;
    let batchId;
    if (promotionCodeInDb) {
      const promoCodeInfo = getPromotionCodeInfo(promotionCodeInDb);
      roleId = promoCodeInfo.roleId;
      batchId = promoCodeInfo.batchId || req.body.batchId;
    } else {
      roleId = req.body.roleId;
      batchId = req.body.batchId;
    }
    if (!roleId) roleId = (await Role.findOne({ privilege: 0 }))._id;

    const roleInDb = await Role.exists({ _id: roleId });
    if (!roleInDb)
      return res.status(400).send('Role with the given ID doeos not exist.');

    let batchInDb;
    if (batchId) {
      batchInDb = await Batch.findById(batchId);
      if (!batchInDb)
        return res.status(400).send('Batch with the given ID does not exist.');
    }

    let moodleInfoInDb;
    if (req.body.moodleInfoId) {
      moodleInfoInDb = await MoodleInfo.findById(req.body.moodleInfoId);
      if (!moodleInfoInDb)
        return res
          .status(400)
          .send('Moolde info with the given ID does not exist.');
    }

    if (req.body.telegramId) {
      const userWithSameTelegram = await User.exists({
        telegramId: req.body.telegramId,
      });
      if (userWithSameTelegram)
        return res.status(404).send('Telegram ID is already taken.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      arabicName: req.body.arabicName,
      englishName: req.body.englishName,
      gender: req.body.gender,
      country: req.body.country,
      role: roleInDb._id,
      batch: batchInDb
        ? {
            _id: batchInDb._id,
            number: batchInDb.number,
            year: batchInDb.year,
          }
        : undefined,
      moodleInfo: moodleInfoInDb
        ? {
            _id: moodleInfoInDb._id,
            username: moodleInfoInDb.username,
            password: moodleInfoInDb.password,
          }
        : undefined,
      promotedWith: _.get(promotionCodeInDb, 'code'),
      telegramId: req.body.telegramId,
      phoneNumbers: req.body.phoneNumbers,
      josephPassword: joseph.generatePassword(),
    });

    const dbConnection = mongoose.connection;
    const dbSession = await dbConnection.startSession();
    try {
      if (promotionCodeInDb) {
        dbSession.startTransaction();
        if (promotionCodeInDb.timesToBeUsed > 0) {
          promotionCodeInDb.timesToBeUsed -= 1;
          await promotionCodeInDb.save({ dbSession });
          await newUser.save({ dbSession });
          await dbSession.commitTransaction();
        } else {
          return res
            .status(400)
            .send(
              'The Promotion code your are trying to use is no longer valid.'
            );
        }
      } else {
        await newUser.save();
      }
      dbSession.endSession();
    } catch (transactionEx) {
      await dbSession.abortTransaction();
      console.log(transactionEx);
      return res.status(400).send('User promocode transaction failed.');
    }
    return res.send(newUser);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

// router.put('/:id', async (req, res) => {
//   try {
//     const { error } = validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     const userInDb = await User.findOne({ username: req.body.username });

//     if (userInDb && !userInDb._id.equals(req.params.id))
//       return res.status(400).send('Moodle info for this user already stored.');
//     const info = await MoodleInfo.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!info)
//       return res.status(404).send('MoodleInfo with the given ID was not found');

//     return res.send(info);
//   } catch (exc) {
//     return res.status(400).send(exc.message);
//   }
// });

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).send('User with the given ID was not found.');
    return res.send(user);
  } catch (exc) {
    return res.status(400).send(exc.message);
  }
});

async function userAlreadyExists(user) {
  const userInDb = await User.exists({ username: user.username });
  return userInDb ? true : false;
}

function getPromotionCodeInfo(promotionCodeInDb) {
  let roleId;
  let batchId;
  if (!promotionCodeInDb) return { roleId, batchId };
  roleId = promotionCodeInDb.role;
  batchId = promotionCodeInDb.batch;
  return { roleId, batchId };
}
module.exports = router;
