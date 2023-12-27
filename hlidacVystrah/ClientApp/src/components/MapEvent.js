import React, { Component } from 'react';
import { ReactComponent as Img } from '../map.svg';
import ReactDOM from 'react-dom';  // Don't forget to import ReactDOM
import '../styles/map.scss';
export class MapEvent extends Component {
    static displayName = MapEvent.name;

    constructor(props) {
        super(props);
        this.svgRef = React.createRef();

        this.isDetail = false;
        if (this.props.events.length == 1)
            this.isDetail = true;
    }

    componentDidMount() {

        const mapLocalityList = Array.from(this.svgRef.current.childNodes[0].childNodes);
        let affectedLocalityList = this.isDetail ? this.GetAffectedLocality() : this.GetAffectedCisorpList();
        this.RenderLocalityColor(mapLocalityList, affectedLocalityList);
    }

    GetAffectedLocality() {

        let affected = [];
        let event = this.props.events[0];
        let color = this.props.GetEventColor(event.severity);
        affected[color] = [];

        Object.entries(event.localityList).forEach(([region, localities]) => {
            affected[color].push(localities);
        });

        affected = this.FlattenAffected(affected);

        return affected;
    }

    RenderLocalityColor = (mapLocalityList, affected) => {

        Object.entries(affected).forEach(([severityColor, localities]) => {
            localities.forEach((locality) => {

                const foundElement = mapLocalityList.find(element => {
                    const cisorpAttribute = element.attributes.getNamedItem("cisorp");

                    return cisorpAttribute && cisorpAttribute.value == locality.cisorp;
                });

                foundElement.setAttribute("fill", severityColor);
            });
        });
    }

    GetAffectedCisorpList = () => {

        let affected = {};

        this.props.events.forEach((event) => {
            Object.entries(event.localityList).forEach(([region, localities]) => {
                let severityColor = this.props.GetEventColor(event.severity);
                if (!affected.hasOwnProperty(severityColor))
                    affected[severityColor] = [];
                affected[severityColor].push(localities);
            });
        });

        affected = this.FlattenAffected(affected);

        // remove less severe duplicate localities
        affected = this.RemoveLessSevereLocality(affected, "red");
        affected = this.RemoveLessSevereLocality(affected, "orange");
        affected = this.RemoveLessSevereLocality(affected, "yellow");

        return affected;
    }

    FlattenAffected = (list) => {
        // The list arrays have 1 less depth
        Object.keys(list).forEach(key => {
            list[key] = list[key].flat();
        })

        return list;
    }

    RemoveLessSevereLocality = (cisorpList, localitySeverityKey) => {

        const currentSeverityList = cisorpList[localitySeverityKey];
        let reduced = {};

        Object.keys(cisorpList).forEach(key => {

            if (key != localitySeverityKey) {

                cisorpList[key].forEach(locality => {

                    let addLocality = true;
                    currentSeverityList.forEach(u => {
                        if (u.cisorp == locality.cisorp) {
                            addLocality = false;
                            return;
                        }                            
                    })

                    if (addLocality) {
                        if (!reduced.hasOwnProperty(key))
                            reduced[key] = [];
                        reduced[key].push(locality);
                    }

                })
            }       
        })

        reduced[localitySeverityKey] = currentSeverityList;

        return reduced;
    }
    
    render() {
        return (
            <div id="map" className='d-flex justify-content-center'>
                <Img ref={this.svgRef} />
            </div>
        );
    }
}
