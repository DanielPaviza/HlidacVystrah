import React, { Component } from 'react';
import '../styles/homeButton.scss';
export class HomeButton extends Component {
    static displayName = HomeButton.name;

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className='homeButton'>
                <span className='pb-1 d-flex-inline align-items-center' onClick={() => this.props.CloseDetail()}>
                    <i className="fa-solid fa-arrow-left me-2"></i>
                    Zpět
                </span>
            </div>
        );
    }
}
