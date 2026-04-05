export interface User {
  id: string;
  email: string;
  password?: string;
  name?: string;
  role?: string;
  avatar?: string;
  company?: string;
  phone?: string | null;
  bio?: string | null;
  location?: string | null;
  department?: string | null;
  employee_id?: string | null;
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  year: number;
  make?: string | null;
  model: string;
  manufacturer: string;
  image_url?: string | null;
  created_by_id: string;
  total_maintenance_cost: number;
  total_fuel_cost: number;
  total_distance: number;
}

export interface Ticket {
  id: string;
  vehicle_name: string;
  issue: string;
  priority: string;
  status: string;
  cost: number;
  created_by_id: string;
  created_at: Date;
}

export interface FuelUpdate {
  id: string;
  vehicle_name: string;
  quantity: number;
  cost: number;
  distance: number;
  created_by_id: string;
  created_at: Date;
}

export interface Driver {
  id: string;
  name: string;
  vehicle_name?: string | null;
  license_number: string;
  license_expiry: Date;
  social_security: string;
  join_date: Date;
  image_url?: string | null;
  created_by_id: string;
}

// In-memory static data
export const mockDb = {
  users: [
    { 
      id: "user-1", 
      email: "admin@example.com", 
      password: "password", 
      name: "Admin User", 
      role: "admin", 
      company: "MyCompany",
      phone: "+1 234 567 8900",
      bio: "Fleet administrator",
      location: "HQ",
      department: "Logistics",
      employee_id: "EMP-001"
    }
  ] as User[],
  vehicles: [
    {
      id: "v-1", name: "Truck A", type: "truck", year: 2020, make: "Volvo", model: "FH16", manufacturer: "Volvo",
      created_by_id: "user-1", total_maintenance_cost: 0, total_fuel_cost: 0, total_distance: 0
    },
    {
      id: "v-2", name: "Van B", type: "van", year: 2022, make: "Ford", model: "Transit", manufacturer: "Ford",
      created_by_id: "user-1", total_maintenance_cost: 150, total_fuel_cost: 300, total_distance: 5000
    }
  ] as Vehicle[],
  tickets: [
    {
      id: "t-1", vehicle_name: "Van B", issue: "Oil Change", priority: "low", status: "completed", cost: 150, created_by_id: "user-1", created_at: new Date()
    }
  ] as Ticket[],
  fuelUpdates: [
    {
      id: "f-1", vehicle_name: "Van B", quantity: 50, cost: 300, distance: 5000, created_by_id: "user-1", created_at: new Date()
    }
  ] as FuelUpdate[],
  drivers: [
    {
      id: "d-1", name: "John Doe", license_number: "DL12345", license_expiry: new Date("2026-05-10"), social_security: "000-00-0000", join_date: new Date("2023-01-15"), created_by_id: "user-1"
    }
  ] as Driver[]
};
