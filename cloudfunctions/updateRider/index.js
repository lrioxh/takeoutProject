const cloud = require('wx-server-sdk')
cloud.init({
  env: "test-wyzd6"
})
const db = cloud.database();
const order = db.collection("order")

exports.main = async(event, context) => {
  try {
    return await order.doc(event.id).update({
      data: {
        isTaken_rider: true,
        rider_Detail: 'riderid'
      }
    })
  } catch (e) {
    console.log(e)
  }
}
