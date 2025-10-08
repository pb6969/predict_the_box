import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  balance: { type: Number, default: 0 },
  bankBalance: { type: Number, default: 100 },
  history: [],
});

const User = mongoose.model('User', userSchema);

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};


app.post('/api/auth/signup', async (req, res) => {
  const { username, password, bankBalance } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ success: false, message: 'Username already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed, bankBalance });
  await user.save();
  res.json({ success: true });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ success: true, token });
});


app.get('/api/user/info', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  const wins = user.history.filter(g => g.result === 'win').length;
  const accuracy = user.history.length ? ((wins / user.history.length) * 100).toFixed(2) + '%' : '0%';
  res.json({
    balance: user.balance,
    bankBalance: user.bankBalance,
    history: user.history.slice().reverse(),
    accuracy
  });
});

app.post('/api/user/deposit', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.userId);
  if (user.bankBalance < amount) return res.status(400).json({ success: false, message: 'Insufficient bank balance' });
  user.bankBalance -= amount;
  user.balance += amount;
  await user.save();
  res.json({ success: true, balance: user.balance, bankBalance: user.bankBalance });
});

app.post('/api/user/withdraw', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.userId);
  if (user.balance < amount) return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
  user.balance -= amount;
  user.bankBalance += amount;
  await user.save();
  res.json({ success: true, balance: user.balance, bankBalance: user.bankBalance });
});

app.post('/api/game/play', authMiddleware, async (req, res) => {
  const { userChoice, bid } = req.body;
  const user = await User.findById(req.userId);

  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.balance < bid) return res.status(400).json({ success: false, message: 'Insufficient balance' });

  const history = user.history || [];
  const totalGames = history.length;

  
  let recentLosses = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].result === 'lose') recentLosses++;
    else break;
  }

  
  let winChance;
  const userBias = user._id.toString().charCodeAt(0) % 30 / 100; // 0%–30%

  if (totalGames < 3) {
    winChance = 0.5 + userBias; // 50–80%
  } else if (totalGames < 5) {
    winChance = 0.4 + userBias; // 40–70%
  } else if (totalGames < 10) {
    winChance = 0.25 + userBias; // 25–55%
  } else {
    winChance = 0.15 + userBias; // 15–45%
  }

  // loss is more than 3 so gift from my side
  if (recentLosses >= 3) {
    winChance += 0.25; // 25% 
  }

  const shouldWin = Math.random() < Math.min(winChance, 0.99); 


    const winningBox = shouldWin ? userChoice : [0, 1, 2].filter(i => i !== userChoice)[Math.floor(Math.random() * 2)];

  const result = userChoice === winningBox ? 'win' : 'lose';
  const amount = result === 'win' ? bid * 2 : -bid;

  user.balance += result === 'win' ? bid*2 : -bid;

  
  user.history.push({ userChoice, winningBox, result, amount });
  await user.save();

  
  const wins = user.history.filter(g => g.result === 'win').length;
  const accuracy = user.history.length ? ((wins / user.history.length) * 100).toFixed(2) + '%' : '0%';

  res.json({
    success: true,
    result,
    winningBox,
    amount,
    balance: user.balance,
    accuracy
  });
});




app.delete('/api/game/history', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  user.history = [];
  await user.save();
  res.json({ success: true });
});

app.listen(5000, () => console.log('Server running on port 5000'));




