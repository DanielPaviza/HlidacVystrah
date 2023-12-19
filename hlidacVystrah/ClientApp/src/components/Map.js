import React, { Component } from 'react';
import { ReactComponent as Img } from '../map.svg';
import '../styles/map.scss';
export class Map extends Component {
    static displayName = Map.name;

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div id="map">
                <Img />
            </div>
        );
    }
}
