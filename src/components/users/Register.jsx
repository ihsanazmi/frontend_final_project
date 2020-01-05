import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'

import axios from '../../config/axios';
import { Button, Form, FormGroup, Label, Input, FormFeedback, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';


class Register extends Component {

    state = {
        usernameValid : false,
        usernameInvalid: false,
        usernameEmpty: false,
        nameValid: false,
        nameEmpty:false,
        emailValid: false,
        emailInvalid: false,
        emailEmpty: false,
        phoneValid: false,
        phoneInvalid: false,
        phoneEmpty: false,
        passwordValid: false,
        passwordEmpty: false,
        confPasswordOK: false,
        confPasswordNOK: false,
        confPasswordEmpty: false,
        redirect: false
    }
    
    onRegisterClick = (event)=>{
        event.preventDefault()

        let {usernameInvalid, usernameEmpty, nameEmpty, phoneEmpty ,emailInvalid, confPasswordNOK} = this.state
        // console.log(usernameEmpty)
        if(usernameInvalid || usernameEmpty || nameEmpty || phoneEmpty || emailInvalid || confPasswordNOK){
            alert('Harap input form dengan benar')
            return
        }

        let _name = this.name.value
        let _username = this.username.value
        let _email = this.email.value
        let _phone = `62${this.phone.value.substr(1)}`
        let _password = this.password.value

        if(!_name || !_username || !_email || !_phone || !_password ){
            alert('Form tidak boleh kosong')
            if(!_name) this.setState({nameEmpty: true})
            if(!_username) this.setState({usernameEmpty: true})
            if(!_phone) this.setState({phoneEmpty: true})
            if(!_email) this.setState({emailEmpty: true})
            if(!_password) this.setState({})
            return
        }

        let _tanggal = new Date()
        _tanggal = moment(_tanggal).format('YYYY-MM-DD HH-mm-ss')
        // console.log(tanggal)

        axios.post(
            '/users',
            {
                name: _name,
                username: _username,
                email: _email,
                phone_number : _phone,
                role: "0",
                avatar : 'avatar_default.png',
                password: _password,
                registered_at: _tanggal
                
            }
        ).then((res)=>{
            // alert('registrasi berhasil')
            if(res.data.error){
                return alert(res.data.error)
            }

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Register berhasil',
                showConfirmButton: false,
                timer: 1000
              })
            this.setState({redirect: true})
        }).catch(err=>{
            console.log(err)
        })
    }

    cekName = ()=>{
        if(this.name.value){
            this.setState({
                nameValid: true,
                nameEmpty: false,
            })
        }else{
            this.setState({
                nameValid: false,
                nameEmpty: true
            })
        }
    }

    cekUsername = ()=>{
        let username = this.username.value

        if(!username){
            this.setState({usernameEmpty: true})
            return
        }

        axios.get(`/users/cekUsername/${username}`)
        .then(res=>{
            if(res.data.length === 0){
                this.setState({
                    usernameValid: true,
                    usernameInvalid: false,
                    usernameEmpty: false
                })
            }else{
                this.setState({
                    usernameValid: false,
                    usernameInvalid: true
                })
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    cekEmail = ()=>{
        let email = this.email.value
        if(!email){
            this.setState({
                emailEmpty: true,
            })
            return
        }

        axios.get(`/users/cekEmail/${email}`)
        .then(res=>{
            if(res.data.length === 0){
                this.setState({
                    emailValid: true,
                    emailInvalid: false,
                })
            }else{
                this.setState({
                    emailValid: false,
                    emailInvalid: true
                })
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    cekPhone = ()=>{
        let phone_number = this.phone.value
        if(!phone_number){
            this.setState({
                phoneEmpty: true,
                phoneValid: false
            })
        }else{
            this.setState({
                phoneEmpty: false,
                phoneValid: true,
            })
        }

        if(this.phone.value.substr(0,1) === '0'){
            this.setState({
                phoneInvalid: true,
                phoneValid: false,
            })
        }else if(this.phone.value.substr(0,1) !== '0'){
            this.setState({
                phoneInvalid: false,
                phoneValid: true,
            })
        }

        // console.log(this.phone.value.substr(0,1))
    }

    cekPassword = ()=>{
        let password = this.password.value
        if(!password){
            this.setState({
                passwordValid:false,
                passwordEmpty: true,
            })
        }else{
            this.setState({
                passwordValid: true,
                passwordEmpty: false
            })
        }
    }

    handleChangePhoneNumber = ()=>{
        let phone_number = this.phone.value
        this.phone.value = phone_number.match(/^-?\d*$/)
    }

    handleConfirmPassword = ()=>{
        let password = this.password.value
        let confirm_password = this.confPassword.value

        if(!confirm_password){
            this.setState({
                confPasswordOK: false,
                confPasswordEmpty: false,
            })
            return
        }

        if(confirm_password !== password){
            this.setState({
                confPasswordNOK: true,
                confPasswordOK: false
            })
        }else{
            this.setState({
                confPasswordOK: true,
                confPasswordNOK: false
            })
        }
    }

    render() {
        if(!this.props.username){
            if(this.state.redirect){
                return <Redirect to="/login"/>
            }
            return (
                <div className="">
                    <div className="col-6 mx-auto mt-3 card">
                        <div className="card-body">
                            <div className="border-bottom border-secondary card-title">
                                <h1>REGISTER</h1>
                            </div>
                            <Form onSubmit={this.onRegisterClick}>
                                <FormGroup>
                                    <Label for="name">Name</Label>
                                    <Input onBlur={this.cekName} invalid={this.state.nameEmpty} valid={this.state.nameValid} maxLength={30} innerRef={(input)=>{this.name = input}} type="text" id="name" placeholder="Masukan Nama Lengkap" />
                                    <FormFeedback invalid={this.state.nameEmpty}>Nama Harus diisi</FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="username">Username</Label>
                                    <Input maxLength={30} invalid = {this.state.usernameInvalid || this.state.usernameEmpty} valid={this.state.usernameValid} onBlur={this.cekUsername} innerRef={(input)=>{this.username = input}} type="text" id="username" placeholder="Masukan username" />
                                    <FormFeedback invalid={this.state.usernameInvalid || this.state.usernameEmpty}>{this.state.usernameEmpty? 'Username Tidak boleh kosong' : 'Username sudah ada'}</FormFeedback>
                                    {/* <FormFeedback invalid={this.state.usernameEmpty}>Username Harus diisi</FormFeedback> */}
                                </FormGroup>
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input maxLength={30} onBlur={this.cekEmail} invalid={this.state.emailInvalid || this.state.emailEmpty} valid = {this.state.emailValid} innerRef={(input)=>{this.email = input}} type="email" id="email" placeholder="Masukan Email" />
                                    <FormFeedback invalid={this.state.usernameInvalid || this.state.emailEmpty}>{this.state.emailEmpty ? 'Email tidak boleh kosong' : 'Email Sudah ada'}</FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="phone">Phone Number</Label>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                        <InputGroupText>+62</InputGroupText>
                                        </InputGroupAddon>
                                        <Input valid = {this.state.phoneValid} invalid={this.state.phoneEmpty || this.state.phoneInvalid} onBlur={this.cekPhone} maxLength={14} onChange={this.handleChangePhoneNumber} innerRef={(input)=>{this.phone = input}} type="text" id="phone" placeholder="81122334455" />
                                        <FormFeedback invalid={this.state.phoneEmpty || this.state.phoneInvalid}>{this.state.phoneInvalid? 'Angka pertama tidak boleh diisi dengan 0' : 'Nomor Telepon tidak boleh kosong'}</FormFeedback>
                                    </InputGroup>
                                </FormGroup>
                                {/* <FormGroup>
                                    <Label for="phone">Phone Number</Label>
                                    
                                </FormGroup> */}
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input onBlur={this.cekPassword} valid = {this.state.passwordValid} invalid={this.state.passwordEmpty} innerRef={(input)=>{this.password = input}} type="password" name="password" id="password" placeholder="Password" />
                                    <FormFeedback invalid={this.state.passwordEmpty}>Password harus diisi</FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="confirmPassword">Confirm Password</Label>
                                    <Input invalid={this.state.confPasswordNOK || this.state.confPasswordEmpty} valid={this.state.confPasswordOK} onBlur={this.handleConfirmPassword} innerRef={(input)=>{this.confPassword = input}} type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm password" />
                                    <FormFeedback invalid={this.state.confPasswordNOK || this.state.confPasswordEmpty}>Password Belum sesuai</FormFeedback>
                                </FormGroup>
                                <Button onClick={this.onRegisterClick} className="btn-block btn-danger">Register</Button>
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

export default connect(mapStateToProps, {})(Register)
