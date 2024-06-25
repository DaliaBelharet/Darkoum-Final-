import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import logo from "../assets/DARKOUM.png";
import Modal from '../components/Modal'; 
import LoginIcon from '@mui/icons-material/Login';

const NavbarLP = () => {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const navbarItems = [
        {link:"Accueil", path:"home"},
        {link:"Services", path:"srvc"},
        {link:"A propos", path:"about"}
    ]

    return (
        <nav style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '80px', 
            backgroundColor: 'white',
            color: 'black',
            padding: '10px 20px', 
            zIndex: 1000,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
        }}>
            <Link to="/home">
                <img src={logo} alt="Logo" style={{ marginRight: 20, width: 100, marginTop: 0 }} />
            </Link>
            <ul style={{ 
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                {navbarItems.map(({link,path}) => <Link to={path} spy={true} offset={-100} key={path}>
                    {link}
                </Link>)}
            </ul>
            
        
            <button className="login-btn" style={{ 
                backgroundColor: '#F27438',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: 5,
                cursor: 'pointer',
                fontWeight: 'bold'
            }} onClick={openModal}>Se connecter
            <LoginIcon style={{marginLeft:"5px"}}/>
            </button>

        

            {/* Modal */}
            {showModal && (
                <Modal onClose={closeModal} backgroundColor="#F27438">
                    <h2 style={{ color: 'white' }}>Se connecter en tant qu'admin ou utilisateur</h2>
                 
                </Modal>
            )}
        </nav>
    );
}

export default NavbarLP;
