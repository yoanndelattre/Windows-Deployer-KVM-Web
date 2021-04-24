import React, {Component, Fragment} from 'react';
import axios from 'axios';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/bootstrap-v4.css';
 
export default class HostServerAdministration extends Component {

    state = {
        getWindowsDeployerServerName: '',
        getWindowsDeployerServerStatus: '',
        getInfos: ''
    }

    componentDidMount() {
        this.interval = setInterval(() => this.getInfos(), 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getInfos = () => {
        this.getWindowsDeployerServerName()
        this.getWindowsDeployerServerStatus()
        if (this.state.getWindowsDeployerServerName === 'Windows-Deployer') {
            this.setState({getInfos: this.state.getWindowsDeployerServerStatus})
        }
        else {
            this.setState({getInfos: 'The Windows-Deployer VM does not exist'})
        }
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
        })
        .catch((err) => {
            console.error(err)
            this.setState({getWindowsDeployerServerName: ''})
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
        })
        .catch((err) => {
            console.error(err)
            this.setState({getWindowsDeployerServerStatus: ''})
        })
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
   
    render() {
        return (
            <Fragment>
                <div className='vm-status'>
                    <p>Windows-Deployer VM Status:</p>
                    {this.state.getInfos}
                </div>
                <div className='create-vm'>
                    <button onClick={this.createWindowsDeployerServer}>Create Windows-Deployer VM</button>
                </div>
            </Fragment>
        );
    }
}