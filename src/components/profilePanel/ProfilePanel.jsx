import "./profilePanel.css";

export default function ProfilePanel({ myStorage, setCurrentUser }) {
  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div className="profilePanel">
      <button className="btnPrimary" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}
