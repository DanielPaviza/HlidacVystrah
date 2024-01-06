import React, { Component } from 'react';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import '../styles/register.scss';

export class Register extends Component {
    static displayName = Register.name;

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <>
                <NavMenu />
                <div id="register" className=''>
                    register
                </div>
                <Footer />
            </>
        );
    }
}
