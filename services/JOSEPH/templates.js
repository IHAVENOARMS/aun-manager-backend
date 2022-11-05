const { countries } = require('countries-list');
const { TelegramGroup } = require('../../models/telegramGroup');
const _ = require('underscore');
const welcome = (user) => {
  const gender = user.gender;
  const isFemale = gender === 'f';

  return `إزيك يا ${user.arabicName.split(' ')[0]} انا JOSEPH 🤖, 
  من هنا و رايح انا هبقا المساعد الشخصي بتاعك في الكلية! 

  🛑 هقوللك لما شؤون الطلبة يحتاجوك${
    isFemale ? 'ي' : ''
  } بشكل خاص منغير ما نكتب اسمك علني علي اي قناة!

  📝هدخل لك علي موقع الكلية بنفسي قبل معاد رصد الكويزات و اتاكدلك انك ${
    isFemale ? 'حاللة' : 'حالل'
  } كل حاجة.

  📢هبعتلك التنبيهات اللي تهمك لحد عندك برايفيت من غير ما ${
    isFemale ? 'تحتاجي تفتحي' : 'تحتاج تفتح'
  }  اي قنوات مليانة معلومات ملهاش لازمة.

  لو قابلتك اي مشاكل معايا يا ريت ${
    isFemale ? 'تقولي' : 'تقول'
  } ليوسف (مطور السيستم) 
  @YousefGamal2`;
};

const unRecognized = () => {
  return `انا معرفش انت مين...`;
};

const missingPassword = (user) => {
  const name = user.arabicName;
  const firstName = name.split(' ')[0];
  const isFemale = user.gender === 'f';
  return `يا ${firstName} ${
    isFemale ? 'انتي' : 'انت'
  } عندي في السيستم بس محتاج كلمة سرك الاول, ${isFemale ? 'ابعتي' : 'ابعت'} 
    /password 
    و ${isFemale ? 'اكتبي' : 'اكتب'} بعدها كلمة سرك عشان ${
    isFemale ? 'تدخليها' : 'تدخلها'
  }`;
};

const userNotAuthorized = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale) return 'معندكيش الصلاحية انك تبعتي الامر دا🛑';
  return 'معندكش الصلاحية انك تبعت الامر دا🛑';
};

const pleaseEnterPassword = () => {
  return 'لو سمحت دخل كلمة سرك بعد الامر😊';
};

const wrongPassword = () => {
  return 'كلمة السر اللي انت دخلتها غلط😊, اتاكد انك كاتبها صح, خدها كوبي بالظبط و اطبعها هنا زي ما هي متحاولش تكتبها بنفسك';
};

const alreadyEnteredPassword = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale)
    return `انتي ربطتي الاكونت بتاعك بيا خلاص مش محتاجة تدخلي كلمة السر تاني😄`;
  return `انت ربطت الاكونت بتاعك بيا خلاص مش محتاج تدخل كلمة السر تاني😄`;
};

const dontBelongToBatch = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale) return `انتي مش مسجلة تبع اي دفعة...`;
  return `انت مش مسجل تبع اي دفعة...`;
};

const userInfo = (user, batch, section) => {
  const isFemale = user.gender === 'f';
  const isChristian = user.religion === 'ch';
  return `بيانات الطالب علي السيستم 🤖: 
  اسم المستخدم: ${user.username}

  الاسم بالعربي: ${user.arabicName}

  الاسم بالانجليزي: ${user.englishName}

  الجنس: ${isFemale ? 'انثي' : 'ذكر'}

  الديانة: ${isChristian ? 'مسيحي✝️' : 'مسلم☪️'}

  ارقام التليفون: 
  ${user.phoneNumbers
    .map((pn) => `${pn.number} ${pn.hasWhatsapp ? `with` : `with no`} Whatsapp`)
    .join('\n')}

  الدولة: ${countries[user.country.toUpperCase()].native}

  رقم الدفعة: ${user.batch.number}

  ليدرز الدفعة: ${
    batch.leaders.length > 0
      ? batch.leaders.map((leader) => leader.arabicName).join('\n')
      : 'لسة متحددوش..'
  }

  رقم السيكشن: ${user.section.number}

  ليدر السيكشن: ${_.get(section.leader, 'arabicName', 'لسة متحددش...')}

البيانات علي موقع الكلية:
  ${
    user.moodleInfo
      ? ` 
  Username: ${user.moodleInfo.username}
  Password: ${user.moodleInfo.password}`
      : 'غير معطاه...'
  }`;
};

const userNotFound = (user) => {
  const isFemale = user.gender === 'f';
  const firstName = user.arabicName.split(' ')[0];
  if (isFemale)
    return `مقدرتش الاقيلك طالب بالاسم دا في دفعتك عندي.. سوري يا ${firstName} 🥺😔`;
  return `مقدرتش الاقيلك طالب بالاسم دا في دفعتك...`;
};

const pleaseEnterUserArabicName = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale) return `اكتبي اسم الطالب رباعي بعد الامر..`;
  return `اكتب اسم الطالب رباعي بعد الامر..`;
};

const successfullySetBatchLink = (user) => {
  return `لينك القناة اتحفظ عندي😁, من هنا و رايح اي حد هيطلبه من دفعتك هبعتهوله, لو عايزني اقبلك و ارفضلك طلبات الدخول ضيفني في القناة و اتاكد ان اللينك  بيحتاج طلبات دخول..`;
};

const notAdminInChannel = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale)
    return `انا مقدرتش اعمل لينك لقناة دفعتك, اتاكدي ان انا admin في القناة, و ان عندي صلاحية اني اعمل لينكات و ان قناة دفعتك متسجلة في السيستم (كلم يوسف عشان تسجلها)...`;
  return `انا مقدرتش اعمل لينك لقناة دفعتك, اتاكد ان انا admin علي القناة و اني عندي الصلاحية اني اعمل لينكات و و ان قناة دفعتك متسجلة في السيستم (كلم يوسف عشان تسجلها)...`;
};

const channelLinkAlreadyTaken = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale)
    return `هو انا اللينك دا متسجل عندي بإسم دفعة تانية فا مش هقدر اضيفه بإسم دفعتك..., اتاكدي انك نسختي اللينك الصح😁`;
  return `هو انا اللينك دا متسجل عندي بإسم دفعة تانية فا مش هقدر اضيفه بإسم دفعتك.., اتاكد انك نسخت اللينك الصح😁`;
};

const channelLinkAlreadySet = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale) return `نفس اللينك دا متسجل عندي مش محتاجاه تضيفيه خلاص😁`;
  return `نفس اللينك دا متسجل عندي مش محتاج تضيفه خلاص😁`;
};

const userAcceptedInChannel = (user) => {
  const isFemale = user.gender === 'f';
  const firstName = user.arabicName.split(' ')[0];
  if (isFemale)
    return `تمام يا ${firstName} قبلتك علي قناة الدفعة كدة, ربنا معاكي❤️`;
  return `تمام يا ${firstName} قبلتك علي قناة الدفعة كدة, ربنا معاك❤️`;
};

const chatNotYours = (user, chat) => {
  const isFemale = user.gender === 'f';
  const firstName = user.arabicName.split(' ')[0];
  const chatTypeMapper = {
    group: 'شات',
    channel: 'قناة',
    supergroup: 'شات',
  };
  const chatForMapper = {
    batch: 'دفعة',
    section: 'سيكشن',
    leaders: 'ليدرز',
  };

  if (isFemale)
    return `يا ${firstName} واضح انك بتحاولي تدخلي ${
      chatTypeMapper[chat.type]
    } ${
      chatForMapper[chat.for.split(' ')[0]]
    } مش بتاعتك, انا اسف بس مش هقدر اسمحلك تدخلي, لو عايزة اخبار خلي حد من هناك يبعتهالك😊`;

  return `يا ${firstName} واضح انك بتحاول تدخل ${chatTypeMapper[chat.type]} ${
    chatForMapper[chat.for.split(' ')[0]]
  } مش بتاعتك, انا اسف بس مش هقدر اسمحلك تدخل, لو عايز اخبار خلي حد من هناك يبعتهالك😊`;
};

const acceptedInChat = (user, chat) => {
  const isFemale = user.gender === 'f';
  const firstName = user.arabicName.split(' ')[0];
  const chatTypeMapper = {
    group: 'شات',
    channel: 'قناة',
    supergroup: 'شات',
  };

  const chatForMapper = {
    batch: 'الدفعة',
    section: 'السيكشن',
    leaders: 'الليدرز',
  };

  if (isFemale)
    return `تمام يا ${firstName} قبلتك علي ${chatTypeMapper[chat.type]} ${
      chatForMapper[chat.for.split(' ')[0]]
    }, ربنا معاكي💙`;

  return `تمام يا ${firstName} قبلتك علي ${chatTypeMapper[chat.type]} ${
    chatForMapper[chat.for.split(' ')[0]]
  }, ربنا معاك💙`;
};

const pleaseEnterChannelLink = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale) return `لو سمحتي دخلي لينك القناة بعد الامر😊`;
  return `لو سمحت دخل لينك القناة بعد الامر😊`;
};

const pleaseEnterGroupChatLink = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale) return `لو سمحتي دخلي لينك جروب الشات بعد الامر😊`;
  return `لو سمحت دخل لينك جروب الشات بعد الامر😊`;
};

const groupChatLinkAlreadyTaken = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale)
    return `لينك جروب الشات دا متسجل عندي بإسم دفعت انية, مش هقدر اضيفه لدفعتك, اتاكدي انك نسختي اللينك صح😊`;
  return `لينك جروب الشات دا متسجل عندي بإسم دفعة تاني, مش هقدر اضيفه لدفعتك, اتاكد انك نسخت اللينك الصح😊`;
};

const successfullySetGroupChatLink = (user) => {
  return `تمام كدة انا ضفت لينك جروب الشات عندي😁, من هنا و رايح كل اللي هيطلبه مني هبعتهوله`;
};

const test = (user) => {
  const isFemale = user.gender === 'f';
  const firstName = user.arabicName.split(' ')[0];
  if (isFemale) return `متقلقيش يا ${firstName} انا شغال كويس😊`;
  return `متقلقش يا ${firstName} انا شغال كويس😊`;
};

const botNotAuthorized = () => {
  return `معنديش صلاحية اني اعمل كدة في الشات دا...`;
};

const hiddenTelegramUsername = () => {
  return `واضح انك مخبي التليجرام بتاعك, و انا مش قادر اعرف انت معايا في السيستم و لا لا, بس ميهمكش عادي اكتب كلمة السر بتاعتك وانا هعرفك
  `;
};

const groupLink = (group) => {
  if (!group) return '';
  const type = group.type;
  const chatFor = group.for.split(' ')[0];
  const chatForArabic = {
    section: 'السيكشن',
    batch: 'الدفعة',
    leaders: 'الليدرز',
  };
  return `لينك ${type === 'channel' ? `قناة` : `شات`} ${
    chatForArabic[chatFor]
  }: ${group.inviteLink}
  `;
};

const batchLinks = async (batch, isSectionLeader = false) => {
  const batchGroup =
    batch.groupChat && (await TelegramGroup.findById(batch.groupChat));

  const batchChannel =
    batch.channel && (await TelegramGroup.findById(batch.channel));

  const leadersChat = isSectionLeader
    ? batch.leadersChat && (await TelegramGroup.findById(batch.leadersChat))
    : undefined;
  return (
    groupLink(batchGroup) + groupLink(batchChannel) + groupLink(leadersChat)
  );
};

const sectionLinks = async (section) => {
  const sectionGroup =
    section.groupChat && (await TelegramGroup.findById(section.groupChat));

  const sectionChannel =
    section.channel && (await TelegramGroup.findById(section.channel));

  return groupLink(sectionChannel) + groupLink(sectionGroup);
};

const links = async (user, batch, section) => {
  const isFemale = user.gender === 'f';
  const sectionLeader = section.leader;
  const isSectionLeader = user._id.equals(sectionLeader);

  return (
    `كل اللينكات الخاصة بيك${isFemale ? 'ي' : ''}:

` +
    `${await batchLinks(batch, isSectionLeader)}
${await sectionLinks(section)}`
  );
};

const couldNotDoThat = () => {
  return `مقدرتش اعمل كدة.. لسبب ما...`;
};

const congratsNewSectionLeader = (user) => {
  const isFemale = user.gender === 'f';
  const firstName = user.arabicName.split(' ')[0];
  if (isFemale)
    return `مبروك مبروك مبرووك🥳🥳🥳
  الف مبروك يا ${firstName} دلوقت انتي رسميا بقيتي ليدر سيكشن, و تقدري تدخلي جروب الليدرز بتاع دفعتك💙🥳`;

  return `مبروك مبروك مبرووك🥳🥳🥳
  مبروك يا ${firstName} انت دلوقت بقيت رسميا ليدر سيكشن و تقدر تدخل جروب الليدرز بتاع دفعتك🥳❤️`;
};

const introNewSectionLeader = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale)
    return `كدة ${user.arabicName.split(' ')[0]} هي رسميا ليدر سيشكن ${
      user.section.number
    } و اي حد لو عايز حاجة يكلمها هي الاول قبل ما يكلم ليدر الدفعة انا خليتها ادمن في الجروب هنا و هتبقا ادمن علي قناة السيكشن برضو, و هي اللي هتبقا مسؤولة عن كل الاعلانات اللي تخص السيكشن هنا `;

  return `كدة ${user.arabicName.split(' ')[0]} هو رسميا ليدر سيكشن ${
    user.section.number
  } و اي حد لو عايز حاجة يكلمه هو الاول قبل ما يكلم ليدر الدفعة, انا خليته ادمن في الجروب هنا, وهيبقا ادمن برضو علي قناة السيكشن, و هو اللي هيبقا مسؤول عن كل الاعلانات اللي تخص السيكشن هنا`;
};

const noSwearWordsAllowed = (user) => {
  const isFemale = user.gender === 'f';
  const firstName = user.arabicName.split(' ')[0];
  let blurredFirstName;
  if (user) {
    blurredFirstName = firstName[0] + '*'.repeat(4);
  }
  if (isFemale)
    return `لو سمحتي  ${
      blurredFirstName ? `يا ${blurredFirstName}` : ''
    } الشتيمة مش مسموحة علي الجروب دا...انا مسحت المسج حماية ليكي... يا ريت متشتمش ليك..`;
  return `لو سمحت  ${
    blurredFirstName ? `يا ${blurredFirstName}` : ''
  } الشتيمة مش مسموحة علي الجروب دا... انا مسحت المسج حماية ليك.. يا ريت متشتمش تاني...`;
};

const dontSwearInfrontOfMe = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale) return `يعني ميهمكيش بس... يا ريت متشتميش قدامي..☺️`;
  return `يعني هو ميهمكش بس... يا ريت متشتمش قدامي..☺️`;
};

const sentFrom = (user) => {
  const name = user.arabicName.split(' ').slice(0, 2).join(' ');
  return `مرسلة من: ${name}`;
};

const couldNotLogInForYou = (user) => {
  const isFemale = user.gender === 'f';
  if (isFemale)
    return `مقدرتش ادخلك علي موقع الكلية.. اتاكدي انك مغيرتيش اسم المستخدم او كلمة السر بتاعتك علي الموقع...`;
  return `مقدرتش ادخلك علي موقع الكلية... اتاكد انك مغيرتش اسم المستخدم او كلمة السر بتاعتك علي الموقع...`;
};

const quizWasAttendedBefore = (user, quiz) => {
  return `كويز ${quiz.name} في بلوك ${quiz.course.name} محلول عندك تمام✅

  http://aunonline.aun.edu.eg/med-ns/mod/quiz/view.php?id=${quiz.id}`;
};

const quizWasNotAttendedBefore = (user, quiz) => {
  return `كويز ${quiz.name} في بلوك ${quiz.course.name} مش محلول عندك!!🛑🛑
  اتاكد انك حليته قبل الساعة 12 يوم السبت...

  ${
    quiz.hasPendingAttempt
      ? 'و كمان فيه محاولة مش معمولها submit, ادخل خلصها..'
      : ''
  }

  http://aunonline.aun.edu.eg/med-ns/mod/quiz/view.php?id=${quiz.id}`;
};

const quizHasPendingAttempt = (user, quiz) => {
  return `كويز ${quiz.name} في بلوك ${quiz.course.name} فيه محاولة مش كاملة فيه...⚠️

  http://aunonline.aun.edu.eg/med-ns/mod/quiz/view.php?id=${quiz.id}`;
};

const batchDoesNotHaveSchedule = (user) => {
  return `جدول دفعتك مش متسجل علي السيستم... مقدرتش اعرف ابصلك في انهي كويزات...`;
};

module.exports = {
  welcome,
  test,
  userInfo,
  sentFrom,
  noSwearWordsAllowed,
  userNotAuthorized,
  missingPassword,
  unRecognized,
  botNotAuthorized,
  pleaseEnterPassword,
  wrongPassword,
  alreadyEnteredPassword,
  dontBelongToBatch,
  userNotFound,
  pleaseEnterUserArabicName,
  successfullySetBatchLink,
  notAdminInChannel,
  channelLinkAlreadyTaken,
  userAcceptedInChannel,
  introNewSectionLeader,
  groupLink,
  chatNotYours,
  pleaseEnterChannelLink,
  channelLinkAlreadySet,
  pleaseEnterGroupChatLink,
  groupChatLinkAlreadyTaken,
  successfullySetGroupChatLink,
  hiddenTelegramUsername,
  acceptedInChat,
  couldNotDoThat,
  congratsNewSectionLeader,
  links,
  dontSwearInfrontOfMe,
  quizWasAttendedBefore,
  quizWasNotAttendedBefore,
  quizHasPendingAttempt,
  couldNotLogInForYou,
  batchDoesNotHaveSchedule,
};
