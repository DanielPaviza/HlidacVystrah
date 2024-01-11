import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './../styles/navMenu.scss';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

    toggleNavbar () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    CloseDetail = () => {
        if (window.location.pathname == '/')
            return this.props.CloseDetail();
    }

    render() {

        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow" container light>
                    <NavbarBrand tag={Link} to="/" onClick={() => this.CloseDetail()} className='d-flex align-items-center p-0'>
                        <h1 className='m-0 me-2'>Hlídač výstrah</h1>
                        <img src='/images/logo.png' />
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                        <ul className="navbar-nav flex-grow">
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/" onClick={() => this.CloseDetail()}>Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/login">Přihlásit</NavLink>
                            </NavItem>
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}
