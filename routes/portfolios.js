const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const stream = require('stream');

const express = require('express');
const auth = require('../middleware/auth');
const Joi = require('joi');
const { User } = require('../models/user');
const router = express.Router();

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);
  if (!user)
    return res
      .status(400)
      .send('Trying to get a portfolio for a student that no longer exists.');

  const content = fs.readFileSync(
    path.resolve(__dirname, `../templates/portfolios/${req.body.block}.docx`),
    'binary'
  );

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)

  const generalReflectionPoints = [
    'The formative assessments helped me assess my understanding.',
    'The quizzes were helpful after each lecture.',
    'I learned what the different types of research is and how each of them is done.',
    'I learned about many different verified sources that can help me conduct my research later in my career.',
    'I learned about the best ethical practices when choosing what treatment to give the patient',
    'I found the subject of research quite complicated but it was fun nontheless.',
    'Remembering to do each quizz on time can be quite stressing sometimes.',
    'The E-learning website was slow at times but it was quite helpful.',
    'The lectures always started on time.',
    'The lecturers were really nice and interesting to listen to.',
  ];

  const miniReflection = [
    'The lecture was interesting.',
    'I found the lecture difficult to understand.',
    'I found the subject very interesting.',
    'The lecture was good.',
    'The lecture was not very interesting.',
    'I was really interested.',
    "The lecture wasn't very difficult.",
    'It was quite an interesting topic.',
    'The lecture was fun to listen to.',
    'I really liked the lecture.',
    'It was a very good lecture.',
    'The lecture touched on an important topic.',
    'I found the lecture difficult.',
    'It was a difficult subject.',
  ];
  const isGroupAB = user.section.number >= 1 && user.section.number <= 10;
  const rendered =
    req.body.block === 'EBM-336'
      ? {
          englishName: user.englishName,
          arabicName: user.arabicName,
          '23_DOCTOR': req.body.attended23
            ? isGroupAB
              ? `Prof. Hussein Al khayyat/ أد. حسين الخياط`
              : `Prof. Emad Zareef/ أد.عماد ظريف`
            : '',
          '23_REFLECTION': req.body.attended23
            ? miniReflection[Math.floor(Math.random() * miniReflection.length)]
            : '',
          '23_PLACE': req.body.attended23 ? 'مدرج 1' : '',
          '23_DATE': req.body.attended23 ? '29/12/2022' : '',

          '45_DOCTOR': req.body.attended45
            ? `Prof. Mariam Taher/ أد. مريم طاهر`
            : '',
          '45_REFLECTION': req.body.attended45
            ? miniReflection[Math.floor(Math.random() * miniReflection.length)]
            : '',
          '45_PLACE': req.body.attended45 ? 'مدرج 1' : '',
          '45_DATE': req.body.attended45 ? '19/1/2023' : '',
          GENERAL_REFLECTION: `1-${
            generalReflectionPoints[
              Math.floor(Math.random() * generalReflectionPoints.length)
            ]
          }\n2-${
            generalReflectionPoints[
              Math.floor(Math.random() * generalReflectionPoints.length)
            ]
          }\n3-${
            generalReflectionPoints[
              Math.floor(Math.random() * generalReflectionPoints.length)
            ]
          }`,
        }
      : {
          englishName: user.englishName,
          arabicName: user.arabicName,
          '123_DOCTOR': req.body.attended123
            ? `Prof. Manal Darwish/ أد. منال درويش`
            : '',
          '123_REFLECTION': req.body.attended123
            ? miniReflection[Math.floor(Math.random() * miniReflection.length)]
            : '',
          '123_PLACE': req.body.attended123 ? 'مدرج الصحة العامة' : '',
          '123_DATE': req.body.attended123 ? '17/11/2022' : '',

          '456_DOCTOR': req.body.attended456
            ? `Prof. Manal Darwish/ أد. منال درويش`
            : '',
          '456_REFLECTION': req.body.attended456
            ? miniReflection[Math.floor(Math.random() * miniReflection.length)]
            : '',
          '456_PLACE': req.body.attended456
            ? isGroupAB
              ? 'مدرج ج'
              : 'مدرج 1'
            : '',
          '456_DATE': req.body.attended456 ? '1/12/2022' : '',
          GENERAL_REFLECTION: `1-${
            generalReflectionPoints[
              Math.floor(Math.random() * generalReflectionPoints.length)
            ]
          }\n2-${
            generalReflectionPoints[
              Math.floor(Math.random() * generalReflectionPoints.length)
            ]
          }\n3-${
            generalReflectionPoints[
              Math.floor(Math.random() * generalReflectionPoints.length)
            ]
          }`,
        };
  doc.render(rendered);

  const buf = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });

  res.set(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );

  const bufferStream = new stream.PassThrough();
  bufferStream.end(buf);
  return bufferStream.pipe(res);
});

function validate(req) {
  const joiSchema = Joi.object({
    block: Joi.string().valid('EBM-336', 'IDP-337').required(),
    originalSection: Joi.number().min(1).max(16).required(),
    attended23: Joi.bool(),
    attended45: Joi.bool(),
    attended123: Joi.bool(),
    attended456: Joi.bool(),
  });
  return joiSchema.validate(req);
}

module.exports = router;
