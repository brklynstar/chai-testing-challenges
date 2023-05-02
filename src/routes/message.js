const express = require('express');
const router = express.Router();

const Message = require('../models/message');
const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json({ message: 'Messages retrieved successfully', data: messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:messageId', async (req, res) => {
  try {
    const message = await Message.findOne({ _id: req.params.messageId });
    res.json({ message: 'Message retrieved successfully', data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    let message = new Message(req.body);
    await message.save();

    const user = await User.findById(message.author);
    user.messages.unshift(message);
    await user.save();

    res.status(201).json({ message: 'Message created successfully', data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:messageId', async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.messageId, req.body);
    const updatedMessage = await Message.findOne({ _id: req.params.messageId });

    res.json({ message: 'Message updated successfully', data: updatedMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:messageId', async (req, res) => {
    try {
      const deletedMessage = await Message.findByIdAndDelete(req.params.messageId);
  
      if (!deletedMessage) {
        return res.status(404).json({ message: 'Message not found' });
      }
  
      const user = await User.findById(deletedMessage.author);
      user.messages = user.messages.filter(message => message.toString() !== req.params.messageId);
      await user.save();
  
      res.json({ message: 'Message deleted successfully', data: { _id: req.params.messageId } });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })

module.exports = router;