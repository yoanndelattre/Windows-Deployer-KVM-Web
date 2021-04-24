import React, {Component, Fragment} from 'react';
import axios from 'axios';
 
export default class HostServerAdministration extends Component {

    state = {
        getWindowsDeployerKVMServerName: '',
        getWindowsDeployerKVMServerStatus: '',
        getInfos: ''
    }

    componentDidMount() {
        this.interval = setInterval(() => this.getInfos(), 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getInfos = () => {
        this.getWindowsDeployerKVMServerName()
        this.getWindowsDeployerKVMServerStatus()
        if (this.state.getWindowsDeployerKVMServerName === 'Windows-Deployer') {
            this.setState({getInfos: this.state.getWindowsDeployerKVMServerStatus})
        }
        else {
            this.setState({getInfos: 'The Windows-Deployer VM does not exist'})
        }
    }
    
    getWindowsDeployerKVMServerName = () => {
        axios.get('https://api.scaleway.com/instance/v1/zones/fr-par-1/servers', {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem('Secret_key')
            }
        })
        .then((res) => { 
            this.setState({getWindowsDeployerKVMServerName: res.data.servers.[0].name})
        })
        .catch((err) => {
            console.error(err)
            this.setState({getWindowsDeployerKVMServerName: ''})
        })
    }
    
    getWindowsDeployerKVMServerStatus = () => {
        axios.get('https://api.scaleway.com/instance/v1/zones/fr-par-1/servers', {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': localStorage.getItem('Secret_key')
            }
        })
        .then((res) => {
            this.setState({getWindowsDeployerKVMServerStatus: res.data.servers.[0].state})
        })
        .catch((err) => {
            console.error(err)
            this.setState({getWindowsDeployerKVMServerStatus: ''})
        })
    }
   
    render() {
        return (
            <Fragment>
                <div>
                    <p>Windows-Deployer VM Status:</p>
                    {this.state.getInfos}
                </div>
            </Fragment>
        );
    }
}