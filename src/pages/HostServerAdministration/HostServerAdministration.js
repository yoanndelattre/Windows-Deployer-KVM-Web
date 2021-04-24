import React, {Component, Fragment} from 'react';
import axios from 'axios';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/bootstrap-v4.css';
 
export default class HostServerAdministration extends Component {

    state = {
        getWindowsDeployerServerName: '',
        getWindowsDeployerServerStatus: '',
        getWindowsDeployerServerID: '',
        getInfos: ''
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
            this.getInfos()
        })
        .catch((err) => {
            console.error(err)
            this.setState({getWindowsDeployerServerStatus: ''})
            this.getInfos()
        })
    }

    getInfos = () => {
        if (this.state.getWindowsDeployerServerName === 'Windows-Deployer') {
            this.setState({getInfos: this.state.getWindowsDeployerServerStatus})
        }
        else {
            this.setState({getInfos: 'The Windows-Deployer VM does not exist'})
        }
    }

    initWindowsDeployerServer = () => {
        this.createWindowsDeployerServer()
        setTimeout(() => {
            this.getWindowsDeployerServerName()
        }, 2000);
        setTimeout(() => {
            this.getWindowsDeployerServerID()
        }, 2500);
        setTimeout(() => {
            this.enableCloudInit()
        }, 3000);
    }

    createWindowsDeployerServer = () => {
        if (this.state.getWindowsDeployerServerName !== 'Windows-Deployer') {
            var data = {"name": "Windows-Deployer", "commercial_type": "GP1-S", "project": localStorage.getItem('Project_ID'), "image": "16152446-99ed-4795-9d3f-87ec2f5b891d"}
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
                text: 'Error',
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
                text: 'Error',
                theme: 'bootstrap-v4',
                type: 'error',
                layout: 'bottomCenter',
            }).show();
        }
    }
   
    render() {
        return (
            <Fragment>
                <div className='vm-status'>
                    <p>Windows-Deployer VM Status: {this.state.getInfos}</p>

                </div>
                <div className='init-vm'>
                    <button onClick={this.initWindowsDeployerServer}>Init Windows-Deployer VM</button>
                </div>
            </Fragment>
        );
    }
}