import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Chip,
} from '@mui/material';

const TaskManagement = ({ 
  darkMode, 
  addTask, 
  totalTasks, 
  completedTasks, 
  completionRate, 
  activeTasks 
}) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');

  const handleAddTask = () => {
    const success = addTask(newTaskName, newTaskDate);
    if (success) {
      setNewTaskName('');
      setNewTaskDate('');
    }
  };

  return (
    <>
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
              label={`${activeTasks} active`} 
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
            onClick={handleAddTask}
            disabled={!newTaskName.trim() || !newTaskDate}
          >
            Add Task
          </Button>
        </div>
      </div>
    </>
  );
};
TaskManagement.propTypes = {
    darkMode: PropTypes.bool.isRequired,
    addTask: PropTypes.func.isRequired,
    totalTasks: PropTypes.number.isRequired,
    completedTasks: PropTypes.number.isRequired,
    completionRate: PropTypes.number.isRequired,
    activeTasks: PropTypes.number.isRequired
  };
export default TaskManagement;