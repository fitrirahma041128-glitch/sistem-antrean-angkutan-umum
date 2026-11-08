export type UserRole = 'admin' | 'driver';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  email?: string;
}

export type StudentStatus = 'pending' | 'pickup_point' | 'boarded' | 'arrived' | 'absent';

export interface Student {
  id: string;
  nis: string;
  name: string;
  class: string;
  gender: 'L' | 'P';
  parentName: string;
  parentPhone: string;
  address: string;
  pickupPoint: string;
  driverId: string;
  vehicleId: string;
  routeId: string;
  status: StudentStatus;
  pickupTime?: string;
  arrivalTime?: string;
  isDelayed?: boolean;
  delayMinutes?: number;
  avatarUrl?: string;
}

export interface Parent {
  id: string;
  name: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  phone: string;
  address: string;
  relation: string; // Ayah / Ibu / Wali
  notes?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  simNumber: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleName: string;
  routeId: string;
  routeName: string;
  status: 'active' | 'in_transit' | 'off';
  rating: number;
  avatarUrl?: string;
}

export interface Vehicle {
  id: string;
  code: string; // e.g. "Angkot 01"
  name: string;
  plateNumber: string; // e.g. "B 1234 KZ"
  capacity: number;
  type: string; // e.g. "Angkot Wanareja (Suzuki Carry)"
  status: 'active' | 'maintenance' | 'idle';
  driverId?: string;
  driverName?: string;
  lastServiceDate?: string;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  startLocation: string;
  pickupPoints: string[];
  destination: string;
  distanceKm: number;
  estimatedDurationMinutes: number;
  activeDriversCount: number;
  coordinates: {
    lat: number;
    lng: number;
    label: string;
  }[];
}

export interface Schedule {
  id: string;
  type: 'morning_pickup' | 'afternoon_dropoff';
  day: string;
  timeStart: string;
  timeEnd: string;
  driverId: string;
  driverName: string;
  vehiclePlate: string;
  routeName: string;
  studentCount: number;
  status: 'scheduled' | 'in_progress' | 'completed';
}

export type TripStage = 'not_started' | 'departed_school' | 'at_pickup' | 'students_boarded' | 'arrived_school';

export interface Trip {
  id: string;
  date: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  routeName: string;
  status: TripStage;
  departureTime?: string;
  atPickupTime?: string;
  boardedTime?: string;
  arrivalTime?: string;
  studentIds: string[];
  currentLocation?: {
    lat: number;
    lng: number;
    name: string;
  };
}

export interface TripHistoryItem {
  id: string;
  tripId: string;
  date: string;
  timeStr: string;
  driverName: string;
  vehiclePlate: string;
  action: string;
  stage: TripStage;
  location: string;
  notes?: string;
}

export interface WhatsAppNotification {
  id: string;
  timestamp: string;
  timeStr: string;
  targetPhone: string;
  targetName: string;
  studentName: string;
  stage: TripStage;
  message: string;
  status: 'sent' | 'simulated' | 'failed';
  error?: string;
}

export interface SystemSettings {
  schoolName: string;
  schoolSubtext: string;
  schoolAddress: string;
  fonnteApiToken: string;
  senderPhone: string;
  isSimulationMode: boolean;
  morningStart: string;
  morningEnd: string;
  templates: {
    departed: string;
    at_pickup: string;
    boarded: string;
    arrived: string;
  };
}

export interface DashboardStats {
  totalStudents: number;
  totalDrivers: number;
  totalVehicles: number;
  totalRoutes: number;
  todayTripsCount: number;
  delayedStudentsCount: number;
}
