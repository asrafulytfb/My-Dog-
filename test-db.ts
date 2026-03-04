import Database from 'better-sqlite3';
try {
  const db = new Database(':memory:');
  console.log('better-sqlite3 is working!');
  db.exec('CREATE TABLE test (id INTEGER PRIMARY KEY)');
  console.log('Table created!');
} catch (err) {
  console.error('better-sqlite3 failed:', err);
  process.exit(1);
}
