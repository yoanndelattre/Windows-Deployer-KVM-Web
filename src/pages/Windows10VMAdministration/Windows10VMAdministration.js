import React, { Fragment, Component } from 'react';
import axios from 'axios'

export default class Windows10VMAdministration extends Component {

    state = {
        getWindows10Status: 'unknown',
        getConnectCommand: 'unknown'
    }

    componentDidMount() {
        this.getWindows10Status()
        this.interval = setInterval(() => this.getWindows10Status(), 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    Auth_Token = () => {
        return "virsh_api_server"
    }

    getWindows10Status = () => {
        var data = 'Windows10'
        axios.post('http://' + localStorage.getItem('getWindowsDeployerServerIp') + ':8080/getVmStatus', data, {
            headers: {
                'Auth_Token': this.Auth_Token(),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then((res) => {
            if (res.data === '') { // Error
                this.getConnectCommand()
                console.error("getWindows10Status is null")
            }
            else {
                this.setState({getWindows10Status: res.data})
                this.getConnectCommand()
            }
        })
        .catch((err) => {
            console.error(err)
            this.setState({getWindows10Status: 'unknown'})
            this.getConnectCommand()
        })
    }

    getConnectCommand = () => {
        if (this.state.getWindows10Status === 'running\n') {
            var connectCommand = 'spice://' + localStorage.getItem('getWindowsDeployerServerIp') + ':5900'
            this.setState({getConnectCommand: connectCommand})
        }
        else {
            this.setState({getConnectCommand: 'unknown'})
        }
    }

    render () {
        return (
            <Fragment>
                <div className='win10-status'>
                    <p>Windows 10 Vm Status: {this.state.getWindows10Status}</p>
                </div>
                <div className='win10-connect-command'>
                    <p>Connect Command Spice: {this.state.getConnectCommand}</p>
                </div>
           </Fragment>
        )
    }
}