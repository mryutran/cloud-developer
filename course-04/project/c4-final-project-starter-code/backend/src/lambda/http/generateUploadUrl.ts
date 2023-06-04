import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businesslayer/todos'
import { getUserId } from '../utils'
import { updateAttachmentUrl } from '../../businesslayer/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const userId = getUserId(event);
    const presignedUploadUrl = await createAttachmentPresignedUrl(todoId)
    await updateAttachmentUrl(userId, todoId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: presignedUploadUrl
      })
    }
    // return undefined
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
