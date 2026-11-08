import {
  DashboardStats,
  Driver,
  Parent,
  Route,
  Schedule,
  Student,
  SystemSettings,
  Trip,
  TripHistoryItem,
  Vehicle,
  WhatsAppNotification
} from '../types';

export const api = {
  // Stats
  async getStats(): Promise<DashboardStats & { delayedStudents: Student[] }> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Gagal memuat statistik');
    return res.json();
  },

  // Students
  async getStudents(): Promise<Student[]> {
    const res = await fetch('/api/students');
    if (!res.ok) throw new Error('Gagal memuat data siswa');
    return res.json();
  },

  async createStudent(student: Partial<Student>): Promise<Student> {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    if (!res.ok) throw new Error('Gagal menambah siswa');
    return res.json();
  },

  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    if (!res.ok) throw new Error('Gagal memperbarui siswa');
    return res.json();
  },

  async deleteStudent(id: string): Promise<void> {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Gagal menghapus siswa');
  },

  // Parents
  async getParents(): Promise<Parent[]> {
    const res = await fetch('/api/parents');
    if (!res.ok) throw new Error('Gagal memuat data orang tua');
    return res.json();
  },

  // Drivers
  async getDrivers(): Promise<Driver[]> {
    const res = await fetch('/api/drivers');
    if (!res.ok) throw new Error('Gagal memuat data supir');
    return res.json();
  },

  async createDriver(driver: Partial<Driver>): Promise<Driver> {
    const res = await fetch('/api/drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driver)
    });
    if (!res.ok) throw new Error('Gagal menambah data supir');
    return res.json();
  },

  async updateDriver(id: string, driver: Partial<Driver>): Promise<Driver> {
    const res = await fetch(`/api/drivers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driver)
    });
    if (!res.ok) throw new Error('Gagal memperbarui data supir');
    return res.json();
  },

  async deleteDriver(id: string): Promise<void> {
    const res = await fetch(`/api/drivers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Gagal menghapus supir');
  },

  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    const res = await fetch('/api/vehicles');
    if (!res.ok) throw new Error('Gagal memuat data kendaraan');
    return res.json();
  },

  async createVehicle(veh: Partial<Vehicle>): Promise<Vehicle> {
    const res = await fetch('/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(veh)
    });
    if (!res.ok) throw new Error('Gagal menambah kendaraan');
    return res.json();
  },

  async updateVehicle(id: string, veh: Partial<Vehicle>): Promise<Vehicle> {
    const res = await fetch(`/api/vehicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(veh)
    });
    if (!res.ok) throw new Error('Gagal memperbarui kendaraan');
    return res.json();
  },

  async deleteVehicle(id: string): Promise<void> {
    const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Gagal menghapus kendaraan');
  },

  // Routes
  async getRoutes(): Promise<Route[]> {
    const res = await fetch('/api/routes');
    if (!res.ok) throw new Error('Gagal memuat data rute');
    return res.json();
  },

  async createRoute(route: Partial<Route>): Promise<Route> {
    const res = await fetch('/api/routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(route)
    });
    if (!res.ok) throw new Error('Gagal menambah rute');
    return res.json();
  },

  // Schedules
  async getSchedules(): Promise<Schedule[]> {
    const res = await fetch('/api/schedules');
    if (!res.ok) throw new Error('Gagal memuat jadwal');
    return res.json();
  },

  // Trip
  async getCurrentTrip(): Promise<Trip> {
    const res = await fetch('/api/trips/current');
    if (!res.ok) throw new Error('Gagal memuat perjalanan saat ini');
    return res.json();
  },

  async updateTripStatus(stage: string, notes?: string): Promise<{
    currentTrip: Trip;
    historyItem: TripHistoryItem;
    newNotifications: WhatsAppNotification[];
    message: string;
  }> {
    const res = await fetch('/api/trips/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, notes })
    });
    if (!res.ok) throw new Error('Gagal memperbarui status perjalanan');
    return res.json();
  },

  async getTripHistory(): Promise<TripHistoryItem[]> {
    const res = await fetch('/api/trips/history');
    if (!res.ok) throw new Error('Gagal memuat riwayat perjalanan');
    return res.json();
  },

  // WhatsApp
  async getWhatsAppLogs(): Promise<WhatsAppNotification[]> {
    const res = await fetch('/api/whatsapp/logs');
    if (!res.ok) throw new Error('Gagal memuat log WhatsApp');
    return res.json();
  },

  async sendTestWhatsApp(phone: string, message: string): Promise<any> {
    const res = await fetch('/api/whatsapp/send-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message })
    });
    if (!res.ok) throw new Error('Gagal mengirim WhatsApp tes');
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SystemSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Gagal memuat pengaturan');
    return res.json();
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<{ settings: SystemSettings }> {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Gagal memperbarui pengaturan');
    return res.json();
  },

  async resetDemo(): Promise<void> {
    const res = await fetch('/api/reset-demo', { method: 'POST' });
    if (!res.ok) throw new Error('Gagal reset demo data');
  }
};
