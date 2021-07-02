const mongoose = require('mongoose')
// Schema는 class 라서 new를 붙여줘야한다.
const TodoSchema = new mongoose.Schema({
    value: String, 
    deneAt: Date,
    order: Number,
})

TodoSchema.virtual("todoId").get(function () {
    return this._id.toHexString();      // this._id 그대로 보내면 오류 가능성 있어서 toHexString()으로 보낸다.
})
TodoSchema.set("toJSON", {
    virtuals: true,
})

module.exports = mongoose.model('Todo', TodoSchema)