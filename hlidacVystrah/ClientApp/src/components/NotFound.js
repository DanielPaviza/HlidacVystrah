import React, { Component } from 'react';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import '../styles/notFound.scss';

export class NotFound extends Component {
    static displayName = NotFound.name;

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <>
                <NavMenu />
                <div id="notFound" className='container mt-5'>
                    <h2>Stránka nenalezena</h2>
                    <p>Pravděpodobně jste zadali neexistující adresu.</p>
                    <a href='/'>Zpět na hlavní stranu</a>
                </div>
                <Footer />
            </>
        );
    }
}
