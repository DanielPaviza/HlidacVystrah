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
      <footer>
            © 2023 Daniel Pavíza
      </footer>
    );
  }
}
