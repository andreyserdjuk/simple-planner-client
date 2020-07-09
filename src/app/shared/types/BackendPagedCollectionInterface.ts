export interface BackendPagedCollectionInterface<T> {
  data: {
    [key: string]: Array<T>
  };
}
