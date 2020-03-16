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
    return await db.collection('store').doc(event.storeID).set({
      data: event.data
    })
  } catch (e) {
    console.error(e)
  }
}