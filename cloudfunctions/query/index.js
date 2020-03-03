const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const todos=db.collection("todos")
exports.main = async (event, context) => {
	return await todos.get();
}