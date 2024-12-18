import { BsArrowLeftShort } from 'react-icons/bs'
import { ImExit } from 'react-icons/im';
import { NavLink } from 'react-router-dom';
import menuItem from '../Data/Navdata';
import { useState } from 'react';

function Sidebar({ children, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="container">
        <div className="sidebar" style={{ width: isOpen ? "250px" : "50px" }}>
          <div className="top-section">
            <h1 className="logo" style={{ display: isOpen ? "block" : "none" }}>GeoBrinco</h1>
            <div className="arrow" style={{ marginLeft: isOpen ? "50px" : "0px" }}>
              <BsArrowLeftShort onClick={() => setIsOpen(!isOpen)} style={{ transform: !isOpen && "rotate(180deg)" }} />
            </div>
          </div>
          {
            menuItem.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className={({ isActive }) => isActive ? "link active" : "link"}
              >
                <div className="icon">{item.icon}</div>
                <div
                  className="link-text"
                  style={{ display: isOpen ? "block" : "none" }}
                >
                  {item.name}
                </div>
              </NavLink>
            ))
          }
          <div className={`bottom-section ${isOpen ? "centered" : ""}`}>
            <div className={`door ${isOpen ? "door-open" : "door-closed"}`}>
              {isOpen && <h1 className="door-text">Sair</h1>}
              <ImExit className="door-icon" onClick={onLogout} /> {/* Chama a função passada por prop */}
            </div>
          </div>
        </div>
        <main>
          {children}
        </main>
      </div>
    );
  }
  
export default Sidebar;
