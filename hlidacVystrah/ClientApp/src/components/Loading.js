import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import './../styles/loading.scss';
import { Spinner } from './Spinner';

export class Loading extends Component {
    static displayName = Loading.name;

    constructor (props) {
        super(props);
    }

  render() {
    return (
        <div id='loading' className='d-flex justify-content-center align-items-center'>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <h1>Hlídač výstrah</h1>
                <img src='/images/logo.png' className='mb-4' />
                <div><Spinner /></div>
            </div>
        </div>
    );
  }
}
