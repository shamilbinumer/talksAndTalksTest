// TodoApp.jsx
import { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
} from '@mui/material';

// Import the components
import Navbar from './Navbar';
import TaskManagement from './TaskManagement';
import TaskLists from './TaskLists';

const TodoApp = () => {
  // State management
  const [tasks, setTasks] = useState(() => {
    // Initialize tasks from localStorage with proper error handling
    try {
      const storedTasks = localStorage.getItem('tasks');
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      return [];
    }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize darkMode from localStorage
    try {
      const storedDarkMode = localStorage.getItem('darkMode');
      return storedDarkMode ? JSON.parse(storedDarkMode) : false;
    } catch (error) {
      return false;
    }
  });
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  const [draggedTask, setDraggedTask] = useState(null);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
      setNotification({
        open: true,
        message: 'Error saving tasks. Your changes may not persist after refresh.',
        type: 'error'
      });
    }
  }, [tasks]);

  // Save dark mode preference
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.error("Error saving dark mode preference:", error);
    }
  }, [darkMode]);

  // Check for tasks that are due soon or overdue
  useEffect(() => {
    const checkDueTasks = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      tasks.forEach(task => {
        if (task.completed) return;
        
        const dueDate = new Date(task.date);
        dueDate.setHours(0, 0, 0, 0);
        
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        
        if (daysDiff < 0) {
          setNotification({
            open: true,
            message: `Task "${task.name}" is overdue!`,
            type: 'error'
          });
        } else if (daysDiff <= 1) {
          setNotification({
            open: true,
            message: `Task "${task.name}" is due today or tomorrow!`,
            type: 'warning'
          });
        }
      });
    };
    
    checkDueTasks();
    // Check every day
    const interval = setInterval(checkDueTasks, 86400000);
    return () => clearInterval(interval);
  }, [tasks]);

  // Add a new task
  const addTask = (newTaskName, newTaskDate) => {
    if (newTaskName.trim() === '' || !newTaskDate) return;
    
    const newTask = {
      id: Date.now(),
      name: newTaskName,
      date: newTaskDate,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    
    // Save to localStorage immediately as a backup
    try {
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
    
    setNotification({
      open: true,
      message: 'Task added successfully!',
      type: 'success'
    });
    
    return true; // Return success to reset form
  };

  // Delete a task
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    
    // Save to localStorage immediately as a backup
    try {
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
    
    setNotification({
      open: true,
      message: 'Task deleted successfully!',
      type: 'success'
    });
  };

  // Update a task
  const updateTask = (id, updatedData) => {
    const updatedTasks = tasks.map(task => 
      task.id === id 
        ? { ...task, ...updatedData }
        : task
    );
    
    setTasks(updatedTasks);
    
    // Save to localStorage immediately as a backup
    try {
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
    
    setNotification({
      open: true,
      message: 'Task updated successfully!',
      type: 'success'
    });
  };

  // Toggle task completion
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed }
        : task
    );
    
    setTasks(updatedTasks);
    
    // Save to localStorage immediately as a backup
    try {
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  };

  // Drag and drop functionality
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    // For better drag visual feedback
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', task.id);
      const dragImage = new Image();
      dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      e.dataTransfer.setDragImage(dragImage, 0, 0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e, targetCompleted) => {
    e.preventDefault();
    if (draggedTask && draggedTask.completed !== targetCompleted) {
      const updatedTasks = tasks.map(task => 
        task.id === draggedTask.id 
          ? { ...task, completed: targetCompleted }
          : task
      );
      
      setTasks(updatedTasks);
      
      // Save to localStorage immediately as a backup
      try {
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
      }
      
      setNotification({
        open: true,
        message: targetCompleted 
          ? 'Task marked as completed!' 
          : 'Task moved back to uncompleted list!',
        type: 'success'
      });
    }
    setDraggedTask(null);
  };

  // Filter tasks based on search and filter status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'completed') return matchesSearch && task.completed;
    if (filterStatus === 'uncompleted') return matchesSearch && !task.completed;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (filterStatus === 'dueToday') {
      return matchesSearch && !task.completed && taskDate.getTime() === today.getTime();
    }
    
    if (filterStatus === 'overdue') {
      return matchesSearch && !task.completed && taskDate < today;
    }
    
    return matchesSearch;
  });

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'}`}>
      {/* Use Navbar component and pass props */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="container mx-auto px-4 mt-4 pb-8 xl:w-[80%]">
        {/* Task Management Component */}
        <TaskManagement 
          darkMode={darkMode}
          addTask={addTask}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          completionRate={completionRate}
          activeTasks={tasks.filter(task => !task.completed).length}
        />

        {/* task Lists component */}
        <TaskLists
          darkMode={darkMode}
          filteredTasks={filteredTasks}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          toggleTaskCompletion={toggleTaskCompletion}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      </div>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TodoApp;