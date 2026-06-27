const sqlite3 = require('sqlite3').verbose(); 
const path = require('path'); 
const dbPath = path.resolve(__dirname, 'data', 'reviews.db'); 
console.log('dbPath', dbPath); 
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, err = 
    if (err) { console.error('open err', err); return; } 
    db.all('PRAGMA table_info(configurations)', (err, rows) = 
        console.log('schema err', err); 
        console.log('schema', JSON.stringify(rows, null, 2)); 
        db.all('SELECT * FROM configurations LIMIT 5', (err2, rows2) = 
            console.log('data err', err2); 
            console.log('data', JSON.stringify(rows2, null, 2)); 
            db.close(); 
        }); 
    }); 
}); 
