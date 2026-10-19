import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db, handleFirestoreError } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { CommunityRecord, OperationType, AgeGroup, EducationLevel } from '../../types';
import { ConfirmModal } from '../modals/ConfirmModal';
import { UserPlus, Search, Edit3, Trash2, CheckCircle2, AlertCircle, HeartHandshake, FileText, Download } from 'lucide-react';
import { playPop, playSuccess, playBoing } from '../../utils/soundEffects';

export const KaderRecordsSection: React.FC = () => {
  const { currentUser, userProfile, isKader, isAdmin, isViewer, logActivity } = useAuth();

  const [records, setRecords] = useState<CommunityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CommunityRecord | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState<number>(8);
  const [formAgeGroup, setFormAgeGroup] = useState<AgeGroup>('anak_6_8');
  const [formEdu, setFormEdu] = useState<EducationLevel>('SD_Kelas_1_3');
  const [formParent, setFormParent] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBrushing2x, setFormBrushing2x] = useState(true);
  const [formHasCavity, setFormHasCavity] = useState(false);
  const [formPreScore, setFormPreScore] = useState<number | ''>('');
  const [formPostScore, setFormPostScore] = useState<number | ''>('');
  const [formNotes, setFormNotes] = useState('');

  // Confirm modal state
  const [confirmConfig, setConfirmConfig] = useState<{
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

  // Realtime subscription to community_records
  useEffect(() => {
    const recordsRef = collection(db, 'community_records');
    const unsub = onSnapshot(recordsRef, (snapshot) => {
      const list: CommunityRecord[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as CommunityRecord);
      });
      setRecords(list);
      setLoading(false);
    }, (error) => {
      console.warn('Error fetching community records:', error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const openAddForm = () => {
    setEditingRecord(null);
    setFormName('');
    setFormAge(8);
    setFormAgeGroup('anak_6_8');
    setFormEdu('SD_Kelas_1_3');
    setFormParent('');
    setFormPhone('');
    setFormBrushing2x(true);
    setFormHasCavity(false);
    setFormPreScore('');
    setFormPostScore('');
    setFormNotes('');
    setIsFormOpen(true);
  };

  const openEditForm = (rec: CommunityRecord) => {
    setEditingRecord(rec);
    setFormName(rec.name);
    setFormAge(rec.age);
    setFormAgeGroup(rec.ageGroup);
    setFormEdu(rec.educationLevel);
    setFormParent(rec.parentName || '');
    setFormPhone(rec.phoneOrContact || '');
    setFormBrushing2x(rec.brushingHabit2x);
    setFormHasCavity(rec.hasCavity);
    setFormPreScore(rec.preTestScore !== undefined ? rec.preTestScore : '');
    setFormPostScore(rec.postTestScore !== undefined ? rec.postTestScore : '');
    setFormNotes(rec.notes || '');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const payload = {
      name: formName,
      age: Number(formAge),
      ageGroup: formAgeGroup,
      educationLevel: formEdu,
      parentName: formParent,
      phoneOrContact: formPhone,
      brushingHabit2x: formBrushing2x,
      hasCavity: formHasCavity,
      preTestScore: formPreScore !== '' ? Number(formPreScore) : undefined,
      postTestScore: formPostScore !== '' ? Number(formPostScore) : undefined,
      notes: formNotes,
      kaderId: currentUser.uid,
      kaderName: userProfile?.displayName || 'Kader Gigi',
      updatedAt: new Date().toISOString(),
    };

    if (editingRecord) {
      // Confirm update
      setConfirmConfig({
        isOpen: true,
        title: 'Perbarui Data Warga Dampingan?',
        message: `Konfirmasi pembaruan catatan kesehatan gigi untuk "${formName}". Tindakan ini akan memperbarui rekapitulasi data.`,
        isDestructive: false,
        onConfirm: async () => {
          try {
            await updateDoc(doc(db, 'community_records', editingRecord.id), payload);
            await logActivity('UPDATE_RECORD', `Memperbarui data warga dampingan: ${formName}`, editingRecord.id);
            setIsFormOpen(false);
            setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
            playSuccess();
          } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, `community_records/${editingRecord.id}`);
          }
        },
      });
    } else {
      // Add new record
      try {
        const docRef = await addDoc(collection(db, 'community_records'), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
        await logActivity('ADD_RECORD', `Menambahkan warga dampingan baru: ${formName}`, docRef.id);
        setIsFormOpen(false);
        playSuccess();
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'community_records');
      }
    }
  };

  const handleDeleteRecord = (rec: CommunityRecord) => {
    if (!isAdmin && rec.kaderId !== currentUser?.uid) return;
    setConfirmConfig({
      isOpen: true,
      title: 'Hapus Data Warga Dampingan?',
      message: `PERINGATAN: Apakah Anda yakin ingin menghapus data pemeriksaan "${rec.name}"? Data yang dihapus tidak dapat dipulihkan.`,
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'community_records', rec.id));
          await logActivity('DELETE_RECORD', `Menghapus data warga dampingan: ${rec.name}`, rec.id);
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          playBoing();
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `community_records/${rec.id}`);
        }
      },
    });
  };

  const filteredRecords = records.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.parentName && r.parentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    r.kaderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white">
            <HeartHandshake className="w-4 h-4 text-yellow-300" />
            <span>Pendampingan Posyandu / UKS Sekolah</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            Buku Catatan Kader Kesehatan Gigi 🪥
          </h1>
          <p className="text-xs sm:text-sm text-emerald-50 font-semibold max-w-xl">
            Catat hasil skrining kesehatan gigi, kebiasaan sikat gigi 2x sehari, serta perkembangan nilai warga atau anak dampingan.
          </p>
        </div>

        {!isViewer && (
          <button
            onClick={openAddForm}
            className="btn-3d-amber px-5 py-3 rounded-2xl text-white font-black text-sm flex items-center gap-2 shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>+ Tambah Warga Dampingan</span>
          </button>
        )}
      </div>

      {/* Main Records Table Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama anak / orang tua..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <span className="text-xs font-bold text-slate-500">
            Total {filteredRecords.length} Catatan Dampingan
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-emerald-50 text-emerald-950 font-black border-b border-emerald-100">
                <th className="py-3 px-4">Nama Anak & Usia</th>
                <th className="py-3 px-4">Orang Tua / Wali</th>
                <th className="py-3 px-4 text-center">Sikat 2x/Hari</th>
                <th className="py-3 px-4 text-center">Gigi Berlubang</th>
                <th className="py-3 px-4 text-center">Pre-Test</th>
                <th className="py-3 px-4 text-center">Post-Test</th>
                <th className="py-3 px-4">Kader Pencatat</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                    Belum ada data warga dampingan yang tercatat.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-black text-slate-900">{r.name}</div>
                      <div className="text-[11px] text-slate-400">
                        Usia: {r.age} Th • {r.educationLevel?.replace('_', ' ')}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div>{r.parentName || '-'}</div>
                      <div className="text-[10px] text-slate-400">{r.phoneOrContact || ''}</div>
                    </td>

                    <td className="py-3 px-4 text-center font-bold">
                      {r.brushingHabit2x ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                          ✓ Ya
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                          ✗ Belum
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center font-bold">
                      {r.hasCavity ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">
                          ⚠️ Ada Lubang
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                          ✓ Bersih
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {r.preTestScore !== undefined ? (
                        <span className="px-2 py-0.5 bg-sky-50 text-sky-800 rounded-md font-bold">
                          {r.preTestScore}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {r.postTestScore !== undefined ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md font-bold">
                          {r.postTestScore}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-xs font-medium">
                      {r.kaderName}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {!isViewer && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditForm(r)}
                            title="Edit Data"
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(r)}
                            title="Hapus Data"
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Record Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-300 space-y-4 my-8">
            <h3 className="text-xl font-black text-slate-900">
              {editingRecord ? 'Perbarui Data Warga' : 'Tambah Warga Dampingan Baru'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Nama Lengkap Anak:</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Usia (Tahun):</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1">Kelompok Usia:</label>
                  <select
                    value={formAgeGroup}
                    onChange={(e) => setFormAgeGroup(e.target.value as AgeGroup)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
                  >
                    <option value="anak_6_8">Anak 6–8 Tahun</option>
                    <option value="anak_9_12">Anak 9–12 Tahun</option>
                    <option value="remaja_13_17">Remaja 13–17</option>
                    <option value="dewasa_ortu">Orang Tua / Dewasa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Nama Orang Tua / Wali:</label>
                  <input
                    type="text"
                    value={formParent}
                    onChange={(e) => setFormParent(e.target.value)}
                    placeholder="Nama Ibu / Ayah"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1">No. Kontak / WA:</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0812..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Habit & Cavity screening switches */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formBrushing2x}
                    onChange={(e) => setFormBrushing2x(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <span>Rutin sikat gigi 2 kali sehari (Pagi & Malam)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formHasCavity}
                    onChange={(e) => setFormHasCavity(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span>Ditemukan gigi berlubang / karies saat pemeriksaan</span>
                </label>
              </div>

              {/* Pre & Post Test score inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Nilai Pre-Test (0-100):</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formPreScore}
                    onChange={(e) => setFormPreScore(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Opsional"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1">Nilai Post-Test (0-100):</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formPostScore}
                    onChange={(e) => setFormPostScore(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Opsional"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Catatan Tambahan Kader:</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Catatan perkembangan atau kebutuhan pendampingan lanjutan..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-3d-emerald px-6 py-2.5 rounded-xl text-xs font-black text-white"
                >
                  {editingRecord ? 'Simpan Pembaruan' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isDestructive={confirmConfig.isDestructive}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
