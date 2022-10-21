const arabicNormChar = {
  ك: 'ک',
  ﻷ: 'لا',
  ؤ: 'و',
  ى: 'ی',
  ي: 'ی',
  ئ: 'ی',
  أ: 'ا',
  إ: 'ا',
  آ: 'ا',
  ٱ: 'ا',
  ٳ: 'ا',
  ة: 'ه',
  ء: '',
  چ: 'ج',
  'ِ': '',
  'ْ': '',
  'ُ': '',
  'َ': '',
  'ّ': '',
  'ٍ': '',
  'ً': '',
  'ٌ': '',
  'ٓ': '',
  'ٰ': '',
  'ٔ': '',
  '�': '',
};

module.exports = function (str) {
  return str
    .replace(/[^\u0000-\u007E]/g, function (a) {
      let retval = arabicNormChar[a];
      if (retval == undefined) {
        retval = a;
      }
      return retval;
    })
    .normalize('NFKD')
    .toLowerCase();
};
