import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import {updateToDo} from '../../business_logic/businessFunctions'
import { createLogger } from '../../utils/logger'


const logger = createLogger('getToDo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing the following event - ', event)
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  let auth = event.headers.Authorization
  let split = auth.split(' ')
  let jwtToken = split[1]

  let update = await updateToDo(updatedTodo, todoId, jwtToken)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: update
    })
  }
  
}
