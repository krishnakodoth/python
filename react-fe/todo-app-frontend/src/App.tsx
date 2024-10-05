import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const apiUrl = 'http://127.0.0.1:5001';
const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  // Fetch tasks from API
  useEffect(() => {
    axios.get(`${apiUrl}/tasks`)
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching tasks!', error);
      });
  }, []);

  // Add new task
  const addTask = () => {
    if (!newTask.trim()) return;
    axios.post(`${apiUrl}/tasks`, { title: newTask })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask('');  // Clear input
      });
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    axios.put(`${apiUrl}/tasks/${taskId}`, { completed: !task.completed })
      .then(response => {
        setTasks(tasks.map(t => t.id === taskId ? response.data : t));
      });
  };

  // Delete task
  const deleteTask = (taskId: number) => {
    axios.delete(`${apiUrl}/tasks/${taskId}`)
      .then(() => {
        setTasks(tasks.filter(t => t.id !== taskId));
      });
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      
      <div>
        <input 
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTaskCompletion(task.id)}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;