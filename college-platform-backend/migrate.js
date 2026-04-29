const fs = require('fs');
const path = require('path');
const sqlite3 = require('better-sqlite3');

// Connect to database
const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new sqlite3(dbPath);

// Run migrations
try {
  // Add exam and rank columns to College table
  db.exec(`ALTER TABLE "College" ADD COLUMN "exam" TEXT NOT NULL DEFAULT 'JEE';`);
  db.exec(`ALTER TABLE "College" ADD COLUMN "rank" INTEGER NOT NULL DEFAULT 1000;`);
  
  console.log('Migration completed successfully');
} catch (error) {
  if (error.message.includes('duplicate column')) {
    console.log('Columns already exist, skipping migration');
  } else {
    console.error('Migration error:', error.message);
    process.exit(1);
  }
}

db.close();
