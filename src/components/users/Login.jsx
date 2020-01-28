import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {sendData} from '../../actions/index'
import axios from '../../config/axios'

import { Button, Form, FormGroup, Label, Input } from 'reactstrap';



 class Login extends Component {

    state={
        loading: false
    }

    onLoginClick = (event)=>{
        this.setState({loading: true})
        event.preventDefault()
        let _email = this.email.value
        let _password = this.password.value
        
        axios.post('/users/login', 
            {
                email : _email,
                password: _password
            }
        ).then((res)=>{
            this.setState({loading:false})
            if(res.data.error){
                return alert(res.data.error)
            }
            // console.log(res.data)

            let {username, id, role, avatar, name, phone_number} = res.data
            localStorage.setItem('userdata', JSON.stringify({username, id, role, avatar, name, phone_number}))
            this.props.sendData(username, id, role, avatar, name, phone_number)

        }).catch(err =>{
            console.log({err})
        })

    }

    render() {
        if(!this.props.username){
            return (
                <div className="main-content">
                    <div className="col-md-6 col-11 mx-auto mt-5 card">
                        <div className="card-body">
                            <div className="border-bottom border-secondary card-title">
                                <h1>LOGIN</h1>
                            </div>
                            <Form onSubmit={this.onLoginClick}>
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input innerRef={(input)=>{this.email = input}} type="text" id="email" placeholder="Masukan email" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input innerRef={(input)=>{this.password = input}} type="password" name="password" id="password" placeholder="Password" />
                                </FormGroup>
                                {this.state.loading ? <button class="btn btn-info btn-block text-center" type="button" disabled><span class="spinner-border spinner-border-sm text-center" role="status" aria-hidden="true"></span>Loading...</button> : <Button onClick={this.onLoginClick} className="btn btn-block btn-info">Login</Button>}
                                
                            </Form>
                        </div>
                    </div>
                </div>
            )
        }else{
           return <Redirect to="/"/>
        }
    }
}

const mapStateToProps = (state)=>{
    return{
        username: state.auth.username
    }
}

export default connect(mapStateToProps,{sendData})(Login)
