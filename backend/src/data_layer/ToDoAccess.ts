import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Types } from 'aws-sdk/clients/s3'
import * as AWS from 'aws-sdk'
import * as AWSXRAY from 'aws-xray-sdk'

const XAWS = AWSXRAY.captureAWS(AWS)

export class ToDoAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly todoTable = process.env.TODO_TABLE,
    private readonly s3BucketName = process.env.BUCKET_NAME
  ) {}

  async getAllToDo(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    let params = {
      TableName: this.todoTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    let result = await this.docClient.query(params).promise()
    let items = result.Items

    return items as TodoItem[]
  }

  async createToDo(todoItem: TodoItem): Promise<TodoItem> {

    let params = {
      TableName: this.todoTable,
      Item: todoItem
    }

    await this.docClient.put(params).promise()

    return todoItem as TodoItem
  }

  async updateToDo(
    todoUpdate: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<TodoUpdate> {
    console.log('Updating todo')

    let params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set #a = :a, #b = :b, #c = :c',
      ExpressionAttributeNames: {
        '#a': 'name',
        '#b': 'dueDate',
        '#c': 'done'
      },
      ExpressionAttributeValues: {
        ':a': todoUpdate['name'],
        ':b': todoUpdate['dueDate'],
        ':c': todoUpdate['done']
      },
      ReturnValues: 'ALL_NEW'
    }

    let result = await this.docClient.update(params).promise()
    const attributes = result.Attributes

    return attributes as TodoUpdate
  }

  async deleteToDo(todoId: string, userId: string): Promise<string> {
    console.log('Deleting todo')

    let params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }

    await this.docClient.delete(params).promise()

    return '' as string
  }

  async generateUploadUrl(todoId: string): Promise<string> {
    console.log('Generating URL')

    let url = this.s3Client.getSignedUrl('putObject', {
      Bucket: this.s3BucketName,
      Key: todoId,
      Expires: 3000
    })

    return url as string
  }
}