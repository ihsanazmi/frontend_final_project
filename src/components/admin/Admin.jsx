import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect, Link, Route} from 'react-router-dom'
import ManageProduct from './ManageProduct'
import ManageUser from './ManageUser'
import ManageTransaction from './ManageTransaction'
import AdminDashboard from './DashboardAdmin'

class Admin extends Component {

    state = {
        display: false,
    }

    toggle = ()=>{
        this.setState({display:!this.state.display})
    }

    render() {
        if(this.props.username){
            return (
                <div>
                    <div id="sidebar" className="sidebar shadow">
                        <a className="d-flex flex-row justify-content-center align-items-center text-decoration-none mt-3 sidebar-logo" href="/">
                            <h3 className="ml-3 mb-0 text-white">Komputer Shop</h3>
                        </a>
                        <hr style={{borderColor:'white'}}/>
                        <div className="d-flex flex-row justify-content-center align-items-center sidebar-item">
                            <img src={this.props.avatar} className="rounded-circle" style={{width:62, height:62}} alt="avatar"/>
                            <div className="d-flex flex-column">
                                <p className="ml-3 mb-0 text-white">{this.props.name}</p>
                                <p className="ml-3 mb-0 text-white font-italic">Online</p>
                            </div>
                            <button onClick={this.toggle} className="ml-auto btn btn-outline-light tes">☰</button>
                        </div>
                        <hr style={{borderColor:'white'}}/>
                        <Link style={{display:this.state.display ? 'block' : ''}} className="text-decoration-none sidebar-item" to="/admin/dashboard"><i className="fa fa-fw fa-home"></i> Dashboard Admin</Link>
                        <Link style={{display:this.state.display ? 'block' : ''}} className="text-decoration-none sidebar-item" to ="/admin/manageProduct"><i className="fa fa-fw fas fa-tags"></i> Manage Products </Link>
                        <Link style={{display:this.state.display ? 'block' : ''}} className="text-decoration-none sidebar-item" to ="/admin/manageTransaction"><i className="fa-fw fas fa-dollar-sign"></i> Manage Transaction </Link>
                        <Link style={{display:this.state.display ? 'block' : ''}} className="text-decoration-none sidebar-item" to="/admin/manageUser"><i className="fa fa-fw fa-user"></i> Manage User</Link>
                        <hr style={{borderColor:'white'}}/>
                        <p onClick={this.onLogoutClick} className="sidebar-item" style={{cursor:'pointer', display:this.state.display ? 'block' : ''}}><i className="fas fa-sign-out-alt"></i> Logout</p>
                    </div>
                    <div>
                        <Route path = {this.props.match.path +'/dashboard'} component = {AdminDashboard}/>
                        <Route path = {this.props.match.path +'/manageProduct'} component = {ManageProduct}/>
                        <Route path = {this.props.match.path + '/manageTransaction'} component = {ManageTransaction}/>
                        <Route path = {this.props.match.path +'/manageUser'} component = {ManageUser}/>
                    </div>
                    {/* <Redirect to="/admin/dashboard"></Redirect> */}
                </div>
            )
        }else{
            return <Redirect to ="/"/>
        }
    }
}

const mapStateToProps = (state)=>{
    return {
        id: state.auth.id,
        username:state.auth.username,
        name: state.auth.name,
        avatar: state.auth.avatar
    }
}

export default connect(mapStateToProps)(Admin)
