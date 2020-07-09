import {DateTime} from 'luxon';

export interface TaskInterface {
  id: string|number;
  title: string;
  taskStatus: string;
  taskPriority: string;
  dateStart: DateTime;
  dateEnd: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime;
}
