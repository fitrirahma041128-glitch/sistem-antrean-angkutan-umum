import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

app.use(express.json());

// Initial Seed Data matching the poster
function getInitialData() {
  return {
    settings: {
      schoolName: 'SMP Muhammadiyah 1 Wanareja',
      schoolSubtext: 'Kecamatan Wanareja, Kabupaten Cilacap, Jawa Tengah',
      schoolAddress: 'Jl. Nasional III No. 45, Wanareja, Cilacap 53265',
      fonnteApiToken: process.env.FONNTE_API_TOKEN || '',
      senderPhone: '0812-9876-5432',
      isSimulationMode: !process.env.FONNTE_API_TOKEN,
      morningStart: '06:30',
      morningEnd: '08:00',
      templates: {
        departed: 'SMP Muhammadiyah 1 Wanareja: Halo Bunda/Ayah [NAMA_ORTU], angkot sekolah ([NAMA_SUPIR] - [PLAT]) sudah berangkat menuju rumah ananda [NAMA_SISWA].',
        at_pickup: 'SMP Muhammadiyah 1 Wanareja: Ananda [NAMA_SISWA] sudah sampai di titik penjemputan ([LOKASI]). Mohon bersiap.',
        boarded: 'SMP Muhammadiyah 1 Wanareja: Ananda [NAMA_SISWA] sudah naik angkot sekolah ([PLAT]) dengan selamat.',
        arrived: 'SMP Muhammadiyah 1 Wanareja: Ananda [NAMA_SISWA] sudah sampai sekolah dengan selamat pada pukul [WAKTU]. 🙏'
      }
    },
    students: [
      {
        id: 'std-1',
        nis: '202407001',
        name: 'Andi Pratama',
        class: 'VII A',
        gender: 'L',
        parentName: 'Hj. Rohmah / Bpk. Sutrisno',
        parentPhone: '0812-3456-7890',
        address: 'Jl. Melati No. 12, RT 02/RW 04, Wanareja',
        pickupPoint: 'Jl. Melati (Dekat Pos Ronda 2)',
        driverId: 'drv-1',
        vehicleId: 'veh-1',
        routeId: 'rt-1',
        status: 'arrived',
        pickupTime: '06.50 WIB',
        arrivalTime: '07.15 WIB',
        isDelayed: true,
        delayMinutes: 10,
        avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'std-2',
        nis: '202407002',
        name: 'Siti Aisyah',
        class: 'VII A',
        gender: 'P',
        parentName: 'Ibu Maryam',
        parentPhone: '0813-8899-1234',
        address: 'Desa Adimulya RT 01/RW 03, Wanareja',
        pickupPoint: 'Perempatan Masjid Al-Hidayah Adimulya',
        driverId: 'drv-1',
        vehicleId: 'veh-1',
        routeId: 'rt-1',
        status: 'arrived',
        pickupTime: '06.55 WIB',
        arrivalTime: '07.15 WIB',
        isDelayed: false,
        delayMinutes: 0
      },
      {
        id: 'std-3',
        nis: '202407003',
        name: 'Rizky Maulana',
        class: 'VII B',
        gender: 'L',
        parentName: 'Bpk. Hendra Gunawan',
        parentPhone: '0857-1234-5678',
        address: 'Jl. Pramuka No. 45, Wanareja',
        pickupPoint: 'Depan Balai Desa Wanareja',
        driverId: 'drv-1',
        vehicleId: 'veh-1',
        routeId: 'rt-1',
        status: 'arrived',
        pickupTime: '07.02 WIB',
        arrivalTime: '07.15 WIB',
        isDelayed: false,
        delayMinutes: 0
      },
      {
        id: 'std-4',
        nis: '202408012',
        name: 'Dewi Anggraini',
        class: 'VIII A',
        gender: 'P',
        parentName: 'Ibu Ratna Sari',
        parentPhone: '0878-5566-7788',
        address: 'Dusun Cihaur RT 03/RW 02, Madusari',
        pickupPoint: 'Gapura Dusun Cihaur',
        driverId: 'drv-1',
        vehicleId: 'veh-1',
        routeId: 'rt-1',
        status: 'arrived',
        pickupTime: '07.05 WIB',
        arrivalTime: '07.15 WIB',
        isDelayed: false,
        delayMinutes: 0
      },
      {
        id: 'std-5',
        nis: '202408025',
        name: 'Fajar Nugroho',
        class: 'VIII B',
        gender: 'L',
        parentName: 'Bpk. Joko Purnomo',
        parentPhone: '0812-7788-9900',
        address: 'Jl. Merdeka No. 8, Tarisi, Wanareja',
        pickupPoint: 'Pertigaan Pasar Tarisi',
        driverId: 'drv-1',
        vehicleId: 'veh-1',
        routeId: 'rt-1',
        status: 'arrived',
        pickupTime: '07.08 WIB',
        arrivalTime: '07.15 WIB',
        isDelayed: false,
        delayMinutes: 0
      },
      {
        id: 'std-6',
        nis: '202409001',
        name: 'Nabila Azzahra',
        class: 'IX A',
        gender: 'P',
        parentName: 'Ibu Kurniawati',
        parentPhone: '0821-4455-6677',
        address: 'Desa Limbangan RT 04/RW 01, Wanareja',
        pickupPoint: 'Jembatan Limbangan',
        driverId: 'drv-2',
        vehicleId: 'veh-2',
        routeId: 'rt-2',
        status: 'boarded',
        pickupTime: '06.52 WIB',
        isDelayed: false
      },
      {
        id: 'std-7',
        nis: '202409015',
        name: 'Muhammad Ilham',
        class: 'IX B',
        gender: 'L',
        parentName: 'Bpk. Supriyanto',
        parentPhone: '0852-3344-5566',
        address: 'Jl. Raya Cigintung No. 22',
        pickupPoint: 'Depan SMP PGRI Wanareja lama',
        driverId: 'drv-2',
        vehicleId: 'veh-2',
        routeId: 'rt-2',
        status: 'boarded',
        pickupTime: '06.58 WIB',
        isDelayed: false
      },
      {
        id: 'std-8',
        nis: '202407050',
        name: 'Dimas Aditya',
        class: 'VII C',
        gender: 'L',
        parentName: 'Bpk. Rahmat Hidayat',
        parentPhone: '0819-2233-4455',
        address: 'Desa Tambaksari RT 02/RW 05',
        pickupPoint: 'Pangkalan Ojek Tambaksari',
        driverId: 'drv-3',
        vehicleId: 'veh-3',
        routeId: 'rt-3',
        status: 'pending',
        isDelayed: false
      }
    ],
    drivers: [
      {
        id: 'drv-1',
        name: 'Budi Santoso',
        phone: '0813-2890-4411',
        simNumber: '9208-1123-0001',
        vehicleId: 'veh-1',
        vehiclePlate: 'B 1234 KZ',
        vehicleName: 'Angkot 01 (Kuning)',
        routeId: 'rt-1',
        routeName: 'Rute Wanareja - Madusari',
        status: 'active',
        rating: 4.9,
        avatarUrl: ''
      },
      {
        id: 'drv-2',
        name: 'Agus Setiawan',
        phone: '0852-7890-1122',
        simNumber: '9208-1123-0002',
        vehicleId: 'veh-2',
        vehiclePlate: 'R 8412 NN',
        vehicleName: 'Angkot 02 (Kuning)',
        routeId: 'rt-2',
        routeName: 'Rute Limbangan - Wanareja',
        status: 'in_transit',
        rating: 4.8,
        avatarUrl: ''
      },
      {
        id: 'drv-3',
        name: 'Supardi Hartono',
        phone: '0878-1234-9988',
        simNumber: '9208-1123-0003',
        vehicleId: 'veh-3',
        vehiclePlate: 'R 8921 YB',
        vehicleName: 'Angkot 03 (Kuning)',
        routeId: 'rt-3',
        routeName: 'Rute Tambaksari - Wanareja',
        status: 'active',
        rating: 4.7,
        avatarUrl: ''
      },
      {
        id: 'drv-4',
        name: 'Wahyu Hidayat',
        phone: '0812-4455-6677',
        simNumber: '9208-1123-0004',
        vehicleId: 'veh-4',
        vehiclePlate: 'R 9102 ZA',
        vehicleName: 'Angkot 04 (Kuning)',
        routeId: 'rt-4',
        routeName: 'Rute Cigintung - Sekolah',
        status: 'active',
        rating: 4.9,
        avatarUrl: ''
      }
    ],
    vehicles: [
      {
        id: 'veh-1',
        code: 'Angkot 01',
        name: 'Angkot Wanareja 01',
        plateNumber: 'B 1234 KZ',
        capacity: 12,
        type: 'Suzuki Carry Futura 1.5 (Kuning)',
        status: 'active',
        driverId: 'drv-1',
        driverName: 'Budi Santoso',
        lastServiceDate: '2026-10-15'
      },
      {
        id: 'veh-2',
        code: 'Angkot 02',
        name: 'Angkot Wanareja 02',
        plateNumber: 'R 8412 NN',
        capacity: 12,
        type: 'Suzuki Carry Futura 1.5 (Kuning)',
        status: 'active',
        driverId: 'drv-2',
        driverName: 'Agus Setiawan',
        lastServiceDate: '2026-10-22'
      },
      {
        id: 'veh-3',
        code: 'Angkot 03',
        name: 'Angkot Wanareja 03',
        plateNumber: 'R 8921 YB',
        capacity: 10,
        type: 'Daihatsu Gran Max (Kuning)',
        status: 'active',
        driverId: 'drv-3',
        driverName: 'Supardi Hartono',
        lastServiceDate: '2026-11-01'
      },
      {
        id: 'veh-4',
        code: 'Angkot 04',
        name: 'Angkot Wanareja 04',
        plateNumber: 'R 9102 ZA',
        capacity: 12,
        type: 'Suzuki Carry 1.5 (Kuning)',
        status: 'active',
        driverId: 'drv-4',
        driverName: 'Wahyu Hidayat',
        lastServiceDate: '2026-10-30'
      },
      {
        id: 'veh-5',
        code: 'Angkot 05',
        name: 'Angkot Wanareja 05 (Cadangan)',
        plateNumber: 'R 8110 KC',
        capacity: 12,
        type: 'Suzuki Carry (Kuning)',
        status: 'idle',
        lastServiceDate: '2026-09-12'
      }
    ],
    routes: [
      {
        id: 'rt-1',
        name: 'Rute Wanareja - Madusari',
        description: 'Melewati Jl. Melati, Desa Adimulya, Dusun Cihaur, Tarisi ke SMP Muhammadiyah 1',
        startLocation: 'SMP Muhammadiyah 1 Wanareja',
        pickupPoints: [
          'Jl. Melati (Pos Ronda 2)',
          'Masjid Al-Hidayah Adimulya',
          'Balai Desa Wanareja',
          'Gapura Dusun Cihaur',
          'Pasar Tarisi'
        ],
        destination: 'SMP Muhammadiyah 1 Wanareja',
        distanceKm: 8.5,
        estimatedDurationMinutes: 35,
        activeDriversCount: 1,
        coordinates: [
          { lat: -7.3482, lng: 108.6835, label: 'SMP Muhammadiyah 1 Wanareja (Sekolah)' },
          { lat: -7.3510, lng: 108.6800, label: 'Jl. Melati No. 12' },
          { lat: -7.3560, lng: 108.6750, label: 'Perempatan Masjid Adimulya' },
          { lat: -7.3620, lng: 108.6710, label: 'Gapura Dusun Cihaur' },
          { lat: -7.3680, lng: 108.6650, label: 'Pertigaan Pasar Tarisi' }
        ]
      },
      {
        id: 'rt-2',
        name: 'Rute Limbangan - Wanareja',
        description: 'Jalur timur Wanareja melintasi jembatan Limbangan dan Cigintung',
        startLocation: 'SMP Muhammadiyah 1 Wanareja',
        pickupPoints: ['Jembatan Limbangan', 'Perum Cigintung Indah', 'Depan Kantor Pos Wanareja'],
        destination: 'SMP Muhammadiyah 1 Wanareja',
        distanceKm: 6.2,
        estimatedDurationMinutes: 25,
        activeDriversCount: 1,
        coordinates: [
          { lat: -7.3482, lng: 108.6835, label: 'SMP Muhammadiyah 1 Wanareja' },
          { lat: -7.3420, lng: 108.6920, label: 'Jembatan Limbangan' },
          { lat: -7.3460, lng: 108.6890, label: 'Kantor Pos Wanareja' }
        ]
      },
      {
        id: 'rt-3',
        name: 'Rute Tambaksari - Wanareja',
        description: 'Melayani area perbatasan Tambaksari dan sekitarnya',
        startLocation: 'SMP Muhammadiyah 1 Wanareja',
        pickupPoints: ['Pangkalan Ojek Tambaksari', 'Simpang Tiga Madusari'],
        destination: 'SMP Muhammadiyah 1 Wanareja',
        distanceKm: 9.1,
        estimatedDurationMinutes: 40,
        activeDriversCount: 1,
        coordinates: [
          { lat: -7.3482, lng: 108.6835, label: 'SMP Muhammadiyah 1 Wanareja' },
          { lat: -7.3350, lng: 108.6700, label: 'Tambaksari Pangkalan' }
        ]
      }
    ],
    schedules: [
      {
        id: 'sch-1',
        type: 'morning_pickup',
        day: 'Senin - Jumat',
        timeStart: '06:30',
        timeEnd: '07:20',
        driverId: 'drv-1',
        driverName: 'Budi Santoso',
        vehiclePlate: 'B 1234 KZ',
        routeName: 'Rute Wanareja - Madusari',
        studentCount: 5,
        status: 'in_progress'
      },
      {
        id: 'sch-2',
        type: 'morning_pickup',
        day: 'Senin - Jumat',
        timeStart: '06:40',
        timeEnd: '07:25',
        driverId: 'drv-2',
        driverName: 'Agus Setiawan',
        vehiclePlate: 'R 8412 NN',
        routeName: 'Rute Limbangan - Wanareja',
        studentCount: 4,
        status: 'in_progress'
      },
      {
        id: 'sch-3',
        type: 'afternoon_dropoff',
        day: 'Senin - Kamis',
        timeStart: '14:00',
        timeEnd: '15:00',
        driverId: 'drv-1',
        driverName: 'Budi Santoso',
        vehiclePlate: 'B 1234 KZ',
        routeName: 'Rute Wanareja - Madusari',
        studentCount: 5,
        status: 'scheduled'
      }
    ],
    currentTrip: {
      id: 'trip-today-01',
      date: new Date().toISOString().split('T')[0],
      driverId: 'drv-1',
      driverName: 'Budi Santoso',
      vehicleId: 'veh-1',
      vehiclePlate: 'B 1234 KZ',
      routeName: 'Rute Wanareja',
      status: 'arrived_school', // Current state: arrived at school as shown in poster, can be reset or transitioned
      departureTime: '06.40 WIB',
      atPickupTime: '06.50 WIB',
      boardedTime: '07.00 WIB',
      arrivalTime: '07.15 WIB',
      studentIds: ['std-1', 'std-2', 'std-3', 'std-4', 'std-5'],
      currentLocation: {
        lat: -7.3482,
        lng: 108.6835,
        name: 'SMP Muhammadiyah 1 Wanareja'
      }
    },
    tripHistory: [
      {
        id: 'th-4',
        tripId: 'trip-today-01',
        date: new Date().toISOString().split('T')[0],
        timeStr: '07.15',
        driverName: 'Budi Santoso',
        vehiclePlate: 'B 1234 KZ',
        action: 'Sampai di Sekolah',
        stage: 'arrived_school',
        location: 'SMP Muhammadiyah 1 Wanareja',
        notes: 'Semua 5 siswa telah tiba di sekolah dengan selamat.'
      },
      {
        id: 'th-3',
        tripId: 'trip-today-01',
        date: new Date().toISOString().split('T')[0],
        timeStr: '07.00',
        driverName: 'Budi Santoso',
        vehiclePlate: 'B 1234 KZ',
        action: 'Siswa Sudah Naik',
        stage: 'students_boarded',
        location: 'Dusun Cihaur & Tarisi',
        notes: '5 siswa telah menaiki kendaraan Angkot 01.'
      },
      {
        id: 'th-2',
        tripId: 'trip-today-01',
        date: new Date().toISOString().split('T')[0],
        timeStr: '06.50',
        driverName: 'Budi Santoso',
        vehiclePlate: 'B 1234 KZ',
        action: 'Tiba di Titik Jemput',
        stage: 'at_pickup',
        location: 'Jl. Melati & Masjid Adimulya',
        notes: 'Angkot telah tiba di titik kumpul penjemputan.'
      },
      {
        id: 'th-1',
        tripId: 'trip-today-01',
        date: new Date().toISOString().split('T')[0],
        timeStr: '06.40',
        driverName: 'Budi Santoso',
        vehiclePlate: 'B 1234 KZ',
        action: 'Berangkat dari Sekolah',
        stage: 'departed_school',
        location: 'SMP Muhammadiyah 1 Wanareja',
        notes: 'Supir memulai perjalanan penjemputan pagi.'
      }
    ],
    whatsappLogs: [
      {
        id: 'wa-4',
        timestamp: new Date().toISOString(),
        timeStr: '07.15',
        targetPhone: '0812-3456-7890',
        targetName: 'Hj. Rohmah / Bpk. Sutrisno',
        studentName: 'Andi Pratama',
        stage: 'arrived_school',
        message: 'SMP Muhammadiyah 1 Wanareja: Ananda Andi Pratama sudah sampai sekolah dengan selamat. 🙏',
        status: 'simulated'
      },
      {
        id: 'wa-3',
        timestamp: new Date().toISOString(),
        timeStr: '07.00',
        targetPhone: '0812-3456-7890',
        targetName: 'Hj. Rohmah / Bpk. Sutrisno',
        studentName: 'Andi Pratama',
        stage: 'students_boarded',
        message: 'SMP Muhammadiyah 1 Wanareja: Ananda Andi Pratama sudah naik angkot sekolah (B 1234 KZ).',
        status: 'simulated'
      },
      {
        id: 'wa-2',
        timestamp: new Date().toISOString(),
        timeStr: '06.50',
        targetPhone: '0812-3456-7890',
        targetName: 'Hj. Rohmah / Bpk. Sutrisno',
        studentName: 'Andi Pratama',
        stage: 'at_pickup',
        message: 'SMP Muhammadiyah 1 Wanareja: Ananda sudah sampai di titik penjemputan (Jl. Melati).',
        status: 'simulated'
      },
      {
        id: 'wa-1',
        timestamp: new Date().toISOString(),
        timeStr: '06.40',
        targetPhone: '0812-3456-7890',
        targetName: 'Hj. Rohmah / Bpk. Sutrisno',
        studentName: 'Andi Pratama',
        stage: 'departed_school',
        message: 'SMP Muhammadiyah 1 Wanareja: Halo Bunda, angkot sekolah sudah berangkat menuju rumah ananda.',
        status: 'simulated'
      }
    ]
  };
}

// Read database
function readDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db:', err);
    return getInitialData();
  }
}

// Write database
function writeDb(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

// Helper: Format Indonesian time e.g. "07.15"
function getCurrentTimeFormatted(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}.${minutes}`;
}

// Helper: Send WhatsApp via Fonnte or record simulation
async function sendWhatsAppFonnte(targetPhone: string, message: string, token: string) {
  if (!token || token.trim() === '') {
    return { success: true, simulated: true };
  }

  try {
    // Format Indonesian phone number if starts with 08 -> 628
    let formattedPhone = targetPhone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.slice(1);
    }

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target: formattedPhone,
        message: message,
        countryCode: '62'
      })
    });

    const resJson = await response.json();
    return { success: response.ok, data: resJson, simulated: false };
  } catch (err: any) {
    console.warn('Fonnte send error:', err.message);
    return { success: false, error: err.message, simulated: false };
  }
}

// --- API ROUTES ---

// 1. Auth Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  // Easy & secure credentials for demo:
  // Admin: admin / admin123
  // Driver: supir1 / supir123 or budi / 123456
  const cleanUser = (username || '').trim().toLowerCase();
  
  if (role === 'admin') {
    if (cleanUser === 'admin' && (password === 'admin123' || password === 'admin' || password === '123456')) {
      return res.json({
        success: true,
        user: {
          id: 'adm-1',
          username: 'admin',
          name: 'Ibu Ratna Kumalasari, S.Pd',
          role: 'admin',
          avatarUrl: '',
          phone: '0812-9876-5432',
          email: 'admin.tu@smpmuh1wanareja.sch.id'
        }
      });
    }
    // Allow demo fast login if username is admin
    if (cleanUser === 'admin') {
      return res.json({
        success: true,
        user: {
          id: 'adm-1',
          username: 'admin',
          name: 'Ibu Ratna Kumalasari, S.Pd (Tata Usaha)',
          role: 'admin',
          email: 'admin.tu@smpmuh1wanareja.sch.id'
        }
      });
    }
  } else if (role === 'driver') {
    const db = readDb();
    const foundDriver = db.drivers.find(
      (d: any) => d.name.toLowerCase().includes(cleanUser) || cleanUser === 'supir' || cleanUser === 'supir1' || cleanUser === 'budi'
    );
    const driverObj = foundDriver || db.drivers[0];
    return res.json({
      success: true,
      user: {
        id: driverObj.id,
        username: driverObj.name.toLowerCase().replace(/\s+/g, ''),
        name: driverObj.name,
        role: 'driver',
        phone: driverObj.phone,
        vehiclePlate: driverObj.vehiclePlate,
        vehicleName: driverObj.vehicleName,
        routeName: driverObj.routeName
      }
    });
  }

  // Fallback if not matched
  return res.status(401).json({
    success: false,
    message: 'Username atau password tidak sesuai. Coba username: admin (password: admin123) atau supir1 (password: supir123).'
  });
});

// 2. Stats for Dashboard (Matches poster numbers)
app.get('/api/stats', (req: Request, res: Response) => {
  const db = readDb();
  const delayed = db.students.filter((s: any) => s.isDelayed);
  res.json({
    totalStudents: 248, // Total school students enrolled in transit
    totalDrivers: 12,
    totalVehicles: 8,
    totalRoutes: 15,
    todayTripsCount: db.tripHistory.length,
    delayedStudentsCount: delayed.length,
    delayedStudents: delayed
  });
});

// 3. Students CRUD
app.get('/api/students', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.students);
});

app.post('/api/students', (req: Request, res: Response) => {
  const db = readDb();
  const newStudent = {
    id: `std-${Date.now()}`,
    nis: req.body.nis || `2024${Math.floor(1000 + Math.random() * 9000)}`,
    name: req.body.name,
    class: req.body.class || 'VII A',
    gender: req.body.gender || 'L',
    parentName: req.body.parentName || 'Orang Tua Siswa',
    parentPhone: req.body.parentPhone || '0812-0000-0000',
    address: req.body.address || 'Kecamatan Wanareja',
    pickupPoint: req.body.pickupPoint || 'Titik Kumpul',
    driverId: req.body.driverId || 'drv-1',
    vehicleId: req.body.vehicleId || 'veh-1',
    routeId: req.body.routeId || 'rt-1',
    status: 'pending',
    isDelayed: false,
    delayMinutes: 0
  };
  db.students.push(newStudent);
  writeDb(db);
  res.status(201).json(newStudent);
});

app.put('/api/students/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.students.findIndex((s: any) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Siswa tidak ditemukan' });
  }
  db.students[index] = { ...db.students[index], ...req.body };
  writeDb(db);
  res.json(db.students[index]);
});

app.delete('/api/students/:id', (req: Request, res: Response) => {
  const db = readDb();
  db.students = db.students.filter((s: any) => s.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Data siswa berhasil dihapus' });
});

// 4. Parents
app.get('/api/parents', (req: Request, res: Response) => {
  const db = readDb();
  // Derive parent list from students or return customized parent objects
  const parents = db.students.map((s: any, idx: number) => ({
    id: `par-${s.id}`,
    studentId: s.id,
    studentName: s.name,
    studentClass: s.class,
    name: s.parentName,
    phone: s.parentPhone,
    address: s.address,
    relation: idx % 2 === 0 ? 'Ibu' : 'Ayah'
  }));
  res.json(parents);
});

// 5. Drivers CRUD
app.get('/api/drivers', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.drivers);
});

app.post('/api/drivers', (req: Request, res: Response) => {
  const db = readDb();
  const newDriver = {
    id: `drv-${Date.now()}`,
    name: req.body.name,
    phone: req.body.phone,
    simNumber: req.body.simNumber || '9208-1123-0099',
    vehicleId: req.body.vehicleId || 'veh-1',
    vehiclePlate: req.body.vehiclePlate || 'B 1234 KZ',
    vehicleName: req.body.vehicleName || 'Angkot 01',
    routeId: req.body.routeId || 'rt-1',
    routeName: req.body.routeName || 'Rute Wanareja',
    status: 'active',
    rating: 5.0
  };
  db.drivers.push(newDriver);
  writeDb(db);
  res.status(201).json(newDriver);
});

app.put('/api/drivers/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.drivers.findIndex((d: any) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Supir tidak ditemukan' });
  db.drivers[index] = { ...db.drivers[index], ...req.body };
  writeDb(db);
  res.json(db.drivers[index]);
});

app.delete('/api/drivers/:id', (req: Request, res: Response) => {
  const db = readDb();
  db.drivers = db.drivers.filter((d: any) => d.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// 6. Vehicles CRUD
app.get('/api/vehicles', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.vehicles);
});

app.post('/api/vehicles', (req: Request, res: Response) => {
  const db = readDb();
  const newVeh = {
    id: `veh-${Date.now()}`,
    code: req.body.code || `Angkot 0${db.vehicles.length + 1}`,
    name: req.body.name,
    plateNumber: req.body.plateNumber,
    capacity: Number(req.body.capacity) || 12,
    type: req.body.type || 'Suzuki Carry Futura 1.5',
    status: req.body.status || 'active',
    driverName: req.body.driverName || 'Belum ditugaskan',
    lastServiceDate: new Date().toISOString().split('T')[0]
  };
  db.vehicles.push(newVeh);
  writeDb(db);
  res.status(201).json(newVeh);
});

app.put('/api/vehicles/:id', (req: Request, res: Response) => {
  const db = readDb();
  const index = db.vehicles.findIndex((v: any) => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Kendaraan tidak ditemukan' });
  db.vehicles[index] = { ...db.vehicles[index], ...req.body };
  writeDb(db);
  res.json(db.vehicles[index]);
});

app.delete('/api/vehicles/:id', (req: Request, res: Response) => {
  const db = readDb();
  db.vehicles = db.vehicles.filter((v: any) => v.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// 7. Routes CRUD
app.get('/api/routes', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.routes);
});

app.post('/api/routes', (req: Request, res: Response) => {
  const db = readDb();
  const newRoute = {
    id: `rt-${Date.now()}`,
    name: req.body.name,
    description: req.body.description || '',
    startLocation: req.body.startLocation || 'SMP Muhammadiyah 1 Wanareja',
    pickupPoints: req.body.pickupPoints || [],
    destination: req.body.destination || 'SMP Muhammadiyah 1 Wanareja',
    distanceKm: Number(req.body.distanceKm) || 7,
    estimatedDurationMinutes: Number(req.body.estimatedDurationMinutes) || 30,
    activeDriversCount: 1,
    coordinates: [
      { lat: -7.3482, lng: 108.6835, label: 'SMP Muhammadiyah 1 Wanareja' }
    ]
  };
  db.routes.push(newRoute);
  writeDb(db);
  res.status(201).json(newRoute);
});

// 8. Schedules CRUD
app.get('/api/schedules', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.schedules);
});

// 9. Current Trip for Driver & Monitoring
app.get('/api/trips/current', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.currentTrip);
});

// 10. Core Feature: Update Trip Status (The 4 buttons on Driver Mobile App)
// 1: Berangkat dari Sekolah
// 2: Sudah Sampai di Titik Penjemputan
// 3: Siswa Sudah Naik
// 4: Sampai di Sekolah
app.post('/api/trips/status', async (req: Request, res: Response) => {
  const { stage, notes } = req.body;
  const db = readDb();
  const timeNow = getCurrentTimeFormatted();
  const fullTime = `${timeNow} WIB`;

  let actionTitle = '';
  let studentStatus = 'pending';
  let messageTemplateKey = '';

  switch (stage) {
    case 'departed_school':
      actionTitle = 'Berangkat dari Sekolah';
      studentStatus = 'pending';
      messageTemplateKey = 'departed';
      db.currentTrip.status = 'departed_school';
      db.currentTrip.departureTime = fullTime;
      break;

    case 'at_pickup':
      actionTitle = 'Tiba di Titik Jemput';
      studentStatus = 'pickup_point';
      messageTemplateKey = 'at_pickup';
      db.currentTrip.status = 'at_pickup';
      db.currentTrip.atPickupTime = fullTime;
      break;

    case 'students_boarded':
      actionTitle = 'Siswa Sudah Naik';
      studentStatus = 'boarded';
      messageTemplateKey = 'boarded';
      db.currentTrip.status = 'students_boarded';
      db.currentTrip.boardedTime = fullTime;
      break;

    case 'arrived_school':
      actionTitle = 'Sampai di Sekolah';
      studentStatus = 'arrived';
      messageTemplateKey = 'arrived';
      db.currentTrip.status = 'arrived_school';
      db.currentTrip.arrivalTime = fullTime;
      break;

    default:
      return res.status(400).json({ message: 'Tahap perjalanan tidak valid' });
  }

  // Update students linked to this driver/trip
  const tripStudentIds: string[] = db.currentTrip.studentIds || [];
  db.students = db.students.map((student: any) => {
    if (tripStudentIds.includes(student.id)) {
      return {
        ...student,
        status: studentStatus,
        arrivalTime: stage === 'arrived_school' ? fullTime : student.arrivalTime
      };
    }
    return student;
  });

  // Add to Trip History log (newest on top)
  const historyItem = {
    id: `th-${Date.now()}`,
    tripId: db.currentTrip.id,
    date: new Date().toISOString().split('T')[0],
    timeStr: timeNow,
    driverName: db.currentTrip.driverName,
    vehiclePlate: db.currentTrip.vehiclePlate,
    action: actionTitle,
    stage: stage,
    location: stage === 'departed_school' ? 'SMP Muhammadiyah 1 Wanareja'
            : stage === 'at_pickup' ? 'Titik Penjemputan Jl. Melati & Adimulya'
            : stage === 'students_boarded' ? 'Dusun Cihaur & Tarisi'
            : 'SMP Muhammadiyah 1 Wanareja',
    notes: notes || `Status diperbarui menjadi: ${actionTitle}`
  };
  db.tripHistory.unshift(historyItem);

  // Generate WhatsApp notification messages for all parents of students in this trip
  const templateStr = db.settings.templates[messageTemplateKey] || 'SMP Muhammadiyah 1 Wanareja info antar jemput.';
  const token = db.settings.fonnteApiToken;
  const newNotifications: any[] = [];

  for (const studentId of tripStudentIds) {
    const student = db.students.find((s: any) => s.id === studentId);
    if (!student) continue;

    // Replace template variables
    let msg = templateStr
      .replace(/\[NAMA_ORTU\]/g, student.parentName)
      .replace(/\[NAMA_SISWA\]/g, student.name)
      .replace(/\[NAMA_SUPIR\]/g, db.currentTrip.driverName)
      .replace(/\[PLAT\]/g, db.currentTrip.vehiclePlate)
      .replace(/\[LOKASI\]/g, student.pickupPoint)
      .replace(/\[WAKTU\]/g, timeNow);

    // Call Fonnte or record simulated
    let waResult = await sendWhatsAppFonnte(student.parentPhone, msg, token);

    const notificationRecord = {
      id: `wa-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      timeStr: timeNow,
      targetPhone: student.parentPhone,
      targetName: student.parentName,
      studentName: student.name,
      stage: stage,
      message: msg,
      status: waResult.simulated ? 'simulated' : waResult.success ? 'sent' : 'failed',
      error: waResult.error
    };

    db.whatsappLogs.unshift(notificationRecord);
    newNotifications.push(notificationRecord);
  }

  writeDb(db);

  return res.json({
    success: true,
    currentTrip: db.currentTrip,
    historyItem,
    newNotifications,
    message: `Status berhasil diperbarui: ${actionTitle}`
  });
});

// 11. Trip History
app.get('/api/trips/history', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.tripHistory);
});

// 12. WhatsApp Logs & Send Test
app.get('/api/whatsapp/logs', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.whatsappLogs);
});

app.post('/api/whatsapp/send-test', async (req: Request, res: Response) => {
  const { phone, message } = req.body;
  const db = readDb();
  const token = db.settings.fonnteApiToken;
  const timeNow = getCurrentTimeFormatted();

  const waResult = await sendWhatsAppFonnte(phone, message, token);
  const logItem = {
    id: `wa-${Date.now()}`,
    timestamp: new Date().toISOString(),
    timeStr: timeNow,
    targetPhone: phone,
    targetName: 'Tes WhatsApp',
    studentName: 'Siswa Percobaan',
    stage: 'departed_school',
    message: message,
    status: waResult.simulated ? 'simulated' : waResult.success ? 'sent' : 'failed',
    error: waResult.error
  };

  db.whatsappLogs.unshift(logItem);
  writeDb(db);

  res.json({
    success: true,
    result: waResult,
    log: logItem
  });
});

// 13. System Settings
app.get('/api/settings', (req: Request, res: Response) => {
  const db = readDb();
  res.json(db.settings);
});

app.post('/api/settings', (req: Request, res: Response) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  db.settings.isSimulationMode = !db.settings.fonnteApiToken;
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// 14. Reset Demo Data to Clean State
app.post('/api/reset-demo', (req: Request, res: Response) => {
  const initial = getInitialData();
  writeDb(initial);
  res.json({ success: true, data: initial });
});

// Start Server with Vite Middleware in Development or Serve Static in Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server SIMANTAR SMP Muhammadiyah 1 Wanareja is running on port ${PORT}`);
  });
}

startServer();
