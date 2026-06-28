// IMPORT SEMENTARA DI-COMMENT AGAR TIDAK ERROR KARENA SUPABASE BELUM TERHUBUNG
// import { supabase } from '../lib/supabase';
import { mockUsers } from './userService';

const mockAdminUser = {
  id: 'admin-1234-5678',
  email: 'admin@polinela.ac.id',
  nama: 'Administrator SIPFAS',
  identitas: '198001012010011001',
  no_hp: '081234567890',
  role: 'admin'
};

const superAdminUser = {
  id: 'superadmin-0001',
  email: 'superadmin@polinela.ac.id',
  username: 'superadmin',
  nama: 'Super Administrator',
  identitas: '198001012010011002',
  no_hp: '081111111111',
  role: 'admin'
};

const normalizeInput = (value = '') => value.trim().toLowerCase();

const persistSessionUser = (user) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('mock_session', 'true');
    window.localStorage.setItem('mock_session_user', JSON.stringify(user));
  }
};

const clearSessionUser = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('mock_session');
    window.localStorage.removeItem('mock_session_user');
  }
};

const findUserByCredentials = (credentials = {}) => {
  const input = normalizeInput(credentials.email || credentials.username || '');
  const password = String(credentials.password || '');

  if (!input || !password) return null;

  const mockUser = (globalThis.mockUsersState || mockUsers).find?.((u) => {
    const username = normalizeInput(u.username || '');
    const email = normalizeInput(u.email || '');
    return (username === input || email === input) && String(u.password || '') === password;
  });

  return mockUser || null;
};

const isSuperAdminCredentials = (credentials = {}) => {
  const input = normalizeInput(credentials.email || credentials.username || '');
  const password = String(credentials.password || '');

  return (input === 'superadmin' || input === 'superadmin@polinela.ac.id') && password === 'SuperAdmin123!';
};

export const authService = {
  register: async (data) => {
    console.log('Mock register', data);
    const createdUser = await import('./userService').then(({ userService }) => userService.createUser({
      nama: data.nama,
      email: data.email,
      username: data.email?.split('@')[0] || data.nama?.toLowerCase().replace(/\s+/g, ''),
      password: data.password,
      identitas: data.identitas,
      noHp: data.noHp,
      role: data.role,
    }));

    return { user: createdUser };
  },

  login: async (credentials) => {
    console.log('Mock login', credentials);

    if (isSuperAdminCredentials(credentials)) {
      persistSessionUser(superAdminUser);
      return { user: superAdminUser };
    }

    if (normalizeInput(credentials.email || credentials.username || '') === 'admin@polinela.ac.id' && String(credentials.password || '') === 'Admin123!') {
      persistSessionUser(mockAdminUser);
      return { user: mockAdminUser };
    }

    const matchedUser = findUserByCredentials(credentials);
    if (matchedUser) {
      persistSessionUser(matchedUser);
      return { user: matchedUser };
    }

    throw new Error('Email/username atau password salah.');
  },

  logout: async () => {
    console.log('Mock logout');
    clearSessionUser();
    window.location.href = '/login';
  },

  getUser: async () => {
    if (typeof window === 'undefined' || !window.localStorage.getItem('mock_session')) return null;
    const stored = window.localStorage.getItem('mock_session_user');
    if (!stored) return null;
    return JSON.parse(stored);
  },

  getSession: async () => {
    if (typeof window === 'undefined' || !window.localStorage.getItem('mock_session')) return null;
    const stored = window.localStorage.getItem('mock_session_user');
    if (!stored) return null;
    return { user: JSON.parse(stored) };
  },

  getUserProfile: async (userId) => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('mock_session_user') : null;
    if (stored) return JSON.parse(stored);

    const profile = (globalThis.mockUsersState || mockUsers).find((u) => u.id === userId);
    return profile || mockAdminUser;
  },
};
