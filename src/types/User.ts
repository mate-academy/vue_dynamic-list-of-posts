export interface User {
  id: number;
  name: string;
  email: string;
  password: any;
}
export type UserData = Pick<User, 'name' | 'email' | 'password'>;