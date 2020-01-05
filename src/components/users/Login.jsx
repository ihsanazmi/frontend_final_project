import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {sendData} from '../../actions/index'
import axios from '../../config/axios'

import { Button, Form, FormGroup, Label, Input } from 'reactstrap';



 class Login extends Component {


    onLoginClick = (event)=>{
        event.preventDefault()
        let _email = this.email.value
        let _password = this.password.value
        
        axios.post('/users/login', 
            {
                email : _email,
                password: _password
            }
        ).then((res)=>{
            if(res.data.error){
                return alert(res.data.error)
            }

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
                <div>
                    <div className="col-6 mx-auto mt-3 card" style={{minWidth:300}}>
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
                                
                                <Button onClick={this.onLoginClick} className="btn-block btn-info">Login</Button>
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
