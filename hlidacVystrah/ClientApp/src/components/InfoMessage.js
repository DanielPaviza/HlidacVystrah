import React, { Component } from 'react';
import '../styles/infoMessage.scss';

export class InfoMessage extends Component {
    static displayName = InfoMessage.name;

    constructor(props) {
        super(props);

        this.state = {
            visible: true,
            clicked: false // Track if the message has been clicked
        };

        this.hideTimer = null; // Timer for hiding the message

        this.timeoutTime = 4000;
    }

    componentDidMount() {
        this.startHideTimer();
    }

    componentWillUnmount() {
        clearTimeout(this.hideTimer);
    }

    componentDidUpdate(prevProps, prevState) {
        // Reset the visibility and start the hide timer when receiving new props
        if (this.props !== prevProps) {
            this.setState({ visible: true, clicked: false }, () => {
                this.startHideTimer();
            });
        }
    }

    handleClick = () => {
        this.setState({ clicked: true });
        clearTimeout(this.hideTimer);
    };

    startHideTimer = () => {
        // Clear the previous hide timer before starting a new one
        clearTimeout(this.hideTimer);

        // Start the hide timer only if the message hasn't been clicked yet
        if (!this.state.clicked) {
            this.hideTimer = setTimeout(() => {
                this.setState({ visible: false });
            }, this.timeoutTime);
        }
    };

    render() {
        const { visible } = this.state;

        return (
            <span className={`${!visible && 'd-none'} d-flex my-1 infoMessage align-items-center`} >
                <div className={`colorCircle ${this.props.isError ? 'red' : 'green'} me-1`}></div>
                <span className=''>{this.props.text}</span>
            </span>
        );
    }
}
