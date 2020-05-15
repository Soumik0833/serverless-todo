import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createToDo } from '../../business_logic/businessFunctions'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  let auth = event.headers.Authorization
  let split = auth.split(' ')
  let jwtToken = split[1]

  let newToDoItem = await createToDo(newTodo, jwtToken)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newToDoItem
    })
  }

}
