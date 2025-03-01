// TodoApp.jsx
import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Snackbar,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  DragIndicator as DragIndicatorIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

// Import the Navbar component
import Navbar from './Navbar';

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
  
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [editTaskDate, setEditTaskDate] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
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
  const addTask = () => {
    if (newTaskName.trim() === '' || !newTaskDate) return;
    
    const newTask = {
      id: Date.now(),
      name: newTaskName,
      date: newTaskDate,
      completed: false,
      createdAt: new Date().toISOString() // Store as ISO string for better serialization
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setNewTaskName('');
    setNewTaskDate('');
    
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

  // Open edit dialog
  const openEditDialog = (task) => {
    setEditTask(task);
    setEditTaskName(task.name);
    setEditTaskDate(task.date);
    setOpenDialog(true);
  };

  // Save edited task
  const saveEditedTask = () => {
    if (editTaskName.trim() === '' || !editTaskDate) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === editTask.id 
        ? { ...task, name: editTaskName, date: editTaskDate }
        : task
    );
    
    setTasks(updatedTasks);
    setOpenDialog(false);
    
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

  // Mark task as completed or uncompleted
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
      dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Transparent 1x1 pixel
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

      <div className="container mx-auto px-4 mt-4 pb-8 w-[80%]">
        {/* Task Statistics */}
        <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <Typography variant="h6" className={darkMode ? 'text-white' : 'text-gray-900'}>
                Task Progress
              </Typography>
              <Typography variant="body2" className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {completedTasks} of {totalTasks} tasks completed ({completionRate}%)
              </Typography>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Chip 
                label={`${tasks.filter(task => !task.completed).length} active`} 
                color="primary"
                variant={darkMode ? "default" : "outlined"}
                sx={{ color: darkMode ? '#fff' : 'inherit' }}
              />
              <Chip 
                label={`${completedTasks} completed`} 
                color="success"
                variant={darkMode ? "default" : "outlined"}
                sx={{ color: darkMode ? '#fff' : 'inherit' }}
              />
            </div>
          </div>
        </div>

        {/* Task Creation Form */}
        <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <Typography variant="h6" className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Add New Task
          </Typography>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <TextField
              label="Task Name"
              variant="outlined"
              fullWidth
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              InputProps={{
                sx: { bgcolor: darkMode ? 'rgba(255, 255, 255, 0.09)' : 'white' }
              }}
              InputLabelProps={{
                sx: { color: darkMode ? '#d1d5db' : 'inherit' }
              }}
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'inherit',
                  }
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#fff' : 'inherit',
                }
              }}
            />
            <TextField
              label="Due Date"
              type="date"
              variant="outlined"
              fullWidth
              className="md:w-56"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              InputLabelProps={{ 
                shrink: true,
                sx: { color: darkMode ? '#d1d5db' : 'inherit' }
              }}
              InputProps={{
                sx: { bgcolor: darkMode ? 'rgba(255, 255, 255, 0.09)' : 'white' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'inherit',
                  }
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#fff' : 'inherit',
                }
              }}
            />
            <Button
              variant="contained"
              className="w-full md:w-auto"
              sx={{ 
                bgcolor: '#f97316',
                '&:hover': {
                  bgcolor: '#ea580c'  
                }
              }}
              onClick={addTask}
              disabled={!newTaskName.trim() || !newTaskDate}
            >
              Add Task
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <TextField
              label="Search Tasks"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: darkMode ? '#d1d5db' : 'inherit' }} />
                  </InputAdornment>
                ),
                sx: { bgcolor: darkMode ? 'rgba(255, 255, 255, 0.09)' : 'white' }
              }}
              InputLabelProps={{
                sx: { color: darkMode ? '#d1d5db' : 'inherit' }
              }}
              sx={{ 
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'inherit',
                  }
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#fff' : 'inherit',
                }
              }}
            />
            <div className="flex items-center gap-2">
              <FilterListIcon className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="all">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="uncompleted">Uncompleted</option>
                <option value="dueToday">Due Today</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Uncompleted Tasks */}
          <div 
            className={`p-4 rounded-lg h-full flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, false)}
          >
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <Typography variant="h6" className={darkMode ? 'text-white' : 'text-gray-900'}>
                Uncompleted Tasks
              </Typography>
            </div>
            
            <div className="flex flex-col gap-4 flex-grow">
              {filteredTasks.filter(task => !task.completed).length === 0 ? (
                <Typography 
                  variant="body2" 
                  className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  No uncompleted tasks found
                </Typography>
              ) : (
                filteredTasks
                  .filter(task => !task.completed)
                  .map(task => (
                    <div 
                      key={task.id} 
                      className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:shadow-md hover:-translate-y-1 transition-all duration-200`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                    >
                      <div className="p-4 pb-2 relative">
                        <div className="absolute top-2 right-2">
                          <DragIndicatorIcon className={darkMode ? 'text-gray-400' : 'text-gray-400'} style={{ cursor: 'move' }} />
                        </div>
                        <Typography variant="h6" className={`pr-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {task.name}
                        </Typography>
                        <div className="flex justify-between items-center mt-2">
                          <Chip 
                            label={new Date(task.date).toLocaleDateString()} 
                            color="primary"
                            size="small"
                            variant={darkMode ? "filled" : "outlined"}
                            sx={{ color: darkMode ? '#fff' : 'inherit' }}
                          />
                          {new Date(task.date) < new Date() && !task.completed && (
                            <Chip 
                              label="Overdue" 
                              color="error"
                              size="small"
                              variant={darkMode ? "filled" : "outlined"}
                              sx={{ color: darkMode ? '#fff' : 'inherit' }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end p-2">
                        <IconButton 
                          aria-label="mark as complete" 
                          onClick={() => toggleTaskCompletion(task.id)}
                          color="success"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton 
                          aria-label="edit task" 
                          onClick={() => openEditDialog(task)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          aria-label="delete task" 
                          onClick={() => deleteTask(task.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div
            className={`p-4 rounded-lg h-full flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, true)}
          >
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <Typography variant="h6" className={darkMode ? 'text-white' : 'text-gray-900'}>
                Completed Tasks
              </Typography>
            </div>
            
            <div className="flex flex-col gap-4 flex-grow">
              {filteredTasks.filter(task => task.completed).length === 0 ? (
                <Typography 
                  variant="body2" 
                  className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  No completed tasks found
                </Typography>
              ) : (
                filteredTasks
                  .filter(task => task.completed)
                  .map(task => (
                    <div 
                      key={task.id} 
                      className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:shadow-md hover:-translate-y-1 transition-all duration-200`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                    >
                      <div className={`p-4 pb-2 relative line-through ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                        <div className="absolute top-2 right-2">
                          <DragIndicatorIcon className={darkMode ? 'text-gray-500' : 'text-gray-400'} style={{ cursor: 'move' }} />
                        </div>
                        <Typography variant="h6" className="pr-8">
                          {task.name}
                        </Typography>
                        <div className="flex justify-between items-center mt-2">
                          <Chip 
                            label={new Date(task.date).toLocaleDateString()} 
                            color="default"
                            size="small"
                            variant={darkMode ? "filled" : "outlined"}
                            sx={{ color: darkMode ? '#fff' : 'inherit' }}
                          />
                          <Chip 
                            label="Completed" 
                            color="success"
                            size="small"
                            variant={darkMode ? "filled" : "outlined"}
                            sx={{ color: darkMode ? '#fff' : 'inherit' }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end p-2">
                        <IconButton 
                          aria-label="mark as incomplete" 
                          onClick={() => toggleTaskCompletion(task.id)}
                          color="warning"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton 
                          aria-label="delete task" 
                          onClick={() => deleteTask(task.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task Dialog - Keep using MUI Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: darkMode ? 'rgb(31, 41, 55)' : 'background.paper',
            color: darkMode ? 'white' : 'inherit'
          }
        }}
      >
        <DialogTitle className={darkMode ? 'text-white' : ''}>Edit Task</DialogTitle>
        <DialogContent>
          <div className="pt-4 flex flex-col gap-4">
            <TextField
              label="Task Name"
              variant="outlined"
              fullWidth
              value={editTaskName}
              onChange={(e) => setEditTaskName(e.target.value)}
              InputProps={{
                sx: { bgcolor: darkMode ? 'rgba(255, 255, 255, 0.09)' : 'white' }
              }}
              InputLabelProps={{
                sx: { color: darkMode ? '#d1d5db' : 'inherit' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'inherit',
                  }
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#fff' : 'inherit',
                }
              }}
            />
            <TextField
              label="Due Date"
              type="date"
              variant="outlined"
              fullWidth
              value={editTaskDate}
              onChange={(e) => setEditTaskDate(e.target.value)}
              InputLabelProps={{ 
                shrink: true,
                sx: { color: darkMode ? '#d1d5db' : 'inherit' }
              }}
              InputProps={{
                sx: { bgcolor: darkMode ? 'rgba(255, 255, 255, 0.09)' : 'white' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'inherit',
                  }
                },
                '& .MuiInputBase-input': {
                  color: darkMode ? '#fff' : 'inherit',
                }
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" sx={{ color: darkMode ? '#d1d5db' : 'inherit' }}>
            Cancel
          </Button>
          <Button 
            onClick={saveEditedTask} 
            variant="contained"
            sx={{ 
              bgcolor: '#f97316',
              '&:hover': {
                bgcolor: '#ea580c'  
              }
            }}
            disabled={!editTaskName.trim() || !editTaskDate}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar - Keep using MUI Snackbar and Alert */}
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