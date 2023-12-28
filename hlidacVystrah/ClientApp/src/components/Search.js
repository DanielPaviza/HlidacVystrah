import React, { Component } from 'react';
import '../styles/search.scss';
export class Search extends Component {
    static displayName = Search.name;

    constructor(props) {
        super(props);

        this.state = {
            listOpened: false,
            filteredLocalityList: this.props.localityList
        };
    }

    FilterLocalityList = (val) => {

        val = val.toLowerCase();
        let filteredNames = {};

        // filter region names
        Object.keys(this.props.localityList).forEach(key => {
            if (key.toLowerCase().includes(val)) {
                //filteredNames[key] = [{ name: key, cisorp: key }];
                filteredNames[key] = []
            }                
        });

        // filter locality names
        Object.keys(this.props.localityList).forEach(key => {
            for (let i in this.props.localityList[key]) {
                let locality = this.props.localityList[key][i];
                if (locality.name.toLowerCase().includes(val)) {
                    if (!filteredNames.hasOwnProperty(key))
                        filteredNames[key] = [];
                    filteredNames[key].push(locality);
                }
            }
        });

        this.setState((prevState) => ({
            ...prevState,
            listOpened: true,
            filteredLocalityList: filteredNames
        }));

        console.log(filteredNames)
    }

    RenderLocalityList = () => {

        //console.log(this.state.filteredLocalityList)

        return (
            Object.keys(this.state.filteredLocalityList).map(key => (

                <div className='mt-2' key={key}>
                    <p className='fw-bold m-0 ps-2 region' onClick={() => this.props.OpenLocalityDetail(key, true)}>{key}</p>
                    <div className='d-flex flex-wrap flex-column'>
                        {this.state.filteredLocalityList[key].map(locality => (
                            <span key={locality.cisorp} className='ps-3 locality' onClick={() => this.props.OpenLocalityDetail(locality.cisorp) }>
                                {locality.name}
                            </span>
                        ))}
                    </div>
                </div>
            ))
        )
    }

    HandleInputBlur = () => {
        setTimeout(() => {
            this.setState((prevState) => ({
                ...prevState,
                listOpened: false
            }));
        }, 100);
    };

    HandleInputFocus = () => {
        this.setState((prevState) => ({
            ...prevState,
            listOpened: true
        }));
    };

    render() {

        return (
            <div id="search" className='d-flex flex-column mb-4 col-12 col-lg-10 col-xl-8 mx-auto'>
                <label htmlFor='localitySearch' className='fw-bold'>Vyhledejte kraj/obci</label>
                <input
                    id='localitySearch'
                    type="text"
                    className={`border p-1 ${this.state.listOpened && "opened"}`}
                    onChange={(event) => this.FilterLocalityList(event.target.value)}
                    onFocus={() => this.HandleInputFocus()}
                    onBlur={() => this.HandleInputBlur()}
                ></input>
                {this.state.listOpened &&
                    <div className='list w-100 border border-top-0'>
                        {this.RenderLocalityList()}
                    </div>    
                }
            </div>
        );
    }
}
