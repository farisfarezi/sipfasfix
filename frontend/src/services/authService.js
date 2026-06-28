// IMPORT SEMENTARA DI-COMMENT AGAR TIDAK ERROR KARENA SUPABASE BELUM TERHUBUNG
// import { supabase } from '../lib/supabase';

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

const isSuperAdminCredentials = (credentials = {}) => {
  const input = normalizeInput(credentials.email || credentials.username || '');
  const password = String(credentials.password || '');

  return (input === 'superadmin' || input === 'superadmin@polinela.ac.id') && password === 'SuperAdmin123!';
};

export const authService = {
  register: async (data) => {
    console.log('Mock register', data);
    return { user: mockAdminUser };
  },

  login: async (credentials) => {
    console.log('Mock login', credentials);

    if (isSuperAdminCredentials(credentials)) {
      localStorage.setItem('mock_session', 'true');
      return { user: superAdminUser };
    }

    // Otomatis berhasil login sebagai admin apa pun passwordnya
    localStorage.setItem('mock_session', 'true');
    return { user: mockAdminUser };
  },

  logout: async () => {
    console.log('Mock logout');
    localStorage.removeItem('mock_session');
    window.location.href = '/login';
  },

  getUser: async () => {
    // Jika tidak ada sesi di localStorage, kembalikan null (belum login)
    if (!localStorage.getItem('mock_session')) return null;
    return mockAdminUser;
  },

  getSession: async () => {
    if (!localStorage.getItem('mock_session')) return null;
    return { user: mockAdminUser };
  },

  getUserProfile: async (userId) => {
    // Selalu kembalikan profil admin untuk bypass UI
    return mockAdminUser;
  },
};
