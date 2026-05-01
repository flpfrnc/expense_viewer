'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456'; 

export async function login(password) {
  if (password === ADMIN_PASSWORD) {
    cookies().set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 Week
      path: '/',
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid password' };
}

export async function logout() {
  cookies().delete('admin_token');
  redirect('/login');
}

export async function verifyAuth() {
  const token = cookies().get('admin_token');
  return !!token;
}
