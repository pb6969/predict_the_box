const GameSection = ({ bid, setBid, playGame, gameResult, showBoxes }) => (
  <div className="game-section">
    <h3>Choose a Box (Win: +2×Bid, Lose: -Bid)</h3>
    <input type="number" value={bid} onChange={(e) => setBid(Number(e.target.value))} placeholder="Enter Bid" className="bid-input" />
    <div className="boxes">
      {[0, 1, 2].map(index => (
        <div key={index}
          className={`box ${showBoxes && gameResult?.winningBox === index ? 'winner' : showBoxes ? 'loser' : ''}`}
          onClick={() => !showBoxes && playGame(index)}
        >
          📦
        </div>
      ))}
    </div>
    {gameResult && (
      <div className={`result ${gameResult.result}`}>
        {gameResult.result === 'win'
          ? `🎉 You Won! +$${gameResult.amount}`
          : `😞 You Lost! $${Math.abs(gameResult.amount)}`}
      </div>
    )}
  </div>
);

export default GameSection;
