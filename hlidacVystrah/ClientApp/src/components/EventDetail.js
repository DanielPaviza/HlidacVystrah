import React, { Component } from 'react';
import '../styles/eventDetail.scss';
export class EventDetail extends Component {
    static displayName = EventDetail.name;

    constructor(props) {
        super(props);
        this.event = this.props.event;
        console.log(props.event)

        this.state = {
            showDescription: false,
            showLocalityList: false
        };
    }

    ToggleShowDescription = () => {
        this.setState((prevState) => ({
            ...prevState,
            showDescription: !this.state.showDescription
        }));
    }

    ToggleShowLocalityList = () => {
        this.setState((prevState) => ({
            ...prevState,
            showLocalityList: !this.state.showLocalityList
        }));
    }

    RenderRegions = () => {
        return (
            <div className='mt-2'>
                {Object.entries(this.event.localityList).map(([key, value]) => (
                    <div key={key} className='d-flex flex-column'>
                        <span className='fw-bold'>{key}</span>
                        <span>
                            {this.RenderLocalityList(value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    GetDescriptionArrowDirection = () => {
        return this.state.showDescription ? "up" : "down";
    }

    GetLocalityListArrowDirection = () => {
        return this.state.showLocalityList ? "up" : "down";
    }

    RenderLocalityList = (nameList) => {
        return (
            Object.values(nameList).map((item, index, array) => (
                <React.Fragment key={item.cisorp}>
                    {item.name}
                    {index < array.length - 1 && ', '}
                </React.Fragment>
            ))
        );
    }

    render() {

        return (
            <section id="eventDetail">
                <h1 className='mb-3 mb-md-4'>Detail výstrahy</h1>
                <div className='back'>
                    <span className='pb-1 d-flex-inline align-items-center' onClick={() => this.props.closeDetail()}>
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Zpět
                    </span>
                </div>
                <div className='detail mt-5 d-flex flex-column'>
                    <div className='d-flex'>
                        <div className=''>
                            <div className='d-flex flex-column short'>
                                <span className='detailRow d-flex-inline'>
                                    <span>Typ:</span>
                                    <span>{this.event.eventType}</span>
                                </span>
                                <span className='detailRow d-flex align-items-center'>
                                    <span>Závažnost:</span>
                                    <span>{this.event.severity}</span>
                                    <div className={`ms-2 colorCircle ${this.props.GetEventColor(this.event.severity)}`}></div>
                                </span>
                                <span className='detailRow'>
                                    <span>Pravděpodobnost:</span>
                                    <span>{this.event.certainty}</span>
                                </span>
                                <span className='detailRow'>
                                    <span>Výskyt:</span>
                                    <span>{this.event.urgency}</span>
                                </span>
                                <span className='detailRow'>
                                    <span>Začátek:</span>
                                    <span>{this.event.onset}</span>
                                </span>
                                {this.event.expires &&
                                    <span className='detailRow'>
                                        <span>Konec~:</span>
                                        <span>{this.event.expires}</span>
                                    </span>
                                }
                            </div>
                        </div>
                        <div className='col-4 mx-auto my-auto d-flex justify-content-center align-items-center'>
                            <img className='typeImg' src={`/images/${this.event.imgPath}`} />
                        </div>
                    </div>
                    <div className='rollDown detailRow' onClick={() => this.ToggleShowDescription() }>
                        <span className='d-flex justify-content-between'>
                            <span>Popis:</span>
                            <i className={`fa-solid fa-arrow-${this.GetDescriptionArrowDirection()}`}></i>
                        </span>
                        {this.state.showDescription &&
                            <div className='mt-2'>
                                <span>{this.event.instruction}</span>
                                <span>{this.event.description}</span>
                            </div>
                        }
                    </div>
                    <div className='rollDown detailRow' onClick={() => this.ToggleShowLocalityList()}>
                        <span className='d-flex justify-content-between'>
                            <span>Postižené oblasti:</span>
                            <i className={`fa-solid fa-arrow-${this.GetLocalityListArrowDirection()}`}></i>
                        </span>
                        {this.state.showLocalityList &&
                            this.RenderRegions()
                        }
                    </div>
                </div>
            </section>
        );
    }
}
