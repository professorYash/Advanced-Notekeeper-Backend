const asyncHandler = require("express-async-handler");

const Note = require("../models/notemodel");
const User = require("../models/userModel");

// @desc Get notes
// @route GET /api/notes
// @access Private
const getNotes = asyncHandler(async (req, res) => {
  /*
  res.status(200).json({ message: "Get notes" });
  */
  const notes = await Note.find({ user: req.user.id });
  res.status(200).json(notes);
});

// @desc Set notes
// @route POST /api/notes
// @access Private
const setNote = asyncHandler(async (req, res) => {
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
});

// @desc Get notes
// @route Get /api/notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  /*
  res.status(200).json({ message: `Updated Note ${req.params.id}` });
  */

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
});

// @desc Get notes
// @route Get /api/notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  /*
  res.status(200).json({ message: `Delete goal ${req.params.id}` });
  */

  const note = await Note.findById(req.params.id);
  if (!note) {
    res.status(400);
    throw new Error("Goal not found");
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

  await note.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getNotes,
  setNote,
  updateNote,
  deleteNote,
};
