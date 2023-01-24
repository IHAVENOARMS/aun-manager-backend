const {
  FinishedAttempt,
} = require('moodle-user/MoodleObjects/attempts/finishedAttempt');
const MoodleQuestion = require('../../models/moodle/question');
const MoodleQuiz = require('../../models/moodle/quiz');

const getQuiz = async (cmid, withQuestions = false) => {
  const storedQuiz = MoodleQuiz.findOne({ moodleId: cmid });
  if (withQuestions) {
    storedQuiz.populate('questions');
  }
  return await storedQuiz;
};

const getQuestion = async (text, cmid) => {
  const storedQuestion = await MoodleQuestion.findOne({
    text: text,
    moodleQuizId: cmid,
  });
  return storedQuestion;
};

const storeQuestionsFromFinishedAttempt = async (finishedAttempt) => {
  const storedQuestionIds = [];
  let questionCounter = 0;
  const questions = finishedAttempt.questions;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const storedQuestion = await getQuestion(
      question.text,
      finishedAttempt.cmid
    );
    if (!storedQuestion) {
      const questionChoices = [];
      question.answerBlock.answers.forEach((answer) => {
        questionChoices.push(answer.label);
      });

      const newQuestion = new MoodleQuestion({
        moodleQuizId: finishedAttempt.cmid,
        text: question.text,
        choices: questionChoices,
        type: question.type,
        answer: question.solutionBlock.solutions[0].label,
      });

      await newQuestion.save();
      storedQuestionIds.push(newQuestion._id);
      questionCounter += 1;
    } else {
      storedQuestionIds.push(storedQuestion._id);
      questionCounter += 1;
    }

    if (questionCounter === questions.length) {
      return storedQuestionIds;
    }
  }
};

const storeQuizFromFinishedAttempt = async (moodleUser, finishedAttempt) => {
  const storedQuiz = await getQuiz(finishedAttempt.cmid);
  if (!storedQuiz) {
    const quiz = await moodleUser.visitQuizWithId(finishedAttempt.cmid);
    const quesitonIds = await storeQuestionsFromFinishedAttempt(
      finishedAttempt
    );
    const storedQuiz = new MoodleQuiz({
      moodleId: finishedAttempt.cmid,
      name: quiz.name,
      course: {
        moodleId: quiz.course.id,
        name: quiz.course.name,
      },
      questions: quesitonIds,
    });
    await storedQuiz.save();
  } else if (storedQuiz && storedQuiz.questions.length === 0) {
    const quesitonIds = await storeQuestionsFromFinishedAttempt(
      finishedAttempt
    );
    storedQuiz.questions = quesitonIds;
    await storedQuiz.save();
  }
};

const constructFinishedAttemptOfQuiz = async (cmid) => {
  const storedQuiz = await getQuiz(cmid, true);
  if (!storedQuiz) return undefined;
  if (storedQuiz.questions.length === 0) return undefined;
  const finishedAttemptQuestions = [];
  for (let i = 0; i < storedQuiz.questions.length; i++) {
    const question = storedQuiz.questions[i];
    finishedAttemptQuestions.push({
      text: question.text,
      solutionBlock: {
        solutions: [
          {
            label: question.answer,
            strippedLabel: question.answer
              .replace(/[^0-9a-z+-,<>=]/gi, '')
              .toLowerCase(),
          },
        ],
      },
    });
  }
  const finishedAttempt = new FinishedAttempt();
  finishedAttempt.cmid = cmid;
  finishedAttempt.id = '0000';
  finishedAttempt.info = {
    startedOn: '',
    completedOn: '',
    timeTaken: 0,
    grade: 10,
    state: 'finished',
  };
  finishedAttempt.questions = finishedAttemptQuestions;
  return finishedAttempt;
};

module.exports = {
  getQuiz,
  storeQuizFromFinishedAttempt,
  constructFinishedAttemptOfQuiz,
};
