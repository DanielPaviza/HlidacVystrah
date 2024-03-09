
import React, { Component } from 'react';
import '../styles/history.scss';
import { Spinner } from './Spinner';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import { History } from './History';
import axios from "axios";

export class HistoryController extends Component {
    static displayName = HistoryController.name;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            priorUpdates: [],
            posteriorUpdates: [],
            currentUpdate: null,
            response: null
        };
    }

    componentDidMount() {
        this.GetUpdateList();
    }

    async GetUpdateList(timestamp = null) {

        axios.post('/api/update/list', {
            "timestamp": timestamp
        })
            .then(response => {

                let data = response.data;
                console.log(data);
                this.setState((prevState) => ({
                    ...prevState,
                    response: data.responseCode,
                }));

                if (data.responseCode == 200) {
                    this.setState((prevState) => ({
                        ...prevState,
                        loading: false,
                        priorUpdates: data.priorUpdates,
                        currentUpdate: data.currentUpdate,
                        posteriorUpdates: data.posteriorUpdates
                    }));
                }
            });
    }

    RenderUpdates = () => {
        return (
            <div className='updates d-flex border-bottom justify-content-around'>
                {this.state.posteriorUpdates.map((update, index) => (
                    <div key={update.timestamp} className={`${(index != this.state.posteriorUpdates.length - 1) && 'd-none'} d-md-flex w-100 d-flex align-items-center justify-content-center p-1 m-1  ${index != 0 && 'border-start'}`} onClick={() => this.GetUpdateList(update.timestamp) }>
                        <div>{update.timestampReadable}</div>
                    </div>
                ))}

                <div key={this.state.currentUpdate.timestamp} className={`w-100 d-flex align-items-center justify-content-center currentTimestamp fw-bold p-2 ${this.state.posteriorUpdates.length > 0 && 'border-start'}`}>
                    <div>{this.state.currentUpdate.timestampReadable}</div>
                </div>

                {this.state.priorUpdates.map((update, index) => (
                    <div key={update.timestamp} className={`${index != 0 && 'd-none'} d-md-flex w-100 d-flex align-items-center justify-content-center p-1 m-1 border-start`} onClick={() => this.GetUpdateList(update.timestamp)}>
                        <div>{update.timestampReadable}</div>
                    </div>
                ))}
            </div>
        );
    }

    render() {

        return (
            <>
                <NavMenu />
                {this.state.loading ?
                    <Spinner />
                    :
                    <div id="history" className='container'>
                        <h2 className='mt-4'>Archiv meteorologických dat</h2>
                        <div className='d-flex flex-column'>
                            <div className='mt-2 mb-2'>
                                <label htmlFor="timestamp" className='me-2'>Vyhledat datum aktualizace:</label>
                                <input type="date" id="timestamp" name="timestamp" onChange={(e) => this.GetUpdateList(e.target.value)} />
                            </div>
                            {this.state.response == 200 ? 
                            <>
                                {this.RenderUpdates()}
                                <div className='p-2 w-100'>
                                    <History currentUpdate={this.state.currentUpdate} />
                                </div>
                            </>
                            :
                                <h5 className='mt-4'>Pro toto datum nebyly nalezeny žádné aktualizace.</h5>
                            }
                        </div>
                    </div>
                }
                <Footer background={'lightGray'} />
            </>
        );
    }
}
