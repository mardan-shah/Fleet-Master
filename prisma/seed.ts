import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  // 1. Clean up existing data (Order matters for foreign keys)
  console.log('Cleaning up database...')
  await prisma.fuelUpdate.deleteMany({})
  await prisma.ticket.deleteMany({})
  await prisma.driver.deleteMany({})
  await prisma.vehicle.deleteMany({})
  await prisma.user.deleteMany({})

  // 2. Create Default Admin User
  console.log('Creating users...')
  const hashedPassword = await bcrypt.hash('password123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fleetmaster.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'admin',
      company: 'FleetMaster HQ',
      avatar: '/uploads/placeholder-admin.jpg',
    },
  })

  // 3. Create Vehicles
  console.log('Creating vehicles...')
  const vehicles = [
    {
      name: 'TRK-001',
      type: 'Truck',
      year: 2022,
      make: 'Ford',
      model: 'F-150',
      manufacturer: 'Ford',
      image_urls: [],
      total_distance: 15400.5,
      total_fuel_cost: 3200.0,
      total_maintenance_cost: 450.0,
      created_by_id: admin.id,
    },
    {
      name: 'VAN-002',
      type: 'Van',
      year: 2021,
      make: 'Mercedes',
      model: 'Sprinter',
      manufacturer: 'Mercedes-Benz',
      image_urls: [],
      total_distance: 28900.0,
      total_fuel_cost: 5100.0,
      total_maintenance_cost: 1200.0,
      created_by_id: admin.id,
    },
    {
      name: 'SED-003',
      type: 'Sedan',
      year: 2023,
      make: 'Toyota',
      model: 'Camry',
      manufacturer: 'Toyota',
      image_urls: [],
      total_distance: 5200.2,
      total_fuel_cost: 850.5,
      total_maintenance_cost: 0.0,
      created_by_id: admin.id,
    },
    {
      name: 'TRK-004',
      type: 'Truck',
      year: 2020,
      make: 'Chevrolet',
      model: 'Silverado',
      manufacturer: 'Chevrolet',
      image_urls: [],
      total_distance: 45000.8,
      total_fuel_cost: 8900.0,
      total_maintenance_cost: 3500.0,
      created_by_id: admin.id,
    },
  ]

  for (const v of vehicles) {
    await prisma.vehicle.create({ data: v })
  }

  // 4. Create Drivers
  console.log('Creating drivers...')
  const drivers = [
    {
      name: 'John Doe',
      vehicle_name: 'TRK-001',
      license_number: 'L-12345678',
      license_expiry: new Date('2028-12-31'),
      social_security: 'SSN-999-00-1111',
      join_date: new Date('2022-01-15'),
      created_by_id: admin.id,
    },
    {
      name: 'Jane Smith',
      vehicle_name: 'VAN-002',
      license_number: 'L-87654321',
      license_expiry: new Date('2027-06-20'),
      social_security: 'SSN-888-00-2222',
      join_date: new Date('2021-05-10'),
      created_by_id: admin.id,
    },
    {
      name: 'Mike Johnson',
      vehicle_name: 'TRK-004',
      license_number: 'L-55556666',
      license_expiry: new Date('2026-03-15'),
      social_security: 'SSN-777-00-3333',
      join_date: new Date('2020-11-01'),
      created_by_id: admin.id,
    },
  ]

  for (const d of drivers) {
    await prisma.driver.create({ data: d })
  }

  // 5. Create Maintenance Tickets
  console.log('Creating tickets...')
  const tickets = [
    {
      vehicle_name: 'TRK-001',
      issue: 'Oil change and filter replacement',
      priority: 'Low',
      status: 'Completed',
      cost: 120.0,
      created_by_id: admin.id,
    },
    {
      vehicle_name: 'VAN-002',
      issue: 'Brake pad replacement and rotor resurfacing',
      priority: 'High',
      status: 'Completed',
      cost: 450.0,
      created_by_id: admin.id,
    },
    {
      vehicle_name: 'TRK-004',
      issue: 'Engine misfire investigation',
      priority: 'Medium',
      status: 'In Progress',
      cost: 800.0,
      created_by_id: admin.id,
    },
    {
      vehicle_name: 'TRK-001',
      issue: 'Tire rotation',
      priority: 'Low',
      status: 'Pending',
      cost: 50.0,
      created_by_id: admin.id,
    },
  ]

  for (const t of tickets) {
    await prisma.ticket.create({ data: t })
  }

  // 6. Create Fuel Updates
  console.log('Creating fuel updates...')
  const fuelUpdates = [
    {
      vehicle_name: 'TRK-001',
      quantity: 50.0,
      cost: 150.0,
      distance: 450.0,
      created_by_id: admin.id,
    },
    {
      vehicle_name: 'VAN-002',
      quantity: 40.0,
      cost: 120.0,
      distance: 380.0,
      created_by_id: admin.id,
    },
    {
      vehicle_name: 'TRK-004',
      quantity: 100.0,
      cost: 300.0,
      distance: 600.0,
      created_by_id: admin.id,
    },
    {
      vehicle_name: 'SED-003',
      quantity: 30.0,
      cost: 90.0,
      distance: 500.0,
      created_by_id: admin.id,
    },
  ]

  for (const f of fuelUpdates) {
    await prisma.fuelUpdate.create({ data: f })
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
