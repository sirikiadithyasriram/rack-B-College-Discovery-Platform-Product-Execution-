import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'prisma', 'dev.db'));

try {
  // Check if columns exist
  const columnCheck = db.prepare("PRAGMA table_info(College)").all();
  const hasExam = columnCheck.some(col => col.name === 'exam');
  const hasRank = columnCheck.some(col => col.name === 'rank');
  
  if (!hasExam) {
    db.exec('ALTER TABLE "College" ADD COLUMN "exam" TEXT NOT NULL DEFAULT "JEE"');
    console.log('Added exam column');
  }
  
  if (!hasRank) {
    db.exec('ALTER TABLE "College" ADD COLUMN "rank" INTEGER NOT NULL DEFAULT 1000');
    console.log('Added rank column');
  }
  
  console.log('Database schema updated successfully');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}
