import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks }) => {
  const groupedTasks = tasks.reduce((acc, task) => {
    acc[task.status] = [...(acc[task.status] || []), task];
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['Pending', 'In Progress', 'Completed'].map(status => (
        <div key={status} className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">{status}</h2>
          {groupedTasks[status]?.map(task => (
            <TaskItem key={task._id} task={task} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TaskList;