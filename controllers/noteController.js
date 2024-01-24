const asyncHandler = require("express-async-handler");

const Note = require("../models/notemodel");
const User = require("../models/userModel");

// @desc Get notes
// @route GET /api/notes
// @access Private
const getNotes = asyncHandler(async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc Set notes
// @route POST /api/notes
// @access Private
const setNote = asyncHandler(async (req, res) => {
  try {
    if (!req.body.title || !req.body.note) {
      res.status(400);
      throw new Error("Please add both fields");
    }
    const note = await Note.create({
      title: req.body.title,
      note: req.body.note,
      user: req.user.id,
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc Get notes
// @route Get /api/notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      res.status(400);
      throw new Error("Note not found");
    }

    // const user = await User.findById(req.user.id);

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Make sure the logged in user matches the goal user
    if (note.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, note: req.body.note },
      {
        new: true,
      }
    );
    res.status(200).json(updatedNote);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc Get notes
// @route Get /api/notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(400);
      throw new Error("Note not found");
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Make sure the logged-in user matches the note user
    if (note.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    await note.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = {
  getNotes,
  setNote,
  updateNote,
  deleteNote,
};
