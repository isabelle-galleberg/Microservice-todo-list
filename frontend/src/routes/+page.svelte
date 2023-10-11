<script lang="ts">
  type Todo = {
    text: string;
    completed: boolean;
  }

  // TODO: Replace this list with data retrieved from a database
  let todos: Todo[] = [];
  let newTodo = '';
  let editIndex: number | null = null; 
  let editedText = '';

  function addTodo() {
    if (newTodo.trim() === '') return;
    todos = [...todos, { text: newTodo, completed: false }];
    newTodo = '';
  }

  function toggleTodo(index: number) {
    todos[index].completed = !todos[index].completed;
    todos = [...todos];
  }

  function removeTodo(index: number) {
    todos.splice(index, 1);
    todos = [...todos];
  }

  function editTodo(index: number) {
    editIndex = index;
    editedText = todos[index].text;
  }

  function saveTodo(index: number) {
    todos[index].text = editedText.trim();
    editIndex = null;
  }
</script>

<div class="p-4 flex flex-col items-center">
  <h1 class="text-2xl font-semibold mb-4">To Do List</h1>
  <div class="mb-4 max-w-sm flex flex-row gap-3 w-full">
    <input
      type="text"
      placeholder="Enter a new task"
      class="input input-bordered w-full"
      bind:value={newTodo}
      on:keydown={(e) => e.key === 'Enter' && addTodo()}
    />
    <button on:click={addTodo} class="btn btn-info">Add</button>
  </div>
  <ul class="w-full max-w-sm">
    {#each todos as todo, index (todo.text)}
      <li
        class="flex items-center justify-between p-2 border border-gray-300 rounded-lg mb-2"
      >
        {#if editIndex === index}
        <div class="max-w-sm flex flex-row gap-3 w-full items-center">
          <input
            type="text"
            class="input input-bordered w-full"
            bind:value={editedText}
            on:keydown={(e) => e.key === 'Enter' && saveTodo(index)}
          />
          <button on:click={() => saveTodo(index)} class="btn btn-success">Save</button>
          </div>
        {:else}
          <label class="flex items-center space-x-2" class:line-through={todo.completed}>
            <input
              type="checkbox"
              class="checkbox"
              bind:checked={todo.completed}
              on:click={() => toggleTodo(index)}
            />
            <span>{todo.text}</span>
          </label>
          <div>
            <button on:click={() => editTodo(index)} class="btn btn-warning">Edit</button>
            <button on:click={() => removeTodo(index)} class="btn btn-error">Remove</button>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</div>
