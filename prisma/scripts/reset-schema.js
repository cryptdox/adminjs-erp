import readline from 'node:readline/promises';
import { exec as execCallback } from 'node:child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promisify } from 'util';

const execAsync = promisify(execCallback);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

async function resetDatabase() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = (await rl.question(
    '⚠️  Are you sure you want to reset the database? Type "yes" to continue: '
  )).trim().toLowerCase();
  rl.close();

  if (answer !== 'yes') {
    console.log('❌ Reset cancelled.');
    await prisma.$disconnect();
    process.exit(0);
  }

  try {
    console.log('🔄 Dropping public schema...');
    await prisma.$executeRawUnsafe('DROP SCHEMA public CASCADE;');

    console.log('🆕 Recreating public schema...');
    await prisma.$executeRawUnsafe('CREATE SCHEMA public;');


    console.log('📦 Running prisma generate...');
    const { stdout_g, stderr_g } = await execAsync('npx prisma generate');
    if (stderr_g) {
      console.error('❌ Error pushing schema:', stderr_g);
      process.exit(1);
    }
    console.log('✅ Schema generated:\n', stdout_g);

    console.log('📦 Running prisma db push...');
    const { stdout, stderr } = await execAsync('npx prisma db push');
    if (stderr) {
      console.error('❌ Error pushing schema:', stderr);
      process.exit(1);
    }

    console.log('✅ Schema pushed:\n', stdout);
  } catch (err) {
    console.error('🔥 Reset failed:', err);
    console.error('======================================');
    console.error('❌ Please check the logs above for more details');
    console.error('======================================');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
