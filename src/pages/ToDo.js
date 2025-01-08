import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import "../css/ToDo.css";

function Todo() {
  const [open, setOpen] = useState(false); 
  const [editOpen, setEditOpen] = useState(false); 
  const [task, setTask] = useState('');
  const [editTask, setEditTask] = useState(''); 
  const [editIndex, setEditIndex] = useState(null); 
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  // Add modal handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Edit modal handlers
  const handleEditOpen = (task, index) => {
    setEditTask(task); 
    setEditIndex(index); 
    setEditOpen(true); 
  };

  const handleEditClose = () => setEditOpen(false);

  const handleInputChange = (event) => setTask(event.target.value);

  const handleSaveChanges = () => {
    const validatedTask = task.trim(); 
  
    // Validation 
    if (!validatedTask) {
      alert('Task name cannot be empty.');
      return;
    }
    if (validatedTask.length > 50) {
      alert('Task name cannot exceed 50 characters.');
      return;
    }
    if (!/[a-zA-Z]/.test(validatedTask)) {
      alert('Task name must contain at least one letter.');
      return;
    }
    if (tasks.includes(validatedTask)) {
      alert('Task name must be unique.');
      return;
    }
  
    const newTask = { name: validatedTask, completed: false };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTask('');
    setOpen(false);
  };
  
  const handleEditTaskChange = (event) => setEditTask(event.target.value);

  const handleUpdateTask = () => {
    const validatedTask = editTask.trim(); // Remove extra whitespace
  
    // Validation
    if (tasks.some(task => task.name === validatedTask)) {
      alert('Task name cannot be empty.');
      return;
    }
    if (validatedTask.length > 50) {
      alert('Task name cannot exceed 50 characters.');
      return;
    }
    if (!/[a-zA-Z]/.test(validatedTask)) {
      alert('Task name must contain at least one letter.');
      return;
    }
    if (tasks.some((t, i) => t.name === validatedTask && i !== editIndex)) {
      alert('Task name must be unique.');
      return;
    }
  
    const updatedTasks = [...tasks];
    updatedTasks[editIndex] = { ...updatedTasks[editIndex], name: validatedTask }; 
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setEditTask('');
    setEditIndex(null);
    setEditOpen(false);
  };
  
  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };
  
  const handleToggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, completed: !task.completed }; 
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); 
  };
  return (
    <div className="App">
      <h1>My Tasks</h1>
      <div className="container">
        <h2>Today Todo List</h2>

        <List>
          {tasks.map((task, index) => (
            <ListItem key={index} className="list-item" dense secondaryAction={
              <>
                              
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditOpen(task.name, index)}
                  >
                    <EditNoteIcon color="success" />
                  </IconButton>

                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteTask(index)}
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
              </>
            }
              >
              
              <FormControlLabel
                control={<Checkbox checked={task.completed} onChange={() =>handleToggleTaskCompletion(index)}/>}
                label={<ListItemText primary={task.name} />}
              />
                
             
            </ListItem>
          ))}
        </List>

    

          <IconButton>
            <AddCircleIcon onClick={handleOpen} fontSize="large" color="primary"/>
          </IconButton>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Task"
              type="text"
              fullWidth
              value={task}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Task Modal */}
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Task"
              type="text"
              fullWidth
              value={editTask}
              onChange={handleEditTaskChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdateTask} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Todo;
