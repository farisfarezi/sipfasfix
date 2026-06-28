// MOCK SERVICE — aktifkan import supabase setelah database terhubung
// import { supabase } from '../lib/supabase';

export const mockUsers = [
  { id: 'admin-1234-5678', nama: 'Administrator SIPFAS', email: 'admin@polinela.ac.id', username: 'admin', password: 'Admin123!', identitas: '198001012010011001', no_hp: '081234567890', role: 'admin', created_at: '2026-01-01T00:00:00Z' },
  { id: 'teknisi-0001', nama: 'Budi Santoso', email: 'budi@polinela.ac.id', username: 'budi', password: 'Budi123!', identitas: '197502011999031001', no_hp: '082345678901', role: 'teknisi', created_at: '2026-01-02T00:00:00Z' },
  { id: 'teknisi-0002', nama: 'Andi Wijaya', email: 'andi@polinela.ac.id', username: 'andi', password: 'Andi123!', identitas: '198803152012011002', no_hp: '083456789012', role: 'teknisi', created_at: '2026-01-03T00:00:00Z' },
  { id: 'user-0001', nama: 'Dewi Lestari', email: 'dewi@mhs.polinela.ac.id', username: 'dewi', password: 'Dewi123!', identitas: '21754001', no_hp: '085678901234', role: 'mahasiswa', created_at: '2026-01-10T00:00:00Z' },
  { id: 'user-0002', nama: 'Ahmad Fauzi', email: 'ahmad@mhs.polinela.ac.id', username: 'ahmad', password: 'Ahmad123!', identitas: '21754002', no_hp: '086789012345', role: 'mahasiswa', created_at: '2026-01-11T00:00:00Z' },
  { id: 'user-0003', nama: 'Dr. Rizki Pratama', email: 'rizki@polinela.ac.id', username: 'rizki', password: 'Rizki123!', identitas: '197804022005011003', no_hp: '087890123456', role: 'dosen', created_at: '2026-01-12T00:00:00Z' },
];

const normalizeRole = (role) => {
  if (!role) return 'mahasiswa';
  return role;
};

globalThis.mockUsersState = mockUsers;

export const userService = {
  getAll: async () => mockUsers,
  getTeknisi: async () => mockUsers.filter(u => u.role === 'teknisi'),
  updateRole: async (id, role) => {
    const u = mockUsers.find(u => u.id === id);
    if (u) u.role = role;
    return u;
  },
  updateCredentials: async (id, credentials = {}) => {
    const u = mockUsers.find(u => u.id === id);
    if (!u) return null;

    if (credentials.username) u.username = credentials.username;
    if (credentials.password) u.password = credentials.password;

    return u;
  },
  getProfile: async (id) => {
    return mockUsers.find(u => u.id === id) || mockUsers[0];
  },
  updateProfile: async (id, updates) => {
    const u = mockUsers.find(u => u.id === id);
    if (u) Object.assign(u, updates);
    return u;
  },
  createUser: async (payload) => {
    const newUser = {
      id: `user-${Date.now()}`,
      nama: payload.nama || 'Pengguna Baru',
      email: payload.email,
      username: payload.username || payload.email?.split('@')[0] || 'user',
      password: payload.password,
      identitas: payload.identitas || '-',
      no_hp: payload.noHp || '-',
      role: normalizeRole(payload.role),
      created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    globalThis.mockUsersState = mockUsers;
    return newUser;
  },
};
