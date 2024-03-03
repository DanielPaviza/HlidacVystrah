import React, { Component } from 'react';
import '../styles/timestamp.scss';

export class Timestamp extends Component {
    static displayName = Timestamp.name;

    constructor(props) {
        super(props);
        this.state = {
            opened: false
        };
    }

    HandleToggleOpen = () => {
        this.setState((prevState) => ({
            ...prevState,
            opened: !this.state.opened
        }));
    }

    render() {

        return (
            <div id='timestamp' className='d-flex justify-content-end align-items-center position-relative'>
                <i className="fa-solid fa-circle-info me-2" onClick={() => this.HandleToggleOpen()} />
                <div className='d-flex flex-column'>
                    <span className='border-bottom'>Poslední aktualizace</span>
                    <span className=''>{this.props.timestamp == null ? "Nikdy" : this.props.timestamp}</span>
                </div>
                {this.state.opened &&
                    <div className='infoBox position-absolute border p-1 rounded' onMouseLeave={() => this.HandleToggleOpen()} onClick={() => this.HandleToggleOpen()}>

                        {this.props.timestamp == null ?
                            "Data o meteorologické situaci nebyla načtena."
                            :
                            <>
                                Poslední změna meteorologické situace proběhla {this.props.timestamp.toLowerCase()} a data jsou stále aktuální.
                            </>
                        }      
                    </div>    
                }
            </div>
        );
    }
}
