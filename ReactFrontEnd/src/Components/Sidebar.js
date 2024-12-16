import { BsArrowLeftShort } from 'react-icons/bs'
import { NavLink } from 'react-router-dom';
import menuItem from '../Data/Navdata';
import { useState } from 'react';

function Sidebar({children}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="container">
            <div className="sidebar" style={{width: isOpen ? "250px" : "50px"}}>
                <div className="top-section">
                    <h1 className="logo" style={{display: isOpen ? "block" : "none"}}>Sidebar</h1>
                    <div className="arrow" style={{marginLeft: isOpen ? "50px" : "0px"}}>
                        <BsArrowLeftShort onClick={() => setIsOpen(!isOpen)} style={{transform: !isOpen && "rotate(180deg)"}}/>
                    </div>
                </div>
                {
                    menuItem.map((item, index) => (
                        (
                            <NavLink to={item.path} key={index} className="link" activeclassName="active">
                                <div className='icon'>{item.icon}</div>
                                <div className="link-text" style={{display: isOpen ? "block" : "none"}}>{item.name}</div>
                            </NavLink>
                        )
                    ))
                }
            </div>
            <main>
                {children}
            </main>
        </div>
    );
}

export default Sidebar;