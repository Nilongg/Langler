const express = require('express');
const router = express.Router();
const db = require('./engDb');

router.get('/', async (req, res) => {
  try {
    const rows = await db.getAll();
    console.log("Rows", rows);
    res.json(rows);
  } catch (err) {
    res.status(err.error).json({ error: err.error });
  }
})


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await db.get(id);
    if (!rows) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(rows);
  } catch (err) {
    res.status(err.status).json({ error: err.error });
  }
})

router.post('/', async (req, res) => {
  const { finnish, english } = req.body;
  try {
    await db.save(finnish, english);
    res.status(201).end();
  } catch (err) {
    res.status(err.status).json({ error: err.error });
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { finnish, english } = req.body;
  if (!finnish && !english) {
    res.status(400).json({ error: 'No data provided' });
    return;
  }
  try {
    await db.update(id, finnish, english);
    res.status(200).end();
  } catch (err) {
    res.status(err.status).json({ error: err.error });
  }
})

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { finnish, english } = req.body;
  if (parseInt(id) === NaN) {
    res.status(400).json({ error: 'Invalid id' });
    return
  }

  if (!finnish && !english) {
    res.status(400).json({ error: 'No data provided' });
    return;
  }
  try {
    if (!finnish) {
      console.log("Updating english")
      await db.update(id, null, english);
    } else {
      console.log("Updating finnish")
      await db.update(id, finnish, null);
    }
    res.status(200).end();
  } catch (err) {
    console.log("Error", err);
    res.status(err.status).json({ error: err.error });
  }
  return;
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.deletePair(id);
    res.status(200).end();
  } catch (err) {
    res.status(err.status).json({ error: err.error });
  }
})

module.exports = router;