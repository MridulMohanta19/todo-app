import './App.css';
import { useEffect, useState } from 'react';
import { MdCheck, MdDelete, MdEdit } from 'react-icons/md';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [currentEditedItem, setCurrentEditedItem] = useState({ title: "", description: "" });

  const fetchTodos = async () => {
    const response = await fetch('https://todo-backend-wl6b.onrender.com/tasks');
    const data = await response.json();
    setTodos(data?.filter(task => !task.completedOn));
    setCompletedTodos(data?.filter(task => task.completedOn));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!Title || !Description) {
      alert('Please fill in all fields');
      return;
    }
    const newTodoItem = {
      title: Title,
      description: Description,
    };

    const response = await fetch('https://todo-backend-wl6b.onrender.com/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodoItem),
    });

    const data = await response.json();
    setTodos([...allTodos, data]);
    setTitle("");
    setDescription("");
  };

  const handleDeleteTodo = async (id) => {
    await fetch(`https://todo-backend-wl6b.onrender.com/tasks/${id}`, {
      method: 'DELETE',
    });

    fetchTodos();
  };

  const handleComplete = async (id) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = `${dd}/${mm}/${yyyy} ${h}:${m}:${s}`;

    const taskToUpdate = allTodos.find(todo => todo.id === id);
    const updatedTask = { ...taskToUpdate, completedOn };

    await fetch(`https://todo-backend-wl6b.onrender.com/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    fetchTodos();
  };

  const handleDeleteCompletedTodo = async (id) => {
    await fetch(`https://todo-backend-wl6b.onrender.com/tasks/${id}`, {
      method: 'DELETE',
    });

    fetchTodos();
  };

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem(prevState => ({ ...prevState, title: value }));
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem(prevState => ({ ...prevState, description: value }));
  };

  const handleSaveEdit = async () => {
    const updatedTask = currentEditedItem;
    await fetch(`https://todo-backend-wl6b.onrender.com/tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    fetchTodos();
    setCurrentEdit(null);
    setCurrentEditedItem({ title: "", description: "" });
  };

  return (
    <div className="App">
      <h1>To-Do</h1>
      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input 
              type='text' 
              value={Title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder='Write the Title' 
            />
          </div>
          <div className='todo-input-item'>
            <label>Description</label>
            <input 
              type='text' 
              value={Description} 
              onChange={(e) => setDescription(e.target.value)}  
              placeholder='Write the Description' 
            />
          </div>
          <div className='todo-input-item'>
            <button type='button' onClick={handleAddTodo} className='primaryBtn'>Add</button>
          </div>
        </div>
        <div className='btn-area'>
          <button 
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`} 
            onClick={() => setIsCompleteScreen(false)}
          >
            To-do
          </button>
          <button 
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`} 
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>
        <div className='todo-list'>
          {isCompleteScreen === false && allTodos.map((item, index) => {
            if (currentEdit === index) {
              return (
                <div className='edit__wrapper' key={index}>
                  <input 
                    placeholder='Updated Title' 
                    onChange={(e) => handleUpdateTitle(e.target.value)} 
                    value={currentEditedItem.title} 
                  />
                  <textarea 
                    placeholder='Updated Description' 
                    onChange={(e) => handleUpdateDescription(e.target.value)} 
                    value={currentEditedItem.description}
                  />
                  <button type='button' onClick={handleSaveEdit} className='primaryBtn'>Save</button>
                </div>
              )
            } else {
              return (
                <div className='todo-list-item' key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div>
                    <MdDelete className='icon' onClick={() => handleDeleteTodo(item.id)} title='Delete' />
                    <MdCheck className='check-icon' onClick={() => handleComplete(item.id)} title='Complete' />
                    <MdEdit className='icon' onClick={() => handleEdit(index, item)} title='Edit' />
                  </div>
                </div>
              );
            }
          })}

          {isCompleteScreen === true && completedTodos.map((item, index) => {
            return (
              <div className='todo-list-item' key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p><small>Completed On: {item.completedOn}</small></p>
                </div>
                <div>
                  <MdDelete className='icon' onClick={() => handleDeleteCompletedTodo(item.id)} title='Delete' />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
