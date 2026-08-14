import React from 'react';

import { Link, NavLink } from 'react-router-dom';

import './Footer.css';

import AteaTampaFooter from "../assets/AteaTampaFooter.png";
 
const Footer = () => {
  return (
        <footer className='site-footer'>
                <div className='content'>
 
                    <div className="logofooter">
                        <NavLink to="/"> 
                            <img src={AteaTampaFooter} alt="logotipo" />
                        </NavLink>
                    </div>
 
                    <div className="e-mail">
                        <p><strong>E-Mail:</strong><br />contatoateatampa@gmail.com</p>
                    </div>
 
                    <div className="number">
                        <p><strong>Contato</strong><br />(11) 97717-8338</p>
                    </div>
 
                    <div className="socials">
                        <p><strong>Instagram:</strong><br /> @ate_a_tampa</p>
                    </div>
 
                    <div className="icons">
                        <i className='fab fa-whatsapp'></i>
                        <i className='fab fa-instagram'></i>
                        <i className='fab fa-facebook'></i>
                    </div>
                </div>
        </footer>
 
  )
}
 
export default Footer;