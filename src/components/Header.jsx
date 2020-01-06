import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {logOut} from '../actions/index'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button } from 'reactstrap'

export class Header extends Component {

    state = {
        isOpen: false,
    }

    toggle = ()=>{
        this.setState({isOpen:!this.state.isOpen})
    }

    renderRole = ()=>{
        if(this.props.role === "1"){
            return(
                <a className="text-decoration-none" href="/admin" >
                    <DropdownItem>Admin <i className="far fa-check-circle"/></DropdownItem>
                </a>
            )
        }
    }

    renderNavigation = ()=>{
        if(!this.props.username){
            return(
                <Nav className="ml-auto text-dark" navbar>
                    <NavItem>
                        <NavLink className="nav-link" tag = {Link} to = "/cart">
                            <button className=" nav-link btn btn-block"><i className="fas fa-shopping-cart fa-lg "></i></button>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag = {Link} className="nav-link" to ="/login">
                            <button className="btn btn-block btn-outline-success">Masuk</button>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag = {Link} className="nav-link" to ="/register">
                            <button className="btn btn-block btn-outline-info">Daftar</button>
                        </NavLink>
                    </NavItem>
                </Nav>
            )
        }
        let localData = JSON.parse(localStorage.userdata)
        let avatar = localData.avatar
        let username = localData.username
        return(
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <NavLink className="nav-link" tag = {Link} to = "/cart">
                        <button className="nav-link btn btn-block"><i className="fas fa-shopping-cart fa-lg "></i></button>
                    </NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                <DropdownToggle className="text-center" nav caret>
                        <img src={avatar} className="rounded-circle " style={{width:38, height:38}} alt="img"/><span> {username}</span>
                </DropdownToggle>
                <DropdownMenu right>
                    <NavLink tag = {Link} to="/profile">
                        <DropdownItem>Profile</DropdownItem>
                    </NavLink>
                    <NavLink tag = {Link} to="/pembelian">
                        <DropdownItem>Pembelian</DropdownItem>
                    </NavLink>
                    <DropdownItem divider />
                        {this.renderRole()}
                    <DropdownItem divider />
                    <Button className="dropdown-item" onClick={this.props.logOut}>Logout</Button>
                </DropdownMenu>
                </UncontrolledDropdown>
            </Nav>
        )
    }

    render() {

        let str = window.location.pathname
        let res = str.split("/")
        if(res.includes("admin")){
            return null
        }

        return (
            <div>
                <Navbar  color="light" style={{height:'5vh'}} light expand = {true}>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink tag = {Link} className="" to ="/login">
                                Tentang Toko Kami
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag = {Link} className="nav-link" to ="/register">
                                Bantuan
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                <Navbar style={{boxShadow:"0 4px 6px -1px rgba(116,222,128,0.55)"}} color="white" className="" light expand= "md">
                    <Link to="/" className="navbar-brand">Komputer Shop</Link>
                    <NavbarToggler className="mb-2" onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        {this.renderNavigation()}
                    </Collapse>
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        id: state.auth.id,
        username: state.auth.username,
        role: state.auth.role,
        avatar: state.auth.avatar
    }
}

export default connect(mapStateToProps, {logOut})(Header)
