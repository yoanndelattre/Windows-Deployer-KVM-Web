import React, {Component, Fragment} from 'react';
import axios from 'axios';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/bootstrap-v4.css';
 
export default class HostServerAdministration extends Component {

    state = {
        getWindowsDeployerServerName: '',
        getWindowsDeployerServerStatus: '',
        getWindowsDeployerServerIp: 'unknown',
        getWindowsDeployerServerID: '',
        getInfos: 'unknown',
        getWindowsDeployerVolumeID: ''
    }

    componentDidMount() {
        this.getWindowsDeployerServerName()
        this.interval = setInterval(() => this.getWindowsDeployerServerName(), 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    getWindowsDeployerServerName = () => {
        axios.get('https://api.scaleway.com/instance/v1/zones/fr-par-1/servers', {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem('Secret_key')
            }
        })
        .then((res) => { 
            this.setState({getWindowsDeployerServerName: res.data.servers.[0].name})
            this.getWindowsDeployerServerStatus()
        })
        .catch((err) => {
            console.error(err)
            this.setState({getWindowsDeployerServerName: ''})
            this.getWindowsDeployerServerStatus()
        })
    }
    
    getWindowsDeployerServerStatus = () => {
        axios.get('https://api.scaleway.com/instance/v1/zones/fr-par-1/servers', {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem('Secret_key')
            }
        })
        .then((res) => {
            this.setState({getWindowsDeployerServerStatus: res.data.servers.[0].state})
            this.getWindowsDeployerServerIp()
        })
        .catch((err) => {
            console.error(err)
            this.setState({getWindowsDeployerServerStatus: ''})
            this.getWindowsDeployerServerIp()
        })
    }

    getWindowsDeployerServerIp = () => {
        axios.get('https://api.scaleway.com/instance/v1/zones/fr-par-1/servers', {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem('Secret_key')
            }
        })
        .then((res) => {
            this.setState({getWindowsDeployerServerIp: res.data.servers.[0].public_ip.address})
            localStorage.setItem('getWindowsDeployerServerIp', this.state.getWindowsDeployerServerIp)
            this.getInfos()
        })
        .catch((err) => {
            console.error(err)
            this.setState({getWindowsDeployerServerIp: 'unknown'})
            localStorage.setItem('getWindowsDeployerServerIp', this.state.getWindowsDeployerServerIp)
            this.getInfos()
        })
    }

    showSshCommand = () => {
        if (this.state.getWindowsDeployerServerIp !== 'unknown') {
            if (this.state.getWindowsDeployerServerStatus === 'running') {
                return ('ssh root@' + this.state.getWindowsDeployerServerIp)
            }
            else {
                return 'unknown'
            }
        }
        else {
            return 'unknown'
        }
    }

    getInfos = () => {
        if (this.state.getWindowsDeployerServerName === 'Windows-Deployer') {
            this.setState({getInfos: this.state.getWindowsDeployerServerStatus})
        }
        else {
            this.setState({getInfos: 'Does not exist'})
        }
    }

    initWindowsDeployerServer = () => {
        new Noty({
            text: 'Please wait',
            theme: 'bootstrap-v4',
            type: 'alert',
            layout: 'bottomCenter',
        }).show();
        this.createWindowsDeployerServer()
        setTimeout(() => {
            this.getWindowsDeployerServerName()
        }, 2000);
        setTimeout(() => {
            this.getWindowsDeployerServerID()
        }, 2500);
        setTimeout(() => {
            this.enableCloudInit()
        }, 3500);
        setTimeout(() => {
            this.startWindowsDeployerServer()
        }, 4500);
        setTimeout(() => {
            new Noty({
                text: 'Installation takes an average of 4 minutes. Please do not stop Windows-Deployer Vm.',
                theme: 'bootstrap-v4',
                type: 'alert',
                layout: 'bottomCenter',
            }).show();
        }, 5200);
    }

    createWindowsDeployerServer = () => {
        if (this.state.getWindowsDeployerServerName !== 'Windows-Deployer') {
            var data = {"name": "Windows-Deployer", "commercial_type": "GP1-S", "project": localStorage.getItem('Project_ID'), "image": "16152446-99ed-4795-9d3f-87ec2f5b891d", "enable_ipv6": true}
            axios.post('https://api.scaleway.com/instance/v1/zones/fr-par-1/servers', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': localStorage.getItem('Secret_key')
                }
            })
            .then((res) => {
                console.log(res)
                new Noty({
                    text: 'The Windows-Deployer Vm has been created',
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
                text: 'The Windows-Deployer Vm already exists',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
    }

    getWindowsDeployerServerID = () => {
        if (this.state.getWindowsDeployerServerName === 'Windows-Deployer') {
            axios.get('https://api.scaleway.com/instance/v1/zones/fr-par-1/servers', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': localStorage.getItem('Secret_key')
                }
            })
            .then((res) => {
                this.setState({getWindowsDeployerServerID: res.data.servers.[0].id})
                new Noty({
                    text: 'Successful Vm ID retrieval',
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
                text: 'The Windows-Deployer Vm does not exist',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
    }

    enableCloudInit = () => {
        if (this.state.getWindowsDeployerServerName === 'Windows-Deployer') {
            var data = '#!/bin/bash\ncurl -sSL https://github.com/yoanndelattre/Windows-Deployer-KVM-Scripts/raw/master/scripts-install/initial_setup.sh | bash'
            axios.patch('https://api.scaleway.com/instance/v1/zones/fr-par-1/servers/' + this.state.getWindowsDeployerServerID + '/user_data/cloud-init', data, {
                headers: {
                    'Content-Type': 'text/plain',
                    'X-Auth-Token': localStorage.getItem('Secret_key')
                }
            })
            .then((res) => {
                console.log(res)
                new Noty({
                    text: 'Cloud Init is well activated',
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
                text: 'The Windows-Deployer Vm does not exist',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
    }

    startWindowsDeployerServer = () => {
        if (this.state.getWindowsDeployerServerName === 'Windows-Deployer') {
            if (this.state.getWindowsDeployerServerStatus === 'stopped') {
                var data = {"action": "poweron"}
                axios.post('https://api.scaleway.com/instance/v1/zones/fr-par-1/servers/' + this.state.getWindowsDeployerServerID + '/action', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': localStorage.getItem('Secret_key')
                    }
                })
                .then((res) => {
                    console.log(res)
                    new Noty({
                        text: 'The Windows-Deployer Vm has been started',
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
                    text: 'The Windows-Deployer Vm is in an unstable state or is already started',
                    theme: 'bootstrap-v4',
                    type: 'error',
                    layout: 'bottomCenter',
                }).show();
            }
        }
        else {
            new Noty({
                text: 'The Windows-Deployer Vm does not exist',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
    }

    startingWindowsDeployerServer = () => {
        new Noty({
            text: 'Please wait',
            theme: 'bootstrap-v4',
            type: 'alert',
            layout: 'bottomCenter',
        }).show();
        this.getWindowsDeployerServerName()
        setTimeout(() => {
            this.getWindowsDeployerServerID()
        }, 500);
        setTimeout(() => {
            this.startWindowsDeployerServer()
        }, 1500);
        setTimeout(() => {
            new Noty({
                text: 'finished',
                theme: 'bootstrap-v4',
                type: 'alert',
                layout: 'bottomCenter',
            }).show();
        }, 2500);
    }

    stopWindowsDeployerServer = () => {
        if (this.state.getWindowsDeployerServerName === 'Windows-Deployer') {
            if (this.state.getWindowsDeployerServerStatus === 'running') {
                var data = {"action": "poweroff"}
                axios.post('https://api.scaleway.com/instance/v1/zones/fr-par-1/servers/' + this.state.getWindowsDeployerServerID + '/action', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': localStorage.getItem('Secret_key')
                    }
                })
                .then((res) => {
                    console.log(res)
                    new Noty({
                        text: 'The Windows-Deployer Vm is shutting down',
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
                    text: 'The Windows-Deployer Vm is in an unstable state or is already stopped',
                    theme: 'bootstrap-v4',
                    type: 'error',
                    layout: 'bottomCenter',
                }).show();
            }
        }
        else {
            new Noty({
                text: 'The Windows-Deployer Vm does not exist',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
    }

    stoppingWindowsDeployerServer = () => {
        new Noty({
            text: 'Please wait',
            theme: 'bootstrap-v4',
            type: 'alert',
            layout: 'bottomCenter',
        }).show();
        this.getWindowsDeployerServerName()
        setTimeout(() => {
            this.getWindowsDeployerServerID()
        }, 500);
        setTimeout(() => {
            this.stopWindowsDeployerServer()
        }, 1500);
        setTimeout(() => {
            new Noty({
                text: 'finished',
                theme: 'bootstrap-v4',
                type: 'alert',
                layout: 'bottomCenter',
            }).show();
        }, 2500);
    }

    deleteWindowsDeployerServer = () => {
        if (this.state.getWindowsDeployerServerName === 'Windows-Deployer') {
            if (this.state.getWindowsDeployerServerStatus === 'stopped') {
                axios.delete('https://api.scaleway.com/instance/v1/zones/fr-par-1/servers/' + this.state.getWindowsDeployerServerID, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': localStorage.getItem('Secret_key')
                    }
                })
                .then((res) => {
                    console.log(res)
                    new Noty({
                        text: 'The Windows-Deployer Vm is in the process of being removed',
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
            else if (this.state.getWindowsDeployerServerStatus === 'running') {
                new Noty({
                    text: 'First stop Windows-Deployer Vm',
                    theme: 'bootstrap-v4',
                    type: 'error',
                    layout: 'bottomCenter',
                }).show();
            }
            else {
                new Noty({
                    text: 'The Windows-Deployer Vm is in an unstable state',
                    theme: 'bootstrap-v4',
                    type: 'error',
                    layout: 'bottomCenter',
                }).show();
            }
        }
        else {
            new Noty({
                text: 'The Windows-Deployer Vm does not exist',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
    }

    getWindowsDeployerVolumeID = () => {
        axios.get('https://api.scaleway.com/instance/v1/zones/fr-par-1/volumes', {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem('Secret_key')
            }
        })
        .then((res) => {
            this.setState({getWindowsDeployerVolumeID: res.data.volumes.[0].id})
            new Noty({
                text: 'Successful Volume ID retrieval',
                theme: 'bootstrap-v4',
                type: 'success',
                layout: 'bottomCenter',
            }).show();
        })
        .catch((err) => {
            console.error(err)
            new Noty({
                text: 'Get Volume Error',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        })
    }

    deleteWindowsDeployerVolume = () => {
        axios.delete('https://api.scaleway.com/instance/v1/zones/fr-par-1/volumes/' + this.state.getWindowsDeployerVolumeID, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem('Secret_key')
            }
        })
        .then((res) => {
            console.log(res)
            new Noty({
                text: 'The Windows-Deployer Volume is in the process of being removed',
                theme: 'bootstrap-v4',
                type: 'success',
                layout: 'bottomCenter',
            }).show();
        })
        .catch((err) => {
            console.error(err)
            new Noty({
                text: 'The volume cannot be deleted',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        })
    }

    deletingWindowsDeployerServer = () => {
        new Noty({
            text: 'Please wait',
            theme: 'bootstrap-v4',
            type: 'alert',
            layout: 'bottomCenter',
        }).show();
        this.getWindowsDeployerServerName()
        setTimeout(() => {
            this.getWindowsDeployerServerID()
        }, 500);
        setTimeout(() => {
            this.deleteWindowsDeployerServer()
        }, 1500);
        setTimeout(() => {
            this.getWindowsDeployerVolumeID()
        }, 3500);
        setTimeout(() => {
            this.deleteWindowsDeployerVolume()
        }, 4500);
        setTimeout(() => {
            new Noty({
                text: 'finished',
                theme: 'bootstrap-v4',
                type: 'alert',
                layout: 'bottomCenter',
            }).show();
        }, 5500);
    }
   
    render() {
        return (
            <Fragment>
                <div className='vm-status'>
                    <p>Windows-Deployer VM Status: {this.state.getInfos}</p>
                </div>
                <div className='vm-ip'>
                    <p>VM IP: {localStorage.getItem('getWindowsDeployerServerIp')}</p>
                </div>
                <div className='vm-ssh-command'>
                    <p>SSH Connect: {this.showSshCommand()}</p>
                </div>
                <div className='init-vm'>
                    <button onClick={this.initWindowsDeployerServer}>Initialize Windows-Deployer VM</button>
                </div>
                <div className='starting-vm'>
                    <button onClick={this.startingWindowsDeployerServer}>Start Windows-Deployer VM</button>
                </div>
                <div className='stopping-vm'>
                    <button onClick={this.stoppingWindowsDeployerServer}>Stop Windows-Deployer VM</button>
                </div>
                <div className='deleting-vm'>
                    <button onClick={this.deletingWindowsDeployerServer}>Delete Windows-Deployer VM</button>
                </div>
            </Fragment>
        );
    }
}