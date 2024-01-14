import React, { Component } from 'react';
import '../styles/infoBox.scss';

export class InfoBox extends Component {
    static displayName = InfoBox.name;

    constructor(props) {
        super(props);

        this.state = {
            opened: false
        };
    }

    render() {

        return (
            <div
                className='infoBox position-relative'
                onMouseOver={() => this.setState((prevState) => ({ ...prevState, opened: true }))}
                onMouseLeave={() => this.setState((prevState) => ({ ...prevState, opened: false }))}
            >
                <div className='questionmark ms-1 d-flex align-items-center justify-content-center fw-bold'>?</div>
                {this.state.opened && 
                    <div className='infoContainer position-absolute d-flex flex-column align-items-end'>
                        <div className=''></div> 
                        <span className='rounded p-2'>{this.props.text}</span>    
                    </div>
                }
            </div>
        );
    }
}
