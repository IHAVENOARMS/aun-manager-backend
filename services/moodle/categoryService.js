const MoodleCategory = require('../../models/moodle/category');
const MoodleCourse = require('../../models/moodle/course');
const { storeCourse } = require('./courseService');

const storeSubCategories = async (moodleUser, category) => {
  const subCategoryIds = [];
  let subCategoryCounter = 0;

  for (let i = 0; i < category.subCategories.length; i++) {
    const subCategory = category.subCategories[i];
    const storedCategory = await MoodleCategory.exists({
      moodleId: subCategory.id,
    });

    if (storedCategory) {
      subCategoryIds.push(storedCategory._id);
      subCategoryCounter++;
    } else {
      const newCategory = await moodleUser.visitCategoryWithId(subCategory.id);
      subCategoryIds.push(await storeCategory(moodleUser, newCategory));
      subCategoryCounter++;
    }
    if (subCategoryCounter === category.subCategories.length) {
      return subCategoryIds;
    }
  }
};

const storeCategoryCourses = async (moodleUser, category, category_id) => {
  const courseIds = [];
  let courseCounter = 0;
  for (let i = 0; i < category.courses.length; i++) {
    const course = category.courses[i];
    const storedCourse = await MoodleCourse.exists({ moodleId: course.id });
    if (storedCourse) {
      courseIds.push(storedCourse._id);
      courseCounter++;
    } else {
      courseIds.push(await storeCourse(moodleUser, course, category_id));
      courseCounter++;
    }
    if (courseCounter === category.courses.length) {
      return courseIds;
    }
  }
};

async function storeCategory(moodleUser, category) {
  const storedCategory = await MoodleCategory.exists({
    moodleId: category.id,
  });

  if (storedCategory) return storedCategory._id;

  let parentCategoryId;

  const parentCategory = category.parentCategory;

  if (parentCategory) {
    const storedParentCategory = await MoodleCategory.exists({
      moodleId: parentCategory.id,
    });

    if (storedParentCategory) {
      parentCategoryId = storedParentCategory._id;
    } else {
      const parentCategory = await moodleUser.visitCategoryWithId(
        category.parentCategory.id
      );
      parentCategoryId = await storeCategory(moodleUser, parentCategory);
    }
  }

  const newCategory = new MoodleCategory({
    moodleId: category.id,
    name: category.name,
    parentCategory: parentCategoryId,
  });

  await newCategory.save();

  newCategory.subCategories = await storeSubCategories(moodleUser, category);
  newCategory.courses = await storeCategoryCourses(
    moodleUser,
    category,
    newCategory._id
  );
  await newCategory.save();

  return newCategory._id;
}

module.exports = { storeCategory };
