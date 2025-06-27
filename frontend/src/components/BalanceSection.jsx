const BalanceSection = ({ gameData }) => (
  <div className="balance-section">
    <div className="balance-card">
      <h3>💰 Wallet</h3>
      <div className="amount">${gameData.balance}</div>
    </div>
    <div className="balance-card">
      <h3>🏦 Bank</h3>
      <div className="amount">${gameData.bankBalance}</div>
    </div>
    <div className="balance-card">
      <h3>🎯 Accuracy</h3>
      <div className="amount">{gameData.accuracy}</div>
    </div>
  </div>
);

export default BalanceSection;
    