const { private } = require('../middleware');

module.exports = (joseph, command) => {
  joseph.command(command, private(), async (ctx) => {
    ctx.sendMessage(`ازيك, انا JOSEPH, بوت مصمم عشان يبقا مساعد شخصي للطلبة في كلية طب جامعة اسيوط... لو دي اول مرة ليك علي البوت فا انت لازم تدخل كلمةالسر اللي استلمتها لما سجلت علي السيستم
     لو عايز تدخلها اكتب
     /password (و كلمة السر بتاعتك هنا)
     مثلا: 
     /password F1wdAxZ48
     مطور السيستم: يوسف جمال حنين 
     @YousefGamal2`);
  });
};
