import React, { Fragment, Component } from 'react';
import axios from 'axios'
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/bootstrap-v4.css';
import './Windows10VMAdministration.css'

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
            if (res.data === '') { // Does not exist
                console.error('The Windows10 Vm does not exist')
                this.setState({getWindows10Status: 'The Windows10 Vm does not exist'})
            }
            else {
                this.setState({getWindows10Status: res.data})
                this.getConnectCommand()
            }
        })
        .catch((err) => {
            console.error(err)
            this.setState({getWindows10Status: 'Communication with the remote server not possible'})
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

    startWin10 = () => {
        if (this.state.getWindows10Status === 'Communication with the remote server not possible') {
            new Noty({
                text: 'Communication with the remote server not possible',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
        else if (this.state.getWindows10Status === 'The Windows10 Vm does not exist') {
            new Noty({
                text: 'The Windows10 Vm does not exist',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
        else if (this.state.getWindows10Status === 'shut\n') {
            var data = 'Windows10'
            axios.post('http://' + localStorage.getItem('getWindowsDeployerServerIp') + ':8080/startVM', data, {
                headers: {
                    'Auth_Token': this.Auth_Token(),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((res) => {
                console.log(res)
                new Noty({
                    text: 'The Windows10 Vm has been started',
                    theme: 'bootstrap-v4',
                    type: 'success',
                    layout: 'bottomCenter',
                }).show();
            })
            .catch((err) => {
                console.error(err)
                new Noty({
                    text: 'Error',
                    theme: 'bootstrap-v4',
                    type: 'error',
                    layout: 'bottomCenter',
                }).show();
            })
        }
        else {
            new Noty({
                text: 'The Windows10 Vm is in an unstable state or is already started',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
    }

    startingWin10 = () => {
        new Noty({
            text: 'Please wait',
            theme: 'bootstrap-v4',
            type: 'alert',
            layout: 'bottomCenter',
        }).show();
        this.getWindows10Status()
        setTimeout(() => {
            this.startWin10()
        }, 1000);
        setTimeout(() => {
            new Noty({
                text: 'finished',
                theme: 'bootstrap-v4',
                type: 'alert',
                layout: 'bottomCenter',
            }).show();
        }, 5000);
    }

    shutWin10 = () => {
        if (this.state.getWindows10Status === 'Communication with the remote server not possible') {
            new Noty({
                text: 'Communication with the remote server not possible',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
        else if (this.state.getWindows10Status === 'The Windows10 Vm does not exist') {
            new Noty({
                text: 'The Windows10 Vm does not exist',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
        else if (this.state.getWindows10Status === 'running\n') {
            var data = 'Windows10'
            axios.post('http://' + localStorage.getItem('getWindowsDeployerServerIp') + ':8080/shutdownVM', data, {
                headers: {
                    'Auth_Token': this.Auth_Token(),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((res) => {
                console.log(res)
                new Noty({
                    text: 'The Windows10 Vm has been shutted',
                    theme: 'bootstrap-v4',
                    type: 'success',
                    layout: 'bottomCenter',
                }).show();
            })
            .catch((err) => {
                console.error(err)
                new Noty({
                    text: 'Error',
                    theme: 'bootstrap-v4',
                    type: 'error',
                    layout: 'bottomCenter',
                }).show();
            })
        }
        else {
            new Noty({
                text: 'The Windows10 Vm is in an unstable state or is already shutted',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
    }

    shuttingWin10 = () => {
        new Noty({
            text: 'Please wait',
            theme: 'bootstrap-v4',
            type: 'alert',
            layout: 'bottomCenter',
        }).show();
        this.getWindows10Status()
        setTimeout(() => {
            this.shutWin10()
        }, 1000);
        setTimeout(() => {
            new Noty({
                text: 'finished',
                theme: 'bootstrap-v4',
                type: 'alert',
                layout: 'bottomCenter',
            }).show();
        }, 3000);
    }

    forceShutWin10 = () => {
        if (this.state.getWindows10Status === 'Communication with the remote server not possible') {
            new Noty({
                text: 'Communication with the remote server not possible',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
        else if (this.state.getWindows10Status === 'The Windows10 Vm does not exist') {
            new Noty({
                text: 'The Windows10 Vm does not exist',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
        else if (this.state.getWindows10Status === 'running\n') {
            var data = 'Windows10'
            axios.post('http://' + localStorage.getItem('getWindowsDeployerServerIp') + ':8080/forceShutdownVM', data, {
                headers: {
                    'Auth_Token': this.Auth_Token(),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((res) => {
                console.log(res)
                new Noty({
                    text: 'The Windows10 Vm has been shutted with forcing',
                    theme: 'bootstrap-v4',
                    type: 'success',
                    layout: 'bottomCenter',
                }).show();
            })
            .catch((err) => {
                console.error(err)
                new Noty({
                    text: 'Error',
                    theme: 'bootstrap-v4',
                    type: 'error',
                    layout: 'bottomCenter',
                }).show();
            })
        }
        else {
            new Noty({
                text: 'The Windows10 Vm is in an unstable state or is already shutted',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
    }

    forceShuttingWin10 = () => {
        new Noty({
            text: 'Please wait',
            theme: 'bootstrap-v4',
            type: 'alert',
            layout: 'bottomCenter',
        }).show();
        this.getWindows10Status()
        setTimeout(() => {
            this.forceShutWin10()
        }, 1000);
        setTimeout(() => {
            new Noty({
                text: 'finished',
                theme: 'bootstrap-v4',
                type: 'alert',
                layout: 'bottomCenter',
            }).show();
        }, 3000);
    }

    RebootWin10 = () => {
        if (this.state.getWindows10Status === 'Communication with the remote server not possible') {
            new Noty({
                text: 'Communication with the remote server not possible',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
        else if (this.state.getWindows10Status === 'The Windows10 Vm does not exist') {
            new Noty({
                text: 'The Windows10 Vm does not exist',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
        else if (this.state.getWindows10Status === 'running\n') {
            var data = 'Windows10'
            axios.post('http://' + localStorage.getItem('getWindowsDeployerServerIp') + ':8080/rebootVM', data, {
                headers: {
                    'Auth_Token': this.Auth_Token(),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((res) => {
                console.log(res)
                new Noty({
                    text: 'The Windows10 Vm has been rebooted',
                    theme: 'bootstrap-v4',
                    type: 'success',
                    layout: 'bottomCenter',
                }).show();
            })
            .catch((err) => {
                console.error(err)
                new Noty({
                    text: 'Error',
                    theme: 'bootstrap-v4',
                    type: 'error',
                    layout: 'bottomCenter',
                }).show();
            })
        }
        else {
            new Noty({
                text: 'The Windows10 Vm is in an unstable state or is shutted',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
    }

    RebootingWin10 = () => {
        new Noty({
            text: 'Please wait',
            theme: 'bootstrap-v4',
            type: 'alert',
            layout: 'bottomCenter',
        }).show();
        this.getWindows10Status()
        setTimeout(() => {
            this.RebootWin10()
        }, 1000);
        setTimeout(() => {
            new Noty({
                text: 'finished',
                theme: 'bootstrap-v4',
                type: 'alert',
                layout: 'bottomCenter',
            }).show();
        }, 3000);
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
                <div className='starting-win10'>
                    <button className='starting-win10-button' onClick={this.startingWin10}>Start Windows10</button>
                </div>
                <div className='shutting-win10'>
                    <button className='shutting-win10-button' onClick={this.shuttingWin10}>Shutdown Windows10</button>
                </div>
                <div className='force-shutting-win10'>
                    <button className='force-shutting-win10-button' onClick={this.forceShuttingWin10}>Force Shutdown Windows10</button>
                </div>
                <div className='rebooting-win10'>
                    <button className='rebooting-win10-button' onClick={this.RebootingWin10}>Reboot Windows10</button>
                </div>
           </Fragment>
        )
    }
}