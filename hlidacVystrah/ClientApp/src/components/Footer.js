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
            <div className='container pt-4 pb-3 d-flex flex-column flex-sm-row justify-content-between align-items-end'>
                <div className='d-flex flex-column'>
                    <a href="https://www.chmi.cz/files/portal/docs/meteo/om/bulletiny/XOCZ50_OKPR.xml" rel="nofollow" title="Zdroj meterologických dat" target='_blank'>Zdroj meterologických dat</a>
                    <a href="https://www.flaticon.com/free-icons/eye" rel='nofollow' title="eye icons" target='_blank'>Eye icons created by Gregor Cresnar - Flaticon</a>
                </div>
                <span className='copyright fw-bold mt-3'>© 2024 Daniel Pavíza</span>
            </div>
            </footer>
        );
    }
}
