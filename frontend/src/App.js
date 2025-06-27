
import React, { useState, useEffect } from 'react';
import './App.css';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import TransferSection from './components/TransferSection';
import BalanceSection from './components/BalanceSection';
import GameSection from './components/GameSection';
import HistorySection from './components/HistorySection';
import { fetchUserData, playGameAPI, clearGameHistory, transferFunds } from './api/api';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [gameData, setGameData] = useState({ balance: 0, bankBalance: 0, history: [], accuracy: '0%' });
  const [gameResult, setGameResult] = useState(null);
  const [showBoxes, setShowBoxes] = useState(false);
  const [bid, setBid] = useState(5);

  useEffect(() => {
    if (token) getUserData();
  }, [token]);

  const getUserData = async () => {
    try {
      const data = await fetchUserData(token);
      setGameData(data);
    } catch {
      setToken(null);
      setUser(null);
    }
  };

  const handleTransfer = async (type, amount) => {
    try {
      const data = await transferFunds(type, amount, token);
      setGameData(prev => ({ ...prev, ...data }));
    } catch (err) {
      alert(err.message);
    }
  };

  const playGame = async (choice) => {
    if (!bid || bid <= 0) return alert('Enter a valid bid amount');
    setShowBoxes(true);
    try {
      const result = await playGameAPI(choice, bid, token);
      setGameResult(result);
      setGameData(prev => ({ ...prev, balance: result.balance, accuracy: result.accuracy }));
      getUserData();
    } catch (err) {
      alert(err.message);
    }
    setTimeout(() => {
      setShowBoxes(false);
      setGameResult(null);
    }, 2000);
  };

  const clearHistory = async () => {
    try {
      await clearGameHistory(token);
      getUserData();
    } catch {
      alert('Failed to clear history');
    }
  };

  if (!token) {
    return <AuthForm setToken={setToken} setUser={setUser} />;
  }

  return (
    <div className="container">
      <div className="game-card">
        <Header onLogout={() => { setToken(null); setUser(null); }} />
        <TransferSection handleTransfer={handleTransfer} />
        <BalanceSection gameData={gameData} />
        <GameSection bid={bid} setBid={setBid} playGame={playGame} gameResult={gameResult} showBoxes={showBoxes} />
        <HistorySection history={gameData.history} clearHistory={clearHistory} />
      </div>
    </div>
  );
}

export default App;
