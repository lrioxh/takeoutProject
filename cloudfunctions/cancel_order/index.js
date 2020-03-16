
// 云函数入口函数

const cloud = require('wx-server-sdk')
cloud.init({
  env: "test-wyzd6"
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    //这里的update依据是event._id
    return await db.collection("order").doc(event.id).update({
      data: {
        // doneTime: event.doneTime,//订单完成时间
        cancel: true//订单状态
      }
    })
  } catch (e) {
    console.error(e)
  }
}