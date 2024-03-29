import { Heading } from "@chakra-ui/react";
import Layout from "../components/Layout";
import Table from "@/components/common/Table";
import React, { useState } from 'react';

function TodoApp() {
  // Stan przechowujący listę zadań
  const [tasks, setTasks] = useState([]);

  // Funkcja do dodawania nowego zadania
  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  // Funkcja do usuwania zadania
  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-app">
      <h1>Lista zadań do zrobienia</h1>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task}
            <button onClick={() => removeTask(index)}>Usuń</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Dodaj nowe zadanie"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addTask(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}

export default ProjectsPage;
