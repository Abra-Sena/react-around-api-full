import React from 'react';
import { Link } from 'react-router-dom'
import headerLogo from '../images/header_logo.svg';

function Header(props) {
  return(
    <header className="header">
      <img src={headerLogo} alt="header-logo" className="logo" />
      <div className="header__content">
        <p className="header__paragraph">{props.email}</p>
        <Link className="header__link" to={props.link}>
          <span onClick={props.onClick}>{props.linkText}</span>
        </Link>
      </div>
    </header>
  )
}

export default Header;
