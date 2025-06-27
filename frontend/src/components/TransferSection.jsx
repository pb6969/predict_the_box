const TransferSection = ({ handleTransfer }) => (
  <div className="transfer-section">
    <div className="transfer-group">
      <h4>Deposit to Wallet</h4>
      <input type="number" id="depositAmount" placeholder="Amount" />
      <button onClick={() => handleTransfer('deposit', document.getElementById('depositAmount').value)} className="btn-primary">Deposit</button>
    </div>
    <div className="transfer-group">
      <h4>Withdraw to Bank</h4>
      <input type="number" id="withdrawAmount" placeholder="Amount" />
      <button onClick={() => handleTransfer('withdraw', document.getElementById('withdrawAmount').value)} className="btn-primary">Withdraw</button>
    </div>
  </div>
);

export default TransferSection;
