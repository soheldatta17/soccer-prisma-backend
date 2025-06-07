import { PrismaClient } from '@prisma/client';
import { generateId } from '../src/utils/id';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    'Team Manager',
    'Head Coach',
    'Assistant Coach',
    'Team Captain',
    'Player'
  ];

  for (const name of roles) {
    const existing = await prisma.role.findFirst({ where: { name } });
    if (!existing) {
      await prisma.role.create({
        data: {
          id: generateId(),
          name,
          scopes: getScopes(name),
        },
      });
      console.log(`Created role: ${name}`);
    } else {
      console.log(`Role already exists: ${name}`);
    }
  }
}

function getScopes(role: string): string[] {
  switch (role) {
    case 'Team Manager':
      return ['manage_team', 'manage_players', 'manage_staff', 'view_finances'];
    case 'Head Coach':
      return ['manage_players', 'manage_training', 'manage_tactics'];
    case 'Assistant Coach':
      return ['view_players', 'manage_training'];
    case 'Team Captain':
      return ['view_team', 'view_tactics'];
    case 'Player':
      return ['view_team'];
    default:
      return [];
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
