import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './../styles/footer.scss';

export class Footer extends Component {
    static displayName = Footer.name;

  constructor (props) {
    super(props);
  }

  render() {
    return (
      <footer className='container mt-5'>
            © 2023 Daniel Pavíza
      </footer>
    );
  }
}
