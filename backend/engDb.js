const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(":memory:");

/**
 * Initializes the database with a table and some initial data
 * @returns {void}
 */
function initialize() {
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS EngFinPairs (id INTEGER PRIMARY KEY AUTOINCREMENT, finnish VARCHAR(255), english VARCHAR(255))', (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Table created');
        // Add some initial data
        db.run('INSERT INTO EngFinPairs (finnish, english) VALUES (?, ?)', ['kissa', 'cat']);
        db.run('INSERT INTO EngFinPairs (finnish, english) VALUES (?, ?)', ['koira', 'dog']);
        db.run('INSERT INTO EngFinPairs (finnish, english) VALUES (?, ?)', ['hevonen', 'horse']);
        db.run('INSERT INTO EngFinPairs (finnish, english) VALUES (?, ?)', ['lehmä', 'cow']);
        db.run('INSERT INTO EngFinPairs (finnish, english) VALUES (?, ?)', ['sika', 'pig']);
        db.run('INSERT INTO EngFinPairs (finnish, english) VALUES (?, ?)', ['lammas', 'sheep']);
        db.run('INSERT INTO EngFinPairs (finnish, english) VALUES (?, ?)', ['vuohi', 'goat']);
        db.run('INSERT INTO EngFinPairs (finnish, english) VALUES (?, ?)', ['kana', 'chicken']);
        db.run('INSERT INTO EngFinPairs (finnish, english) VALUES (?, ?)', ['ankka', 'duck']);
        db.run('INSERT INTO EngFinPairs (finnish, english) VALUES (?, ?)', ['kalkkuna', 'turkey']);
        initialized = true;
      }
    });
  });
}

/**
 * Saves a new word pair to the database
 * @param {string} fin_word Finnish word
 * @param {string} eng_word English word
 * @returns {Promise<void>}
 * @throws {Error} If the database operation fails
 * @throws {Error} If no data is provided
 */
function save(fin_word, eng_word) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO EngFinPairs (finnish, english) VALUES (?, ?)', [fin_word, eng_word], (err) => {
      if (err) {
        reject({ error: err.message, status: 500 });
      } else {
        resolve();
      }
    });
  });
}

/**
 * Retrieves a word pair from the database by its ID
 * @param {number} id Word pair ID
 * @returns {Promise<{id: number, finnish: string, english: string}>}
 */
function get(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM EngFinPairs WHERE id = ?', [id], (err, row) => {
      if (!row) {
        reject({ error: 'No word pair found with the provided ID', status: 404 });
      }
      if (err) {
        reject({ error: err.message, status: 500 });
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * Retrieves all word pairs from the database
 * @returns {Promise<{id: number, finnish: string, english: string}[]>}
 * @throws { Error } If the database operation fails
 * @throws { Error } If no data is provided
*/
function getAll() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM EngFinPairs', (err, rows) => {
      if (rows.length === 0) {
        reject({ error: 'No word pairs found', status: 404 });
      }
      if (err) {
        reject({ error: err.message, status: 500 });
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Updates a word pair in the database
 * @param {number} id Word pair ID
 * @param {string} fin_word Finnish word
 * @param {string} eng_word English word
 * @returns {Promise<void>}
 * @throws {Error} If the database operation fails
 * @throws {Error} If no data is provided
 */
function update(id, fin_word, eng_word) {
  return new Promise((resolve, reject) => {
    if (!fin_word && !eng_word) {
      reject({ error: 'No data provided', status: 400 });
    }
    if (!fin_word) {
      db.run('UPDATE EngFinPairs SET english = ? WHERE id = ?', [eng_word, id], function (err) {
        if (this.changes === 0) {
          reject({ error: 'No word pair found with the provided ID', status: 404 });
        }
        if (err) {
          reject({ error: err.message, status: 500 });
        } else {
          resolve();
        }
      });
    } else if (!eng_word) {
      db.run('UPDATE EngFinPairs SET finnish = ? WHERE id = ?', [fin_word, id], function (err) {
        if (this.changes === 0) {
          reject({ error: 'No word pair found with the provided ID', status: 404 });
        }
        if (err) {
          reject({ error: err.message, status: 500 });
        } else {
          resolve();
        }
      });
    } else {
      db.run('UPDATE EngFinPairs SET finnish = ?, english = ? WHERE id = ?', [fin_word, eng_word, id], function (err) {
        if (this.changes === 0) {
          reject({ error: 'No word pair found with the provided ID', status: 404 });
        }
        if (err) {
          reject({ error: err.message, status: 500 });
        } else {
          resolve();
        }
      });
    }
  });
}

/**
 * Deletes a word pair from the database
 * @param {number} id Word pair ID
 * @returns {Promise<void>}
 * @throws {Error} If the database operation fails
 */
function deletePair(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM EngFinPairs WHERE id = ?', [id], function (err) {
      if (this.changes === 0) {
        reject({ error: 'No word pair found with the provided ID', status: 404 });
      }
      if (err) {
        reject({ error: err.message, status: 500 });
      } else {
        resolve();
      }
    });
  });
}

initialize();

module.exports = { save, getAll, update, deletePair, get };