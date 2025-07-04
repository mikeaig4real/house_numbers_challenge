import api from '../utils/axios';
import { UserType } from '../types';

export async function signUp(email: string, password: string) {
  const res = await api.post<UserType.User>('/auth/signup', { email, password });
  return res.data;
}

export async function signIn ( email: string, password: string )
{
  const res = await api.post<UserType.User>('/auth/login', { email, password });
  return res.data;
}

export async function logout() {
  await api.post('/auth/logout');
}
