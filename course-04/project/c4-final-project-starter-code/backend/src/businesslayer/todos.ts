import { TodosAccess } from '../datalayer/todosAccess'
import { getPresignedAttachmentUrl } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const bucketName = process.env.ATTACHMENT_S3_BUCKET
// const attachmentUrl =  `https://${bucketName}.s3.amazonaws.com/${todoId}`

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return todosAccess.getTodos(userId)
}

export async function createTodo(userId: string, todo: CreateTodoRequest): Promise<TodoItem> {
    
    const newTodo: TodoItem = {
      ...todo,
      userId,
      todoId: uuid.v4(),
      createdAt: new Date().toISOString(),
      done: false,
    }
  
    return todosAccess.createTodo(newTodo)
}

export async function deleteTodo(userId: string, todoId: string): Promise<string> {
    return todosAccess.deleteTodo(userId, todoId)
}

export async function updateTodo(userId: string, todoId: string, updateData: UpdateTodoRequest): Promise<string> {
    return todosAccess.updateTodo(userId, todoId, updateData)
}

export async function updateAttachmentUrl(userId: string, todoId: string): Promise<string> {
    const attachmentUrl =  `https://${bucketName}.s3.amazonaws.com/${todoId}`
    return todosAccess.updateAttachmentUrl(userId, todoId, attachmentUrl);
}

export async function createAttachmentPresignedUrl(todoId: string): Promise<string> {
    return getPresignedAttachmentUrl(todoId)
}
