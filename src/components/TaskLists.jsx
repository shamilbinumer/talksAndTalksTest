import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  TextField,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
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

const TaskLists = ({
  darkMode,
  filteredTasks,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  handleDragStart,
  handleDragOver,
  handleDrop,
  toggleTaskCompletion,
  updateTask,
  deleteTask
}) => {
  const [editTask, setEditTask] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [editTaskDate, setEditTaskDate] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

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
    
    updateTask(editTask.id, {
      name: editTaskName,
      date: editTaskDate
    });
    
    setOpenDialog(false);
  };

  return (
    <>
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

      {/* Edit Task Dialog */}
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
    </>
  );
};
TaskLists.propTypes = {
    darkMode: PropTypes.bool.isRequired,
    filteredTasks: PropTypes.array.isRequired,
    searchTerm: PropTypes.string.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    filterStatus: PropTypes.string.isRequired,
    setFilterStatus: PropTypes.func.isRequired,
    handleDragStart: PropTypes.func.isRequired,
    handleDragOver: PropTypes.func.isRequired,
    handleDrop: PropTypes.func.isRequired,
    toggleTaskCompletion: PropTypes.func.isRequired,
    updateTask: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired
  };
export default TaskLists;