import { AxiosPromise } from 'axios'
import { client } from '@/utils/httpClient';

import type { User } from '@/types/User';

export class UserApi {
  static async findUser(email: User['email']): AxiosPromise<User[]> {
    return client.get(`/users?email=${email}`);
  }

  static async register(email: User['email'], name: User['name']): AxiosPromise<User> {
    const body = { email, name };

    return client.post(`/users?email=${email}`, JSON.stringify(body));
  }
}
