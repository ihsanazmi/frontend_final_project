import React, { Component } from 'react'
import axios from '../../config/axios'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import imgWA from '../../img/whatsapp.png'
import moment from 'moment'

class ManageUser extends Component {

    state = {
        users: []
    }

    componentDidMount(){
        this.getAllUser()
    }

    getAllUser = ()=>{
        axios.get('/admin/allUser')
        .then(res=>{
            this.setState({
                users: res.data
            })
        }).catch(err=>{
            console.log(err)
        })
    }

    renderTableUser =()=>{
        
        let renderData = this.state.users.map(item=>{

            return (
                <tr key={item.id} className="text-center">
                    <td><img src={item.avatar} className="rounded-circle" style={{width:38, height:38}} alt=""/></td>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td>{item.phone_number}</td>
                    <td>{moment(item.registered_at).format('MMMM Do YYYY, h:mm:ss a')}</td>
                    <td>
                        <a target="_blank" rel="noopener noreferrer" href={`https://wa.me/${item.phone_number}`}>
                            <img  src={imgWA} style={{width:38, height:38}} alt="whatsapp"/>
                        </a>
                    </td>
                </tr>
            )
        })
        return renderData
    }

    render() {
        if(this.props.username){
            if(this.state.users.length !== 0){
                return (
                    <div className="flex-column">
                        <div className="admin-content">
                            <div className="container">
                                <div className="text-center">
                                    <h1 className="display-4">Users</h1>
                                </div>
                                <div className="table-responsive-lg">
                                    <table className="table table-hover mt-2">
                                        <thead>
                                            <tr className="text-center">
                                                <th>Avatar</th>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Registered At</th>
                                                <th>Whatsapp</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderTableUser()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }else{
                return (
                    <div className="flex-column">
                        <div className="admin-content">
                            <div className="text-center">
                                <h1 className="display-4">User not available</h1>
                            </div>
                        </div>
                    </div>
                )
            }
        }else{
            return <Redirect to="/"/>
        }
    }
}

const mapStateToProps = (state)=>{
    return {
        id: state.auth.id,
        username: state.auth.username
    }
}

export default connect(mapStateToProps)(ManageUser)
