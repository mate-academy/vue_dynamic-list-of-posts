import type { User } from '@/types/User'

export const LocalStorage = {
  user: {
    get(): User {
      const data = localStorage.getItem('user') || '';

      return JSON.parse(data) || [{id: null, email: null, name: null}];
    },
    set(userData: User) {
      localStorage.setItem('user', JSON.stringify(userData));
    },
    clear() {
      const emptyData = [{id: null, email: null, name: null}];

      localStorage.setItem('user', JSON.stringify(emptyData));
    }
  }
}
