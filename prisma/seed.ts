/**
 * Database Seed Script
 * Part of Soccer Team Management API
 * 
 * Seeds the database with initial data including normalized roles and permissions.
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

import { PrismaClient } from '@prisma/client';
import { generateId } from '../src/utils/id.js';
import { hashPassword } from '../src/validators/hash.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in reverse order of dependencies)
  await prisma.rolePermission.deleteMany({});
  await prisma.player.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleared existing data');

  // 1. Create Permissions (normalized from scopes)
  const permissions = await Promise.all([
    // Team Management Permissions
    prisma.permission.create({
      data: {
        id: generateId(),
        name: 'team:read',
        description: 'View team information',
        category: 'team'
      }
    }),
    prisma.permission.create({
      data: {
        id: generateId(),
        name: 'team:create',
        description: 'Create new teams',
        category: 'team'
      }
    }),
    prisma.permission.create({
      data: {
        id: generateId(),
        name: 'team:update',
        description: 'Update team information',
        category: 'team'
      }
    }),
    prisma.permission.create({
      data: {
        id: generateId(),
        name: 'team:delete',
        description: 'Delete teams',
        category: 'team'
      }
    }),
    
    // Player Management Permissions
    prisma.permission.create({
      data: {
        id: generateId(),
        name: 'player:read',
        description: 'View player information',
        category: 'player'
      }
    }),
    prisma.permission.create({
      data: {
        id: generateId(),
        name: 'player:create',
        description: 'Add new players',
        category: 'player'
      }
    }),
    prisma.permission.create({
      data: {
        id: generateId(),
        name: 'player:update',
        description: 'Update player information',
        category: 'player'
      }
    }),
    prisma.permission.create({
      data: {
        id: generateId(),
        name: 'player:delete',
        description: 'Remove players',
        category: 'player'
      }
    }),
    
    // Role Management Permissions
    prisma.permission.create({
      data: {
        id: generateId(),
        name: 'role:read',
        description: 'View roles and permissions',
        category: 'role'
      }
    }),
    prisma.permission.create({
      data: {
        id: generateId(),
        name: 'role:create',
        description: 'Create new roles',
        category: 'role'
      }
    }),
    
    // Admin Permissions
    prisma.permission.create({
      data: {
        id: generateId(),
        name: 'admin:all',
        description: 'Full administrative access',
        category: 'admin'
      }
    })
  ]);

  console.log(`✅ Created ${permissions.length} permissions`);

  // 2. Create Roles
  const teamManagerRole = await prisma.role.create({
    data: {
      id: generateId(),
      name: 'Team Manager',
      description: 'Full team management access'
    }
  });

  const headCoachRole = await prisma.role.create({
    data: {
      id: generateId(),
      name: 'Head Coach',
      description: 'Player and tactical management'
    }
  });

  const assistantCoachRole = await prisma.role.create({
    data: {
      id: generateId(),
      name: 'Assistant Coach',
      description: 'Training and player development'
    }
  });

  const teamCaptainRole = await prisma.role.create({
    data: {
      id: generateId(),
      name: 'Team Captain',
      description: 'Team leadership and communication'
    }
  });

  const playerRole = await prisma.role.create({
    data: {
      id: generateId(),
      name: 'Player',
      description: 'Basic team access'
    }
  });

  console.log('✅ Created roles');

  // 3. Assign Permissions to Roles
  const rolePermissionMappings = [
    // Team Manager - Full access
    { roleId: teamManagerRole.id, permissionName: 'team:read' },
    { roleId: teamManagerRole.id, permissionName: 'team:create' },
    { roleId: teamManagerRole.id, permissionName: 'team:update' },
    { roleId: teamManagerRole.id, permissionName: 'team:delete' },
    { roleId: teamManagerRole.id, permissionName: 'player:read' },
    { roleId: teamManagerRole.id, permissionName: 'player:create' },
    { roleId: teamManagerRole.id, permissionName: 'player:update' },
    { roleId: teamManagerRole.id, permissionName: 'player:delete' },
    { roleId: teamManagerRole.id, permissionName: 'role:read' },
    { roleId: teamManagerRole.id, permissionName: 'role:create' },
    
    // Head Coach - Team and player management
    { roleId: headCoachRole.id, permissionName: 'team:read' },
    { roleId: headCoachRole.id, permissionName: 'team:update' },
    { roleId: headCoachRole.id, permissionName: 'player:read' },
    { roleId: headCoachRole.id, permissionName: 'player:create' },
    { roleId: headCoachRole.id, permissionName: 'player:update' },
    { roleId: headCoachRole.id, permissionName: 'role:read' },
    
    // Assistant Coach - Limited player management
    { roleId: assistantCoachRole.id, permissionName: 'team:read' },
    { roleId: assistantCoachRole.id, permissionName: 'player:read' },
    { roleId: assistantCoachRole.id, permissionName: 'player:update' },
    { roleId: assistantCoachRole.id, permissionName: 'role:read' },
    
    // Team Captain - Read access and limited player updates
    { roleId: teamCaptainRole.id, permissionName: 'team:read' },
    { roleId: teamCaptainRole.id, permissionName: 'player:read' },
    { roleId: teamCaptainRole.id, permissionName: 'role:read' },
    
    // Player - Basic read access
    { roleId: playerRole.id, permissionName: 'team:read' },
    { roleId: playerRole.id, permissionName: 'player:read' },
    { roleId: playerRole.id, permissionName: 'role:read' }
  ];

  for (const mapping of rolePermissionMappings) {
    const permission = permissions.find(p => p.name === mapping.permissionName);
    if (permission) {
      // Check if mapping already exists to prevent duplicates
      const existing = await prisma.rolePermission.findFirst({
        where: {
          roleId: mapping.roleId,
          permissionId: permission.id
        }
      });
      
      if (!existing) {
        await prisma.rolePermission.create({
          data: {
            id: generateId(),
            roleId: mapping.roleId,
            permissionId: permission.id
          }
        });
      }
    } else {
      console.warn(`⚠️  Permission '${mapping.permissionName}' not found`);
    }
  }

  console.log(`✅ Created ${rolePermissionMappings.length} role-permission mappings`);

  // 4. Create Sample Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: generateId(),
        name: 'Alex Ferguson',
        email: 'alex.ferguson@example.com',
        password: await hashPassword('manager123'),
      }
    }),
    prisma.user.create({
      data: {
        id: generateId(),
        name: 'Pep Guardiola',
        email: 'pep.guardiola@example.com',
        password: await hashPassword('coach123'),
      }
    }),
    prisma.user.create({
      data: {
        id: generateId(),
        name: 'Lionel Messi',
        email: 'lionel.messi@example.com',
        password: await hashPassword('player123'),
      }
    }),
    prisma.user.create({
      data: {
        id: generateId(),
        name: 'Cristiano Ronaldo',
        email: 'cristiano.ronaldo@example.com',
        password: await hashPassword('player123'),
      }
    })
  ]);

  console.log(`✅ Created ${users.length} users`);

  // 5. Create Sample Teams
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        id: generateId(),
        name: 'Manchester United',
        location: 'Manchester, England',
        league: 'Premier League',
        founded: 1878,
        ownerId: users[0].id, // Alex Ferguson
      }
    }),
    prisma.team.create({
      data: {
        id: generateId(),
        name: 'Manchester City',
        location: 'Manchester, England',
        league: 'Premier League',
        founded: 1880,
        ownerId: users[1].id, // Pep Guardiola
      }
    })
  ]);

  console.log(`✅ Created ${teams.length} teams`);

  // 6. Create Sample Players
  const players = await Promise.all([
    prisma.player.create({
      data: {
        id: generateId(),
        teamId: teams[0].id, // Manchester United
        userId: users[2].id,  // Messi
        roleId: teamCaptainRole.id,
        position: 'Forward',
        jerseyNumber: 10,
      }
    }),
    prisma.player.create({
      data: {
        id: generateId(),
        teamId: teams[1].id, // Manchester City
        userId: users[3].id,  // Ronaldo
        roleId: playerRole.id,
        position: 'Forward',
        jerseyNumber: 7,
      }
    })
  ]);

  console.log(`✅ Created ${players.length} players`);

  console.log('🎉 Database seeded successfully!');
  
  // Display summary
  console.log('\n📊 Summary:');
  console.log(`- ${permissions.length} permissions created`);
  console.log(`- ${await prisma.role.count()} roles created`);
  console.log(`- ${rolePermissionMappings.length} role-permission mappings created`);
  console.log(`- ${users.length} users created`);
  console.log(`- ${teams.length} teams created`);
  console.log(`- ${players.length} players created`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
