import {Component, OnInit} from '@angular/core';
import {PlannerApiService} from '../../../shared/services/PlannerApiService';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {TaskInterface} from '../../../shared/types/TaskInterface';
import {first, tap} from 'rxjs/operators';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.components.scss'],
})
export class DashboardComponent implements OnInit {
  public tasks: Observable<TaskInterface[]>;
  public taskStatuses = new BehaviorSubject<string[]>([]);
  public taskPriorities: Observable<string[]>;
  public currentStatus: string;

  public showCreateForm = false;
  public createTaskModel = {
    title: null,
    dateStart: null,
    dateEnd: null,
    taskPriority: null,
  };

  constructor(
    private api: PlannerApiService
  ) {}

  ngOnInit(): void {
    this.taskPriorities = this.api.getTaskPriorities();
    this.api.getTaskStatuses().pipe(
      tap((statuses: string[]) => {
        this.taskStatuses.next(statuses);
        this.currentStatus = statuses[0];
        this.reloadTasks();
      })
    ).subscribe();
  }

  reloadTasksByStatus(status: string): void {
    this.currentStatus = status;
    this.tasks = this.api.getTasks(0, 100, status);
  }

  addTask(): void {
    this.createTaskModel = {
      title: '',
      dateStart: DateTime.local().startOf('day').toFormat('yyyy-MM-dd\'T00:00\''),
      dateEnd: DateTime.local().endOf('day').toFormat('yyyy-MM-dd\'T23:59\''),
      taskPriority: null,
    };
    this.showCreateForm = true;
  }

  onSubmit(): void {
    this.createTaskModel.dateStart = DateTime.fromJSDate(new Date(this.createTaskModel.dateStart));
    this.createTaskModel.dateEnd = DateTime.fromJSDate(new Date(this.createTaskModel.dateEnd));
    this.api.createTask(this.createTaskModel).subscribe(
      (res) => {
        this.reloadTasks();
        this.showCreateForm = false;
      }
    );
  }

  setTaskStatus(id, taskStatus): void {
    this.api.updateTask({id, taskStatus}).subscribe(
      () => this.reloadTasks()
    );
  }

  deleteTask(id): void {
    this.api.deleteTask(id).subscribe(
      () => this.reloadTasks()
    );
  }

  getPriorityClass(taskPriority): string {
    if (taskPriority === 'normal') {
      return 'label-success';
    }

    if (taskPriority === 'high') {
      return 'label-danger';
    }

    return 'label-default';
  }

  protected reloadTasks(): void {
    this.tasks = this.api.getTasks(0, 100, this.currentStatus);
  }
}
