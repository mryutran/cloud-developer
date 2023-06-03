import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient()
}

export class TodosAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly todosTable = process.env.TODOS_TABLE) {
    }
  
    async getAllTodos(userId: string): Promise<TodoItem[]> {
      logger.info('Getting all Todo Items')
  
      const result = await this.docClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
        ':userId': userId
        }
      }).promise()
  
      return result.Items as TodoItem[]
    }
  
    async createTodo(TodoItem: TodoItem): Promise<TodoItem> {
      logger.info('Create the new Todo item')  
      await this.docClient.put({
        TableName: this.todosTable,
        Item: TodoItem
      }).promise()
  
      return TodoItem
    }

    async deleteTodo(userId: string, todoId: string): Promise<string> {
        logger.info(`Delete the todo item ${todoId}`)
        await this.docClient.delete({
          TableName: this.todosTable,
          Key: { userId, todoId }
        }).promise()
  
        return todoId
      }
    
    async updateTodo(userId: string, todoId: string, todo: TodoUpdate): Promise<string> {
        logger.info(`Update the todo user: ${userId} with todo item ${todoId}`)
        await this.docClient.update({
          TableName: this.todosTable,
          Key: { userId, todoId },
          UpdateExpression: 'set #N = :name, dueDate = :dueDate, done =:done',
          ExpressionAttributeNames: {
            '#N': 'name'
          },
          ExpressionAttributeValues: {
            ':name': todo.name,
            ':dueDate': todo.dueDate,
            ':done': todo.done
          }
        }).promise()

        return todoId  
    }

    async updateAttachmentUrl(userId: string, todoId: string, attachmentUrl: string): Promise<string> {
        logger.info(`Update a todo item attachment url ${todoId}`)
        await this.docClient.update({
          TableName: this.todosTable,
          Key: {userId, todoId },
          UpdateExpression: 'set attachmentUrl = :attachmentUrl',
          ExpressionAttributeValues: {
            ':attachmentUrl': attachmentUrl
          }
        }).promise()
    
        return attachmentUrl
      }

}
