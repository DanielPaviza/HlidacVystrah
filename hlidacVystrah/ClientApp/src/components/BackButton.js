import React, { Component } from 'react';
import '../styles/backButton.scss';
export class BackButton extends Component {
    static displayName = BackButton.name;

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className='backButton d-flex flex-column'>
                <span className='mb-2' onClick={() => this.props.CloseDetail() }>
                    <i className="fa-solid fa-house me-2"></i>
                    Domů
                </span>
                <span className='d-flex-inline align-items-center' onClick={() => this.props.history.NavigateBack()}>
                    <i className="fa-solid fa-arrow-left me-2"></i>
                    Zpět
                </span>
            </div>
        );
    }
}
