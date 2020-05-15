import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {createLogger} from '../../utils/logger'
import {deleteToDo} from '../../business_logic/businessFunctions'


const logger = createLogger('deleteToDo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let todoId = event.pathParameters.todoId
  logger.info('Processing the following event - ', event)
  let auth = event.headers.Authorization
  let split = auth.split(' ')
  let jwtToken = split[1]

  let deleteToDoItem = await deleteToDo(todoId, jwtToken)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Deleted the item",
      item: deleteToDoItem
    })
  }
}
