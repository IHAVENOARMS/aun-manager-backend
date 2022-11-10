const allArabic = /^[\u0621-\u064A]+$/;
const allEnglish = /^[a-zA-Z]+$/;
const moodleUsername = /^\w{7}@\w{4}$/;

const swearWords =
  /عرص|متناك|خول|شرموط|^[خ]{3,}$|كسم|قحب|لبوة|بتتناك|بضين|بضان|احا|منايكة|طيز/;

const gratitude = /شكرا|ميرسي|مرسي|حبيبي|الله يخليك/;

const approval = /بر[ا]{1,}ف[و]{1,}|عا[ا]{1,}ش/;

module.exports = {
  allArabic,
  allEnglish,
  moodleUsername,
  swearWords,
  gratitude,
  approval,
};
