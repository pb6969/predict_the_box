const Header = ({ onLogout }) => (
  <div className="header">
    <h1>🎮 Box Guessing Game</h1>
    <button onClick={onLogout} className="btn-logout">Logout</button>
  </div>
);

export default Header;
