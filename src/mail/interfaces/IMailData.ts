export interface IMailData<T = never> {
  to: string;
  data: T;
}
