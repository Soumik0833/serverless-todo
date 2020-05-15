import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllToDo } from '../../business_logic/businessFunctions'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getToDo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing the following event - ', event)
  let auth = event.headers.Authorization
  let split = auth.split(' ')
  let jwtToken = split[1]

  let allToDo = await getAllToDo(jwtToken)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: allToDo
    })
  }
}
