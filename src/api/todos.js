import { client } from '@/utils/httpClient'

const userId = 1364

export const getTodos = () => {
  return client.get(`/todos?userId=${userId}`)
}

export const postTodo = title => {
  return client.post(`/todos`, {
    title,
    completed: false,
    userId,
  })
}

export const updateTodo = ({ id, title, completed }) => {
  return client.patch(`/todos/${id}`, {
    title,
    completed,
  })
}

export const deleteTodo = todoId => {
  return client.delete(`/todos/${todoId}`)
}
