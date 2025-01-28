const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(":memory:");

/**
 * Initializes the database with a table and some initial data
 * @returns {void}
 */
function initialize() {
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS SweFinPairs (id INTEGER PRIMARY KEY AUTOINCREMENT, finnish VARCHAR(255), swedish VARCHAR(255))', (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Table created');
        // Add some initial data
        db.run('INSERT INTO SweFinPairs (finnish, swedish) VALUES (?, ?)', ['kissa', 'katt']);
        db.run('INSERT INTO SweFinPairs (finnish, swedish) VALUES (?, ?)', ['koira', 'hund']);
        db.run('INSERT INTO SweFinPairs (finnish, swedish) VALUES (?, ?)', ['hevonen', 'häst']);
        db.run('INSERT INTO SweFinPairs (finnish, swedish) VALUES (?, ?)', ['lehmä', 'ko']);
        db.run('INSERT INTO SweFinPairs (finnish, swedish) VALUES (?, ?)', ['sika', 'gris']);
        db.run('INSERT INTO SweFinPairs (finnish, swedish) VALUES (?, ?)', ['lammas', 'får']);
        db.run('INSERT INTO SweFinPairs (finnish, swedish) VALUES (?, ?)', ['vuohi', 'get']);
        db.run('INSERT INTO SweFinPairs (finnish, swedish) VALUES (?, ?)', ['kana', 'höna']);
        db.run('INSERT INTO SweFinPairs (finnish, swedish) VALUES (?, ?)', ['ankka', 'anka']);
        db.run('INSERT INTO SweFinPairs (finnish, swedish) VALUES (?, ?)', ['kalkkuna', 'kalkon']);
        initialized = true;
      }
    });
  });
}

/**
 * Saves a new word pair to the database
 * @param {string} fin_word Finnish word
 * @param {string} swe_word swedish word
 * @returns {Promise<void>}
 * @throws {Error} If the database operation fails
 * @throws {Error} If no data is provided
 */
function save(fin_word, swe_word) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO SweFinPairs (finnish, swedish) VALUES (?, ?)', [fin_word, swe_word], (err) => {
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
 * @returns {Promise<{id: number, finnish: string, swedish: string}>}
 */
function get(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM SweFinPairs WHERE id = ?', [id], (err, row) => {
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
 * @returns {Promise<{id: number, finnish: string, swedish: string}[]>}
 * @throws {Error} If the database operation fails
 * @throws {Error} If no data is provided
 */
function getAll() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM SweFinPairs', (err, rows) => {
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
 * @param {string} swe_word swedish word
 * @returns {Promise<void>}
 * @throws {Error} If the database operation fails
 * @throws {Error} If no data is provided
 */
function update(id, fin_word, swe_word) {
  return new Promise((resolve, reject) => {
    if (!fin_word && !swe_word) {
      reject({ error: 'No data provided', status: 400 });
    }
    if (!fin_word) {
      db.run('UPDATE SweFinPairs SET swedish = ? WHERE id = ?', [swe_word, id], function (err) {
        if (this.changes === 0) {
          reject({ error: 'No word pair found with the provided ID', status: 404 });
        }
        if (err) {
          reject({ error: err.message, status: 500 });
        } else {
          resolve();
        }
      });
    } else if (!swe_word) {
      db.run('UPDATE SweFinPairs SET finnish = ? WHERE id = ?', [fin_word, id], function (err) {
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
      db.run('UPDATE SweFinPairs SET finnish = ?, swedish = ? WHERE id = ?', [fin_word, swe_word, id], function (err) {
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
    db.run('DELETE FROM SweFinPairs WHERE id = ?', [id], function (err) {
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