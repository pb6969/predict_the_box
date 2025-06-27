const HistorySection = ({ history, clearHistory }) => (
  <div className="history-section">
    <div className="history-header">
      <h3>📊 Game History</h3>
      <button onClick={clearHistory} className="btn-danger">Clear History</button>
    </div>
    <div className="history">
      {history.map((game, i) => (
        <div key={i} className="history-item">
          <span>Box {game.userChoice} vs {game.winningBox}</span>
          <span className={game.result}>
            {game.result === 'win' ? `+$${game.amount}` : `$${game.amount}`}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default HistorySection;
    