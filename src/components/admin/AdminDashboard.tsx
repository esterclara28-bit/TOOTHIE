import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { UserProfile, UserRole, ActivityLog, OperationType, AgeGroup, EducationLevel } from '../../types';
import { ConfirmModal } from '../modals/ConfirmModal';
import { Users, Shield, Award, BarChart3, History, Trash2, Edit3, Download, Search, Filter, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { playPop, playSuccess, playBoing } from '../../utils/soundEffects';

export const AdminDashboard: React.FC = () => {
  const { userProfile, role, isSuperAdmin, isAdmin, isViewer, logActivity } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'logs'>('users');
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');

  // Confirmation Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isDestructive: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    isDestructive: false,
    onConfirm: () => {},
  });

  // Edit Role Modal State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('pengguna');

  // Realtime subscription to users collection
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users: UserProfile[] = [];
      snapshot.forEach((d) => {
        users.push(d.data() as UserProfile);
      });
      setUsersList(users);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching users:', error);
      setLoading(false);
    });

    const logsQuery = query(collection(db, 'activity_logs'), orderBy('createdAt', 'desc'), limit(50));
    const unsubLogs = onSnapshot(logsQuery, (snapshot) => {
      const logs: ActivityLog[] = [];
      snapshot.forEach((d) => {
        logs.push({ id: d.id, ...d.data() } as ActivityLog);
      });
      setActivityLogs(logs);
    }, (error) => {
      console.warn('Error fetching logs:', error);
    });

    return () => {
      unsubUsers();
      unsubLogs();
    };
  }, []);

  const openDeleteConfirmation = (targetUser: UserProfile) => {
    if (!isAdmin || isViewer) return;
    setConfirmModalConfig({
      isOpen: true,
      title: 'Hapus Data Pengguna?',
      message: `PERINGATAN: Tindakan ini akan menghapus akun "${targetUser.displayName}" (${targetUser.email}) beserta seluruh riwayat belajar, skor, dan sertifikat secara permanen. Tindakan ini tidak dapat dibatalkan.`,
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'users', targetUser.userId));
          await logActivity('DELETE_USER', `Menghapus data pengguna: ${targetUser.email}`, targetUser.userId);
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
          playBoing();
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `users/${targetUser.userId}`);
        }
      },
    });
  };

  const openResetProgressConfirmation = (targetUser: UserProfile) => {
    if (!isAdmin || isViewer) return;
    setConfirmModalConfig({
      isOpen: true,
      title: 'Reset Riwayat Belajar Pengguna?',
      message: `Apakah Anda yakin ingin mengatur ulang skor Pre-Test, Post-Test, kuis, dan modul pengguna "${targetUser.displayName}"? Riwayat progres akan dikosongkan.`,
      isDestructive: true,
      onConfirm: async () => {
        try {
          await updateDoc(doc(db, 'users', targetUser.userId), {
            completedModules: ['beranda'],
            unlockedBadges: [],
            preTestScore: 0,
            preTestCompleted: false,
            postTestScore: 0,
            postTestCompleted: false,
            quizHighScore: 0,
            quizCompleted: false,
            updatedAt: new Date().toISOString(),
          });
          await logActivity('UPDATE_RECORD', `Mereset skor & progres belajar: ${targetUser.email}`, targetUser.userId);
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
          playSuccess();
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${targetUser.userId}`);
        }
      },
    });
  };

  const handleSaveRole = async () => {
    if (!editingUser || !isSuperAdmin) return;
    setConfirmModalConfig({
      isOpen: true,
      title: 'Ubah Hak Akses / Peran Akun?',
      message: `Konfirmasi perubahan peran pengguna "${editingUser.displayName}" (${editingUser.email}) dari "${editingUser.role}" menjadi "${newRole}". Peran ini mengatur batasan hak akses sistem.`,
      isDestructive: false,
      onConfirm: async () => {
        try {
          await updateDoc(doc(db, 'users', editingUser.userId), {
            role: newRole,
            updatedAt: new Date().toISOString(),
          });
          // Update /admins marker doc if changing to/from admin or super_admin
          if (newRole === 'super_admin' || newRole === 'admin') {
            await updateDoc(doc(db, 'admins', editingUser.userId), {
              userId: editingUser.userId,
              role: newRole,
              email: editingUser.email,
              createdAt: new Date().toISOString(),
            }).catch(() => {
              // Might not exist yet
            });
          }
          await logActivity('CHANGE_ROLE', `Mengubah peran ${editingUser.email} menjadi ${newRole}`, editingUser.userId);
          setEditingUser(null);
          setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
          playSuccess();
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${editingUser.userId}`);
        }
      },
    });
  };

  // Filtered users
  const filteredUsers = usersList.filter((u) => {
    const matchSearch =
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchAge = ageFilter === 'all' || u.ageGroup === ageFilter;
    return matchSearch && matchRole && matchAge;
  });

  // Calculate Community Analytics
  const totalUsers = usersList.length;
  const completedPostTestUsers = usersList.filter((u) => u.postTestCompleted);
  const avgPreTest =
    usersList.filter((u) => u.preTestScore !== undefined).length > 0
      ? Math.round(
          usersList.reduce((acc, u) => acc + (u.preTestScore || 0), 0) /
            usersList.filter((u) => u.preTestScore !== undefined).length
        )
      : 0;

  const avgPostTest =
    completedPostTestUsers.length > 0
      ? Math.round(
          completedPostTestUsers.reduce((acc, u) => acc + (u.postTestScore || 0), 0) /
            completedPostTestUsers.length
        )
      : 0;

  const avgGain =
    avgPreTest < 100 && avgPostTest >= avgPreTest
      ? Math.round(((avgPostTest - avgPreTest) / (100 - avgPreTest)) * 100)
      : 0;

  // Breakdown by Age Group
  const ageGroupCounts = {
    anak_6_8: usersList.filter((u) => u.ageGroup === 'anak_6_8').length,
    anak_9_12: usersList.filter((u) => u.ageGroup === 'anak_9_12').length,
    remaja_13_17: usersList.filter((u) => u.ageGroup === 'remaja_13_17').length,
    dewasa_ortu: usersList.filter((u) => u.ageGroup === 'dewasa_ortu').length,
  };

  // Breakdown by Education Level
  const eduCounts = {
    TK_PAUD: usersList.filter((u) => u.educationLevel === 'TK_PAUD').length,
    SD_Kelas_1_3: usersList.filter((u) => u.educationLevel === 'SD_Kelas_1_3').length,
    SD_Kelas_4_6: usersList.filter((u) => u.educationLevel === 'SD_Kelas_4_6').length,
    SMP_SMA: usersList.filter((u) => u.educationLevel === 'SMP_SMA').length,
    Diploma_Sarjana: usersList.filter((u) => u.educationLevel === 'Diploma_Sarjana').length,
  };

  // Export to CSV
  const handleExportCSV = () => {
    playPop();
    const headers = [
      'User ID',
      'Nama',
      'Email',
      'Role',
      'Kelompok Usia',
      'Pendidikan',
      'Skor Pre-Test',
      'Skor Post-Test',
      'N-Gain (%)',
      'Total Modul Selesai',
      'Koleksi Badges',
      'Tanggal Dibuat',
    ];

    const rows = filteredUsers.map((u) => {
      const pre = u.preTestScore ?? 0;
      const post = u.postTestScore ?? 0;
      const gain = u.postTestCompleted && pre < 100 ? Math.round(((post - pre) / (100 - pre)) * 100) : '-';
      return [
        u.userId,
        `"${u.displayName}"`,
        u.email,
        u.role,
        u.ageGroup || '-',
        u.educationLevel || '-',
        u.preTestScore ?? '-',
        u.postTestScore ?? '-',
        gain,
        u.completedModules?.length || 0,
        u.unlockedBadges?.length || 0,
        u.createdAt || '-',
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_data_gigi_toothie_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold text-indigo-300 border border-indigo-400/30">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Panel Manajemen & Rekapitulasi Data</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            Dashboard Super Admin & Monitoring 🛡️
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-semibold max-w-xl">
            Pantau perkembangan pemahaman masyarakat, kelola akun pengguna, dan evaluasi dampak media edukasi kesehatan gigi.
          </p>
        </div>

        {/* Current User Role Pill */}
        <div className="flex flex-col items-center md:items-end gap-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Peran Aktif Anda:
          </span>
          <span
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
              isSuperAdmin
                ? 'bg-amber-400 text-slate-900'
                : isAdmin
                ? 'bg-indigo-400 text-slate-900'
                : isViewer
                ? 'bg-sky-400 text-slate-900'
                : 'bg-emerald-400 text-slate-900'
            }`}
          >
            {role.replace('_', ' ')}
          </span>
          {isViewer && (
            <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> Mode Akses Baca Saja (Viewer)
            </span>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl max-w-md">
        <button
          onClick={() => {
            playPop();
            setActiveTab('users');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-white text-slate-900 shadow-md scale-102'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Data Pengguna</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setActiveTab('analytics');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-white text-slate-900 shadow-md scale-102'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analisis & Grafik</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setActiveTab('logs');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'logs'
              ? 'bg-white text-slate-900 shadow-md scale-102'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Log</span>
        </button>
      </div>

      {/* TAB 1: USERS DATABASE MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xl space-y-6">
          {/* Controls: Search, Filters, CSV Export */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama atau email..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white text-slate-700 focus:outline-none"
              >
                <option value="all">Semua Peran</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="kader">Kader</option>
                <option value="pengguna">Pengguna</option>
                <option value="viewer">Viewer</option>
              </select>

              {/* Age Filter */}
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white text-slate-700 focus:outline-none"
              >
                <option value="all">Semua Usia</option>
                <option value="anak_6_8">Anak 6–8 Tahun</option>
                <option value="anak_9_12">Anak 9–12 Tahun</option>
                <option value="remaja_13_17">Remaja 13–17 Tahun</option>
                <option value="dewasa_ortu">Orang Tua / Dewasa</option>
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="btn-3d-cyan px-4 py-2.5 rounded-xl text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Rekap Data (.CSV)</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Peran</th>
                  <th className="py-3 px-4">Demografi</th>
                  <th className="py-3 px-4 text-center">Pre-Test</th>
                  <th className="py-3 px-4 text-center">Post-Test</th>
                  <th className="py-3 px-4 text-center">N-Gain</th>
                  <th className="py-3 px-4 text-center">Modul</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                      Tidak ada data pengguna yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const pre = u.preTestScore ?? 0;
                    const post = u.postTestScore ?? 0;
                    const gain =
                      u.postTestCompleted && pre < 100
                        ? Math.round(((post - pre) / (100 - pre)) * 100)
                        : null;

                    return (
                      <tr key={u.userId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-black text-slate-900">{u.displayName}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              u.role === 'super_admin'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : u.role === 'admin'
                                ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                                : u.role === 'kader'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : u.role === 'viewer'
                                ? 'bg-sky-100 text-sky-900 border border-sky-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-xs">
                          <div>{u.ageGroup ? u.ageGroup.replace('anak_', 'Usia ').replace('_', '–') : '-'}</div>
                          <div className="text-[10px] text-slate-400">{u.educationLevel ? u.educationLevel.replace('_', ' ') : '-'}</div>
                        </td>

                        <td className="py-3 px-4 text-center font-bold">
                          {u.preTestScore !== undefined ? (
                            <span className="px-2 py-0.5 bg-sky-50 text-sky-800 rounded-md border border-sky-200">
                              {u.preTestScore}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center font-bold">
                          {u.postTestScore !== undefined ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                              {u.postTestScore}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center font-black">
                          {gain !== null ? (
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs ${
                                gain >= 50
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : gain > 0
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              +{gain}%
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-xs bg-slate-100 px-2 py-0.5 rounded-md">
                            {u.completedModules?.length || 0} Selesai
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isSuperAdmin && (
                              <button
                                onClick={() => {
                                  playPop();
                                  setEditingUser(u);
                                  setNewRole(u.role);
                                }}
                                title="Ubah Peran (Role)"
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}

                            {isAdmin && !isViewer && (
                              <button
                                onClick={() => openResetProgressConfirmation(u)}
                                title="Reset Nilai Belajar"
                                className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-xs font-bold"
                              >
                                Reset
                              </button>
                            )}

                            {isAdmin && !isViewer && (
                              <button
                                onClick={() => openDeleteConfirmation(u)}
                                title="Hapus Pengguna"
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & GRAPHICAL RECAP */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm text-center">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wide">
                Total Partisipan
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                {totalUsers}
              </div>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Akun terdaftar</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-sky-200 shadow-sm text-center">
              <span className="text-xs font-black text-sky-600 uppercase tracking-wide">
                Rata-rata Pre-Test
              </span>
              <div className="text-3xl sm:text-4xl font-black text-sky-700 mt-1">
                {avgPreTest} <span className="text-xs text-slate-400">/100</span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Pengetahuan awal</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-emerald-200 shadow-sm text-center">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-wide">
                Rata-rata Post-Test
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-700 mt-1">
                {avgPostTest} <span className="text-xs text-slate-400">/100</span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Evaluasi akhir</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-purple-200 shadow-sm text-center">
              <span className="text-xs font-black text-purple-600 uppercase tracking-wide">
                Peningkatan (N-Gain)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-purple-700 mt-1">
                +{avgGain}%
              </div>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Efektivitas edukasi</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Pre-Test vs Post-Test Comparison */}
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">
                  Perbandingan Nilai Pre-Test vs Post-Test
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  +{Math.max(0, avgPostTest - avgPreTest)} Poin
                </span>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Pre-Test (Awal):</span>
                    <span>{avgPreTest} Poin</span>
                  </div>
                  <div className="w-full bg-slate-100 h-6 rounded-xl overflow-hidden p-0.5">
                    <div
                      className="bg-sky-400 h-full rounded-lg transition-all duration-700"
                      style={{ width: `${avgPreTest}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Post-Test (Setelah Edukasi):</span>
                    <span>{avgPostTest} Poin</span>
                  </div>
                  <div className="w-full bg-slate-100 h-6 rounded-xl overflow-hidden p-0.5">
                    <div
                      className="bg-emerald-500 h-full rounded-lg transition-all duration-700"
                      style={{ width: `${avgPostTest}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-500 leading-relaxed pt-2">
                Grafik menunjukkan kenaikan pemahaman yang signifikan setelah pengguna membaca modul gigi dan melakukan simulasi interaktif sikat gigi 2 menit.
              </p>
            </div>

            {/* Chart 2: Distribution by Age Group */}
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">
                Distribusi Partisipan Berdasarkan Kelompok Usia
              </h3>

              <div className="space-y-3 pt-2 text-xs font-bold text-slate-600">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Anak 6–8 Tahun:</span>
                    <span>{ageGroupCounts.anak_6_8} Orang ({totalUsers > 0 ? Math.round((ageGroupCounts.anak_6_8 / totalUsers) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${totalUsers > 0 ? (ageGroupCounts.anak_6_8 / totalUsers) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Anak 9–12 Tahun (Target Utama):</span>
                    <span>{ageGroupCounts.anak_9_12} Orang ({totalUsers > 0 ? Math.round((ageGroupCounts.anak_9_12 / totalUsers) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${totalUsers > 0 ? (ageGroupCounts.anak_9_12 / totalUsers) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Remaja 13–17 Tahun:</span>
                    <span>{ageGroupCounts.remaja_13_17} Orang ({totalUsers > 0 ? Math.round((ageGroupCounts.remaja_13_17 / totalUsers) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-sky-400 h-full rounded-full" style={{ width: `${totalUsers > 0 ? (ageGroupCounts.remaja_13_17 / totalUsers) * 100 : 0}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Orang Tua / Dewasa Pendamping:</span>
                    <span>{ageGroupCounts.dewasa_ortu} Orang ({totalUsers > 0 ? Math.round((ageGroupCounts.dewasa_ortu / totalUsers) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${totalUsers > 0 ? (ageGroupCounts.dewasa_ortu / totalUsers) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITY LOGS AUDIT TRAIL */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Catatan Riwayat Aktivitas Sistem (Audit Trail)
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Setiap tindakan penting dicatat otomatis untuk keamanan dan akuntabilitas data.
              </p>
            </div>
            <span className="text-xs font-black bg-slate-100 px-3 py-1 rounded-full text-slate-600">
              {activityLogs.length} Aktivitas Terakhir
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {activityLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 font-bold text-xs">
                Belum ada aktivitas tercatat.
              </div>
            ) : (
              activityLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800">
                        {log.actorEmail}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                        {log.actorRole}
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-md">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">{log.details}</p>
                  </div>
                  <span className="text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('id-ID')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Role Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-indigo-300 space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Ubah Peran (Role) Pengguna
            </h3>
            <p className="text-xs font-semibold text-slate-600">
              Akun: <strong>{editingUser.displayName}</strong> ({editingUser.email})
            </p>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-black text-slate-700 block">
                Pilih Peran Baru:
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm bg-white focus:outline-none"
              >
                <option value="super_admin">Super Admin (Akses Penuh Seluruh Sistem)</option>
                <option value="admin">Admin (Kelola & Edit Data)</option>
                <option value="kader">Kader (Pendamping Warga Posyandu/UKS)</option>
                <option value="pengguna">Pengguna (Akses Materi & Kuis Standar)</option>
                <option value="viewer">Viewer (Akses Pemantauan Baca Saja)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                className="btn-3d-cyan px-5 py-2 rounded-xl text-xs font-black text-white"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Warning Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        isDestructive={confirmModalConfig.isDestructive}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
