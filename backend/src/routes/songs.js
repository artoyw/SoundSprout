const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

// Get all songs
router.get('/', songController.getAllSongs);

// Get a single song
router.get('/:id', songController.getSongById);

// Create a new song
router.post('/', songController.createSong);

// Update a song
router.put('/:id', songController.updateSong);

// Delete a song
router.delete('/:id', songController.deleteSong);

module.exports = router; 