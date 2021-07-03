const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Todo = require("./models/todo")
const todo = require("./models/todo")



mongoose.connect("mongodb://localhost/todo-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  debug: true
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
mongoose.set('debug',true)

const app = express()
const router = express.Router()

router.get("/", (req, res) => {
  res.send("Hi!")
})

// 할 일 목록을 가져오기
router.get("/todos", async (req, res) => {
  const todos = await Todo.find().sort("-order").exec();
  res.send({ todos })
})
// 할 일 목록을 저장하기
router.post("/todos", async (req, res) => {
  const { value } = req.body
  const maxOrderTodo = await Todo.findOne().sort("-order").exec()
  let order = 1;

  if (maxOrderTodo) {
    order = maxOrderTodo.order + 1;
  }

  const todo = new Todo({ value, order })
  await todo.save()

  res.send({ todo })
})
// 할 일 순서 변경하기
// router.patch("/todos/:todoId", async (req, res) => {
//   const { todoId } = req.params;
//   const { order } = req.body;
//   // const { value } = req.body;
//   const value = req.body.value;
//   const { done } = req.body;

//   if (done) { 
//     Todo.findByIdAndUpdate(todoId, { _v: '1' }) }

//   if (done != true) {
//     await Todo.findByIdAndUpdate(todoId, { value: value })
//   }
//   const currentTodo = await Todo.findById(todoId);
//   if (!currentTodo) {
//     throw new Error("존재하지 않는 todo 데이터입니다.");
//   }

//   if (order) {
//     const targetTodo = await Todo.findOne({ order }).exec();
//     if (targetTodo) {
//       targetTodo.order = currentTodo.order;
//       await targetTodo.save();
//     }
//     currentTodo.order = order;
//   }

//   await currentTodo.save();

//   res.send({});
// });

router.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const { order, value, done } = req.body;

  const todo = await Todo.findById(todoId).exec();

  const result = await Todo.findOneAndUpdate({_id: todoId}, {deneAt : new Date()})
  console.log(result)

  // const result = await Todo.findOne({_id: todoId}).updateOne({doneAt: new Date()})
  // console.log(result)

  if (order) {
    const targetTodo = await Todo.findOne({ order }).exec();
    if (targetTodo) {
      targetTodo.order = todo.order;
      await targetTodo.save();
    }
    todo.order = order;
  } else if (value) {
    todo.value = value;
  } else if (done !== undefined) {
    todo.doneAt = done ? new Date() : null;
  }
  // console.table( await Todo.find({})  )

  await todo.save();

  res.send({});
});

// 할 일 삭제하기
router.delete("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params
  await Todo.findByIdAndDelete(todoId)
  res.send({})
})

app.use("/api", bodyParser.json(), router)
app.use(express.static("./assets"))

app.listen(5000, () => {
  console.log("서버가 켜졌어요!")
})