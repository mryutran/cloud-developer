import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businesslayer/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id

    // // Check if todoId exists
    // if (!todoId) {
    //   return {
    //     statusCode: 400,
    //     body: "todoId is required"
    //   }
    // }
    
    const userId = getUserId(event);
    await deleteTodo(userId, todoId);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: "deleted successfully"
    }
  }
    // return undefined
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
