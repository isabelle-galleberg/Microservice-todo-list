import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const balancers = require('./microservices_balancers.json');

  const list_url = `http://${balancers.lists}:80`;
  const item_url = `http://${balancers.items}:80`;

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  const getTodos = async () => {
    try {
      const response = await axios.get(`${list_url}/todos`);
      if (response.status === 200) {
        setTodos(response.data.reverse());
      } else {
        console.error('Failed to fetch todos. Status code: ', response.status);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await axios.post(`${list_url}/add`, {
        text: newTodo,
        completed: false,
      });
      if (response.status === 201) {
        setNewTodo('');
        getTodos();
      } else {
        console.error(
          'Failed to post a new todo. Status code: ',
          response.status
        );
      }
    } catch (error) {
      console.error('Error posting a new todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`${list_url}/${id._id}`);
      if (response.status === 204) {
        getTodos();
      } else {
        console.error(
          'Failed to delete the todo. Status code: ',
          response.status
        );
      }
    } catch (error) {
      console.error('Error deleting the todo:', error);
    }
  };

  const toggleTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(`${item_url}/toggle/${id}`, updatedTodo);
      if (response.status === 200) {
        getTodos();
      } else {
        console.error(
          'Failed to update the todo. Status code: ',
          response.status
        );
      }
    } catch (error) {
      console.error('Error updating the todo:', error);
    }
  };

  return (
    <div className='p-4 flex flex-col items-center'>
      <h1 className='text-2xl font-semibold mb-4'>To-do List</h1>
      <div className='mb-4 max-w-sm flex flex-row gap-3 w-full'>
        <input
          type='text'
          placeholder='Enter a new task'
          className='input input-bordered w-full'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo} className='btn btn-info'>
          Add
        </button>
      </div>
      <ul className='w-full max-w-sm'>
        {todos.map((todo) => (
          <li
            key={todo._id}
            className='flex items-center justify-between p-2 border border-gray-300 rounded-lg mb-2'>
            <label
              className={`flex items-center space-x-2 ${
                todo.completed ? 'line-through' : ''
              }`}>
              <input
                type='checkbox'
                className='checkbox'
                checked={todo.completed}
                onChange={() =>
                  toggleTodo(todo._id, { ...todo, completed: !todo.completed })
                }
              />
              <span>{todo.text}</span>
            </label>
            <div>
              <button
                onClick={() => deleteTodo(todo)}
                className='btn btn-error'>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
