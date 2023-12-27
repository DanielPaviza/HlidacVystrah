import React, { Component } from 'react';
import { ReactComponent as Img } from '../map.svg';
import '../styles/map.scss';
export class MapLocality extends Component {
    static displayName = MapLocality.name;

    constructor(props) {
        super(props);
        this.svgRef = React.createRef();
    }

    componentDidMount() {

        console.log(this.props.localityInfo);

        this.mapLocalityList = Array.from(this.svgRef.current.childNodes[0].childNodes);

        this.isRegion = this.props.localityInfo.name == null;
        let affected = {}
        if (this.isRegion) {

            let localityList = this.props.localityList[this.props.localityInfo.region];
            affected = this.GetAffectedList(localityList);


        } else {
            let severityColor = this.GetMostSevereColor();
            affected[severityColor] = [this.props.localityInfo];
        }

        this.RenderLocalityColor(this.mapLocalityList, affected);
    }

    GetMostSevereColor() {

        if (this.EventsContainSeverity("red"))
            return "red";

        if (this.EventsContainSeverity("orange"))
            return "orange";

        if (this.EventsContainSeverity("yellow"))
            return "yellow";

        if (this.EventsContainSeverity("green"))
            return "green";

        if (this.EventsContainSeverity("gray"))
            return "gray";

        return "white";
    }

    GetAffectedList = (localityList) => {

        let affected = {};
        this.props.events.forEach(event => {

            let severityColor = this.props.GetEventColor(event.severity);
            Object.entries(event.localityList).forEach(([region, localities]) => {

                localityList.forEach(locality => {
                    if (localities.some(obj => obj.cisorp === locality.cisorp)) {
                        if (!affected.hasOwnProperty(severityColor))
                            affected[severityColor] = [];
                        affected[severityColor].push(locality);
                    }
                })
            })
        })

        // remove less severe duplicate localities
        affected = this.RemoveLessSevereLocality(affected, "red");
        affected = this.RemoveLessSevereLocality(affected, "orange");
        affected = this.RemoveLessSevereLocality(affected, "yellow");

        return affected;
    }

    EventsContainSeverity = (severityColor) => {

        let contains = false;

        this.props.events.forEach(event => {

            let color = this.props.GetEventColor(event.severity);
            if (color == severityColor)
                contains = true;
        })

        return contains;
    }

    RemoveLessSevereLocality = (cisorpList, localitySeverityKey) => {

        const currentSeverityList = cisorpList[localitySeverityKey];
        if (currentSeverityList == undefined)
            return cisorpList;

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
    
    render() {
        return (
            <div id="map" className='d-flex justify-content-center'>
                <Img ref={this.svgRef} />
            </div>
        );
    }
}
