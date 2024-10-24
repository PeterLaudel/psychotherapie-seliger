export default interface IRead<T> {
  get(): Promise<T[]>;
}
