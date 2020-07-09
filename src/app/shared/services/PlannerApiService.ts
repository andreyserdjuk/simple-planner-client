import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {EnumType, jsonToGraphQLQuery} from 'json-to-graphql-query';
import {Observable} from 'rxjs';
import {TaskInterface} from '../types/TaskInterface';
import {DateTime} from 'luxon';
import {map} from 'rxjs/operators';
import {BackendPagedCollectionInterface} from '../types/BackendPagedCollectionInterface';
import {CreateTaskInputInterface} from '../types/CreateTaskInputInterface';
import {UpdateTaskInputInterface} from '../types/UpdateTaskInputInterface';

@Injectable()
export class PlannerApiService {
  endpoint: string = environment.api.gql;

  constructor(public http: HttpClient) {
  }

  getTasks(page = 0, limit = 1000, status: string = null): Observable<TaskInterface[]> {
    const queryJson = {
      query: {
        tasks: {
          __args: {
            sorting: [
              {
                by: new EnumType('CREATED_AT'),
                dir: new EnumType('DESC'),
              }
            ],
            filter: [],
            limit,
            page,
          },
          id: true,
          title: true,
          dateStart: true,
          dateEnd: true,
          createdAt: true,
          updatedAt: true,
          taskStatus: true,
          taskPriority: true,
        }
      }
    };

    if (status) {
      queryJson.query.tasks.__args.filter.push({
        name: new EnumType('TASK_STATUS'),
        type: new EnumType('EQUALS'),
        value: status,
      });
    }

    const query = jsonToGraphQLQuery(queryJson);
    const data: object = {query};

    return this.http.post(this.endpoint, JSON.stringify(data), getHttpOptions()).pipe(
      map((backendTasks: BackendPagedCollectionInterface<any>) => {
        return backendTasks.data.tasks.map(o => {
          o.dateStart = o.dateStart ? DateTime.fromISO(o.dateStart) : null;
          o.dateEnd = o.dateEnd ? DateTime.fromISO(o.dateEnd) : null;
          o.createdAt = DateTime.fromISO(o.createdAt);
          o.updatedAt = DateTime.fromISO(o.updatedAt);
          return o;
        });
      })
    );
  }

  getTaskStatuses(): Observable<string[]> {
    return this.fetchScalars('task_statuses');
  }

  getTaskPriorities(): Observable<string[]> {
    return this.fetchScalars('task_priorities');
  }

  createTask(input: CreateTaskInputInterface): Observable<string|number> {
    const query = 'mutation createTask($input: CreateTaskInput!) { createTask(input: $input)}';
    const operationName = 'createTask';
    const variables = {input};
    const data = {operationName, query, variables};

    return this.http.post(this.endpoint, JSON.stringify(data), getHttpOptions()).pipe(
      map((responseData: any) => responseData.data.createTask)
    );
  }

  updateTask(input: UpdateTaskInputInterface): Observable<string|number> {
    const query = 'mutation updateTask($input: UpdateTaskInput!) { updateTask(input: $input)}';
    const operationName = 'updateTask';
    const variables = {input};
    const data = {operationName, query, variables};

    return this.http.post(this.endpoint, JSON.stringify(data), getHttpOptions()).pipe(
      map((responseData: any) => responseData.data.createTask)
    );
  }

  deleteTask(id): Observable<any> {
    const query = 'mutation deleteTask($input: ID!) { deleteTask(input: $input)}';
    const operationName = 'deleteTask';
    const variables = {input: id};
    const data = {operationName, query, variables};

    return this.http.post(this.endpoint, JSON.stringify(data), getHttpOptions());
  }

  protected fetchScalars(scalarName: string): Observable<string[]> {
    const queryJson = {
      query: {
        [scalarName]: true
      }
    };
    const query = jsonToGraphQLQuery(queryJson);
    const data: object = {query};

    return this.http.post(this.endpoint, JSON.stringify(data), getHttpOptions()).pipe(
      map((backendStatuses: any) => backendStatuses.data[scalarName])
    );
  }
}

function getHttpOptions(): {} {
  return {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    // withCredentials: true
  };
}
