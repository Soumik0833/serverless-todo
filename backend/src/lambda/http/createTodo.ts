import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createToDo } from '../../business_logic/businessFunctions'
import { createLogger } from '../../utils/logger'


const logger = createLogger('getToDo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing the following event - ', event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  let auth = event.headers.Authorization
  let split = auth.split(' ')
  let jwtToken = split[1]

  let newToDoItem = await createToDo(newTodo, jwtToken)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newToDoItem
    })
  }

}
