
const { Task } = require("../../models/Tasks");

module.exports = {
    createTask: async (req, res) => {
        const {
            title,
            description,
            assignedTo,
            status } = req.body;
        try {
            const newTask = new Task({
                title,
                description,
                assignedTo,
                status
            });
            await newTask.save();
            return res.status(200).json({
                result: 1,
                msg: "task created successfully"
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                result: 0,
                msg: e.message
            })
        }
    },
    getTasks: async (req, res) => {
        const { id, role } = req.query;
        try {
            let tasks;
            if (role === 'Admin') {
                tasks = await Task.find().populate('assignedTo', 'username');
            } else {
                tasks = await Task.find({ assignedTo: id }).populate('assignedTo', 'username');
            }
            console.log(tasks)
            res.status(200).json(tasks);
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: e.message });
        }
    },
    updateTask: async (req, res) => {
        const { status } = req.body; // complete or in progress 
        console.log("new status =>>>>>>>", status, req.params.id)
        try {
            const task = await Task.findByIdAndUpdate(
                req.params.id,
                { '$set': { status } },
                { new: true }
            );
            // console.log(task)
            if (!task) return res.status(404).json({ result: 0, message: 'Task not found' });
            const io = req.app.get("socketio"); // getting socket io instance
            io.emit("taskUpdated", task)
            res.status(200).json({ result: 1, task });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: e.message });
        }
    },
    createComments: async (req, res) => {
        const { id } = req.params; // Task ID to which the comment is being added
        const { text, username } = req.body; // The comment text
        const io = req.app.get("socketio")
        try {
            // Find the task by its ID and push a new comment into the comments array
            const task = await Task.findByIdAndUpdate(
                id,
                {
                    "$push": {
                        comments: {
                            username: username, // Assuming you want to store the ID of the user commenting
                            text: text,
                            createdAt: Date.now()
                        }
                    }
                },
                { new: true } // Return the updated document
            );

            // Check if the task was found
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            console.log(task)
            // Return the updated task with a success message
            io.emit("commentAdded", task)
            res.status(200).json({ result: 1, task });
        } catch (e) {
            console.error(e); // Log the error for debugging
            res.status(500).json({ result: 0, message: e.message });
        }
    },
    deleteComment: async (req, res) => {
        console.log(req.params)
        const { commentId, taskId } = req.params;
        try {
            const deletedComment = await Task.findByIdAndUpdate(
                taskId,
                { '$pull':  {'comments': { '_id':  commentId}}},
                {new: true}
            );
            if(!deletedComment) return res.json({
                result: 0,
                message: "Task not found"
            });
            const io = req.app.get("socketio");
            io.emit("commentDeleted", deletedComment);
            return res.json({
                result: 0,
                message: 'comment delete successfully'
            })
        } catch (e) {
            res.status(500).json({messgae: e.message})
        }
    }
}