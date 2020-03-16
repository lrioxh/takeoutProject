// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "test-wyzd6"
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    //这里的update依据是event._id
    return await db.collection("order").get()
  } catch (e) {
    console.error(e)
  }
}
// _.unshift({
//   category: event.category,
//   ingredient: event.dishIngredient,
//   price: event.dishPrice,
//   discountPrice: event.dishDiscountPrice,
//   calories: event.dishCalorie,
//   time: event.offerTime,
//   dishBrief: event.dishBrief,
// })
// doc("b3a7d07f-6909-4184-9579-f02824bdae3e").update({
//   data: {
//     haha: 233,
//   }
// })