import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const managerPassword = await bcrypt.hash('manager123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@tooltrack.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@tooltrack.com',
      password: managerPassword,
      role: 'MANAGER',
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@tooltrack.com',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create locations
  const mainLocation = await prisma.location.create({
    data: {
      name: 'Main Warehouse',
      address: '123 Industrial Ave, Factory City, FC 12345',
    },
  });

  const site2 = await prisma.location.create({
    data: {
      name: 'Site 2 Office',
      address: '456 Business Blvd, Office Park, OP 67890',
    },
  });

  // Create tools
  const drill = await prisma.tool.create({
    data: {
      name: 'Power Drill',
      description: 'Heavy-duty power drill for construction',
      serialNumber: 'DRILL-2024-001',
      status: 'AVAILABLE',
      currentLocationId: mainLocation.id,
    },
  });

  const saw = await prisma.tool.create({
    data: {
      name: 'Circular Saw',
      description: 'Professional circular saw',
      serialNumber: 'SAW-2024-001',
      status: 'AVAILABLE',
      currentLocationId: mainLocation.id,
    },
  });

  const hammer = await prisma.tool.create({
    data: {
      name: 'Claw Hammer',
      description: 'Standard claw hammer',
      serialNumber: 'HAMMER-2024-001',
      status: 'CHECKED_OUT',
      currentLocationId: mainLocation.id,
      assignedUserId: user.id,
    },
  });

  // Create transactions
  await prisma.transaction.create({
    data: {
      toolId: hammer.id,
      userId: user.id,
      locationId: mainLocation.id,
      checkoutTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      notes: 'Tool checked out for job site work',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\nTest credentials:');
  console.log('Admin: admin@tooltrack.com / admin123');
  console.log('Manager: manager@tooltrack.com / manager123');
  console.log('User: user@tooltrack.com / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
