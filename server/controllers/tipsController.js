import axios from 'axios';
import mongoose from 'mongoose';

export const getDailyTip = async (req, res) => {
  try {
    const response = await axios.get('https://zenquotes.io/api/today');
    const tip = response.data[0]?.q + " — " + response.data[0]?.a;
    res.json({ tip });
  } catch (err) {
    console.error('Error fetching tip:', err.message);
    res.status(500).json({ error: 'Failed to fetch daily tip' });
  }
};