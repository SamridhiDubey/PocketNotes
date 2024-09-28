const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001; 

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://harshil233:harshil123@cluster0.qjkpbbz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

function generateDeviceIdentifier() {
    const randomString = Math.random().toString(36).substring(7);
    return `device_${randomString}`;
  }

const groupSchema = new mongoose.Schema({
    deviceIdentifier: String,
    name: String,
    initials: String,
    color: String,
  });
  
  const Group = mongoose.model('Group', groupSchema);
  
  app.post('/api/groups', async (req, res) => {
    const {name, initials, color } = req.body;
  
    try {
      const newGroup = new Group({ deviceIdentifier: generateDeviceIdentifier(),name, initials, color });
      await newGroup.save();
      res.status(201).json({ success: true, message: 'Group created successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
  
  app.get('/api/groups', async (req, res) => {
    try {
      const groups = await Group.find();
      res.status(200).json({ success: true, groups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
   

const chatMessageSchema = new mongoose.Schema({
  deviceIdentifier: String,
  groupId: String,
  text: String,
  date: String,
  time: String,
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

app.post('/api/messages', async (req, res) => {
  const { groupId, text, date, time } = req.body;
  try {
    const newMessage = new ChatMessage({ deviceIdentifier: generateDeviceIdentifier(),groupId, text, date, time });
    await newMessage.save();
    res.status(201).json({ success: true, message: 'Message saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.get('/api/messages/:groupId', async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const messages = await ChatMessage.find({ groupId });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
