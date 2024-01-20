import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import './../styles/footer.scss';

export class Footer extends Component {
    static displayName = Footer.name;

    constructor (props) {
        super(props);
    }

  render() {
    return (
    <footer className={`${this.props.background} pt-4`}>
        <div className='container pt-4 pb-3 d-flex flex-column'>
            <span className='copyright mb-1 fw-bold'>© 2023 Daniel Pavíza</span>
            <a href="https://www.flaticon.com/free-icons/eye" rel='nofollow' title="eye icons" target='_blank'>Eye icons created by Gregor Cresnar - Flaticon</a>
            <a href="https://www.chmi.cz/files/portal/docs/meteo/om/bulletiny/XOCZ50_OKPR.xml" rel="nofollow" title="Zdroj meterologických dat" target='_blank'>Zdroj meterologických dat</a>
        </div>
    </footer>
    );
  }
}
