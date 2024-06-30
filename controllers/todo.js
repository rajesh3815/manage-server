const todo = require("../models/todo");

const addTodo = async (req, res) => {
  const { taskName, priority, assignto, createdDt, tasks } = req.body;
  const userId = req.userId;

  if (!taskName || !priority || !tasks) {
    return res.status(400).send({
      message: "All fields are requred",
      status: 0,
    });
  }
  try {
    const newTodo = new todo({
      taskName,
      priority,
      assignto,
      createdDt,
      tasks,
      userId,
    });
    await newTodo.save();
    res.send({
      message: "task created Successfully",
      status: 1,
    });
  } catch (error) {
    res.status(400).res.send({
      message: "Errors",
      status: 0,
    });
    console.log("error from set todos:)", error);
  }
};

const getAlltodo = async (req, res) => {
  const userId = req.userId;
  const tasks = await todo.find({ userId });
  try {
    res.send({
      tasks,
      message: " Success",
      status: 1,
    });
  } catch (error) {
    res.status(400).res.send({
      message: "Errors",
      status: 0,
    });
    console.log("error from get all todos:)", error);
  }
};

const getAnalytics = async (req, res) => {
  const userId = req.userId;
  const analytics = {
    backlog: 0,
    highPriority: 0,
    lowPriority: 0,
    moderatePriority: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    deuDat: 0,
  };

  try {
    const tasks = await todo.find({ userId });

    tasks.forEach((task) => {
      // Counting priorities
      if (task.priority === "HIGH PRIORITY") {
        analytics.highPriority += 1;
      } else if (task.priority === "LOW PRIORITY") {
        analytics.lowPriority += 1;
      } else if (task.priority === "MODERATE PRIORITY") {
        analytics.moderatePriority += 1;
      }

      // Counting statuses
      if (task.todoStatus === "todo") {
        analytics.todo += 1;
      } else if (task.todoStatus === "inProgress") {
        analytics.inProgress += 1;
      } else if (task.todoStatus === "done") {
        analytics.done += 1;
      } else if (task.todoStatus === "backlog") {
        analytics.backlog += 1;
      }
      if (task.createdDt) {
        analytics.deuDat += 1;
      }
    });

    // Send the analytics object as a response
    res.json({
      status: 1,
      message: "Success",
      analytics,
    });
  } catch (error) {
    console.log("Error getting analytics:", error);
    res.status(500).json({
      status: 0,
      message: "Error getting analytics",
      error: error.message,
    });
  }
};
const getTaskById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: 1,
      message: "No id",
    });
  }
  try {
    const task = await todo.findOne({ _id: id });
    res.json({
      status: 1,
      message: "Success",
      task,
    });
  } catch (error) {
    console.error("Error getting task by id:", error);
    res.status(500).json({
      status: 0,
      message: "Error getting task by id",
      error: error.message,
    });
  }
};
const getFilterData = async (req, res) => {
  const { filterType, assignto } = req.query;
  const userId = req.userId;
  
  if (!filterType) {
    return res.status(400).json({
      status: 0,
      message: "no filter",
    });
  }
  try {
    let filter = { userId };
    let assFilter = { assignto };
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000;

    const startOfDayIST = new Date(now);
    startOfDayIST.setUTCHours(0, 0, 0, 0);
    startOfDayIST.setTime(startOfDayIST.getTime() + offset);

    const endOfDayIST = new Date(startOfDayIST);
    endOfDayIST.setDate(startOfDayIST.getDate() + 1);

    const startOfWeekIST = new Date(startOfDayIST);
    startOfWeekIST.setDate(
      startOfWeekIST.getDate() - startOfWeekIST.getUTCDay()
    );

    const endOfWeekIST = new Date(startOfWeekIST);
    endOfWeekIST.setDate(startOfWeekIST.getDate() + 7);

    const startOfMonthIST = new Date(now);
    startOfMonthIST.setUTCDate(1);
    startOfMonthIST.setUTCHours(0, 0, 0, 0);
    startOfMonthIST.setTime(startOfMonthIST.getTime() + offset);

    const endOfMonthIST = new Date(startOfMonthIST);
    endOfMonthIST.setUTCMonth(startOfMonthIST.getUTCMonth() + 1);

    switch (filterType) {
      case "Today":
        filter.createdAt = { $gte: startOfDayIST, $lt: endOfDayIST };
        assFilter.createdAt = { $gte: startOfDayIST, $lt: endOfDayIST };
        break;
      case "This week":
        filter.createdAt = { $gte: startOfWeekIST, $lt: endOfWeekIST };
        assFilter.createdAt = { $gte: startOfWeekIST, $lt: endOfWeekIST };
        break;
      case "This month":
        filter.createdAt = { $gte: startOfMonthIST, $lt: endOfMonthIST };
        assFilter.createdAt = { $gte: startOfMonthIST, $lt: endOfMonthIST };
        break;
      default:
        break;
    }
    // console.log(filter);
    const tasks = await todo.find(filter);
    // console.log(assFilter);
    const ass = await todo.find(assFilter);
    const combinedResults = [...tasks, ...ass];
    res
      .status(200)
      .json({ status: 1, message: "Success", tasks: combinedResults });
  } catch (error) {
    console.log("Error in getFilterData:", error);
    res.status(500).json({
      status: 0,
      message: "Error in getFilterData",
      error: error.message,
    });
  }
};

const editTask = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: 1,
      message: "No id",
    });
  }
  if (!status) {
    return res.status(400).send({
      message: "status field is required",
      status: 0,
    });
  }
  try {
    const taskUpdate = await todo.findOne({ _id: id });
    taskUpdate.todoStatus = status;
    await taskUpdate.save();
    res.json({
      status: 1,
      message: " edit Success",
    });
  } catch (error) {
    console.log("Error in edit task:", error);
    res.status(500).json({
      status: 0,
      message: "Error in edit task id",
      error: error.message,
    });
  }
};

const editCheck = async (req, res) => {
  const { idx } = req.body;
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: 1,
      message: "No id",
    });
  }
  try {
    const taskUpdate = await todo.findOne({ _id: id });
    if (!taskUpdate) {
      return res.status(400).send({
        status: "failed",
        message: "task not found ",
      });
    }
   
    taskUpdate.tasks[idx].checked = !taskUpdate.tasks[idx].checked;
    
    await taskUpdate.save();
    res.json({
      status: 1,
      message: " edit Success",
    });
  } catch (error) {
    console.log("Error in edit task:", error);
    res.status(500).json({
      status: 0,
      message: "Error in edit task id",
      error: error.message,
    });
  }
};

const deletTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const task = await todo.find({ _id: id, userId });
    if (!task) {
      return res.status(400).send({
        status: "failed",
        message: "task not found for deletion",
      });
    }
    await todo.findByIdAndDelete(id);
    res.send({
      status: 1,
      message: "task Deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "error in task deletion",
    });
  }
};
const updateTask = async (req, res) => {
  const { taskName, priority, assignto, createdDt, tasks } = req.body;
  const userId = req.userId;
  const { id } = req.params;
  if (!taskName || !priority || !tasks) {
    return res.status(400).send({
      message: "All fields are requred",
      status: 0,
    });
  }
  try {
    const task = await todo.findById(id);
    if (!task) {
      return res.status(400).send({
        status: "failed",
        message: "task not found for edit",
      });
    }
    task.taskName = taskName;
    task.priority = priority;
    task.assignto = assignto;
    task.createdDt = createdDt;
    task.tasks = tasks;
    await task.save();
    res.send({
      message: "task edited successFully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "error in task edit",
    });
  }
};
module.exports = {
  addTodo,
  getAlltodo,
  getAnalytics,
  getTaskById,
  getFilterData,
  editTask,
  deletTask,
  updateTask,
  editCheck,
};
