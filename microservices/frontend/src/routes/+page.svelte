<script lang="ts">
  import axios from "axios"

  type Todo = {
    id: string;
    text: string;
    completed: boolean;
  }

  // TODO: remove from file 
  const balancers = {
    "list": "{{ hostvars['balancer2'].ansible_host }}",
    "item": "{{ hostvars['balancer3'].ansible_host }}"
}

  const list_url = `http://${balancers.list}:80/`
  const item_url = `http://${balancers.item}:80/`

  let todos: Todo[] = [];
  let newTodo = ''; 

  $: {
  getTodos()
}

  async function getTodos() {
  try {
    const response = await axios.get(list_url);
    if (response.status === 200) {
      todos = response.data;
      console.log("Todos fetched and stored successfully:", todos);
    } else {
      console.error("Failed to fetch todos. Status code: ", response.status);
    }
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

  async function addTodo() {
  try {
    const response = await axios.post(list_url, { text: newTodo, completed: false });
    if (response.status === 201) {
      console.log("New todo posted successfully:", response.data);
    } else {
      console.error("Failed to post a new todo. Status code: ", response.status);
    }
  } catch (error) {
    console.error("Error posting a new todo:", error);
  }
}

async function deleteTodo(id: string) {
  try {
    const response = await axios.delete(`${list_url}/${id}`);
    if (response.status === 204) {
      console.log(`Todo was deleted successfully.`);
    } else {
      console.error("Failed to delete the todo. Status code: ", response.status);
    }
  } catch (error) {
    console.error("Error deleting the todo:", error);
  }
}

  async function toggleTodo(id: string, updatedTodo: Todo) {
    try {
    const response = await axios.put(`${item_url}/${id}`, updatedTodo);
    if (response.status === 200) {
      console.log(`Todo with was updated successfully:`, response.data);
    } else {
      console.error("Failed to update the todo. Status code: ", response.status);
    }
  } catch (error) {
    console.error("Error updating the todo:", error);
  }
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
    {#each todos as todo (todo.text)}
      <li
        class="flex items-center justify-between p-2 border border-gray-300 rounded-lg mb-2"
      >
          <label class="flex items-center space-x-2" class:line-through={todo.completed}>
            <input
              type="checkbox"
              class="checkbox"
              bind:checked={todo.completed}
              on:change={() => toggleTodo(todo.id, { ...todo, completed: !todo.completed })}
            />
            <span>{todo.text}</span>
          </label>
          <div>
            <button on:click={() => deleteTodo(todo.id)} class="btn btn-error">Remove</button>
          </div>
      </li>
    {/each}
  </ul>
</div>
