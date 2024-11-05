<script>
import { deleteTodo, getTodos, postTodo, updateTodo } from './api/todos'
import Message from './components/Message.vue'
import StatusFiletr from './components/StatusFilter.vue'
import TodoItem from './components/TodoItem.vue'

export default {
  components: {
    StatusFiletr,
    TodoItem,
    Message,
  },
  data() {
    return {
      todos: [],
      title: '',
      status: 'all',
      errorMessage: '',
    }
  },
  computed: {
    activeTodos() {
      return this.todos.filter(todo => !todo.completed)
    },
    completedTodos() {
      return this.todos.filter(todo => todo.completed)
    },
    visibleTodos() {
      switch (this.status) {
        case 'active':
          return this.activeTodos
        case 'completed':
          return this.completedTodos
        default:
          return this.todos
      }
    },
  },

  mounted() {
    getTodos()
      .then(({ data }) => {
        this.todos = data
      })
      .catch(() => {
        console.log('err')
        this.errorMessage = 'Unable to load todos'
      })
  },
  methods: {
    handleSubmit() {
      postTodo(this.title)
        .then(({ data }) => {
          this.todos.push(data)
        })
        .catch(() => {
          console.log('err')
          this.errorMessage = 'Unable to load todos'
        })
      this.title = ''
    },
    updateTodo({ id, title, completed }) {
      updateTodo({ id, title, completed }).then(({ data }) => {
        this.todos = this.todos.map(todo =>
          (todo.id !== id ? todo : data).catch(() => {
            console.log('err')
            this.errorMessage = 'Unable to update a todo'
          }),
        )
      })
    },
    deleteTodo(todoId) {
      deleteTodo(todoId)
        .then(() => {
          this.todos = this.todos.filter(todo => todo.id !== todoId)
        })
        .catch(() => {
          console.log('err')
          this.errorMessage = 'Unable to delete a todo'
        })
    },
  },
}
</script>

<template>
  <div class="todoapp">
    <h1 class="todoapp__title">todos</h1>

    <div class="todoapp__content">
      <header className="todoapp__header">
        <button
          type="button"
          class="todoapp__toggle-all"
          :class="{ active: activeTodos.length === 0 }"
          data-cy="ToggleAllButton"
        ></button>

        <form @submit.prevent="handleSubmit">
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            v-model="title"
          />
        </form>
      </header>

      <TransitionGroup
        name="list"
        tag="section"
        class="doapp__main"
        data-cy="TodoList"
      >
        <TodoItem
          v-for="todo of visibleTodos"
          :key="todo.id"
          :todo="todo"
          @update="updateTodo"
          @delete="deleteTodo(todo.id)"
        />
      </TransitionGroup>

      <footer class="todoapp__footer" data-cy="Footer">
        <span class="todo-count" data-cy="TodosCounter">
          {{ activeTodos.length }} items left
        </span>

        <StatusFiletr v-model="status" />

        <button
          type="button"
          class="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          v-if="activeTodos.length > 0"
        >
          Clear completed
        </button>
      </footer>
    </div>

    <Message
      :text="errorMessage"
      :active="errorMessage !== ''"
      @hide="errorMessage = ''"
    />
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  max-height: 60px;
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY();
}
</style>
