import React, { Component } from 'react'
import axios from '../../config/axios'
import { isNull } from 'util'
import {connect} from 'react-redux'
import Swal from 'sweetalert2'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import {InputText} from 'primereact/inputtext';
import moment from 'moment'

class TabBiodata extends Component {

    state={
        profile: null,
        file_name : '',
        modal2: false,
    }

    componentDidMount(){
        this.getUser()
    }

    getUser = ()=>{
        axios.get(`/users/profile/${this.props.id}`)
        .then(res=>{
            this.setState({
                profile: res.data
            })
        }).catch(err=>{
            console.log(err)
        })
    }

    placeFilename = ()=>{
        this.setState({
            file_name: this.avatar.files[0].name
        })
    }

    // OPEN MODAL EDIT BIODATA
    toggle2 = ()=>{
        this.setState({
            modal2: !this.state.modal2
        })
    }

    // EDIT BIODATA
    onSaveBiodataClick = ()=>{

        let name = document.getElementById('nameInput').value
        let username = document.getElementById('usernameInput').value
        let email = document.getElementById('emailInput').value
        let phone_number = document.getElementById('phoneInput').value
        let password = document.getElementById('passwordInput').value
        let updated_at = new Date()
        updated_at = moment(updated_at).format('YYYY-MM-DD HH-mm-ss')

        const data = {name, username, email, phone_number, updated_at}

        if(password) data.password = password

        if(!name || !username || !email || !phone_number){
            return(
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Tidak boleh ada yang kosong kecuali password',
                    showConfirmButton: false,
                    timer: 1000
                  })
            )
        }

        axios.patch(`/users/update/${this.props.id}`, data)
        
            .then((res)=>{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Biodata berhasil diubah',
                    showConfirmButton: false,
                    timer: 1000
                  })
                  this.getUser()
                  this.setState({
                      modal2: !this.state.modal2
                  })
                console.log(res.data)
            }).catch((err)=>{
                console.log(err)
            })
    }

    // UPLOAD AVATAR
    onUpload = ()=>{
        let formData = new FormData()
        let avatar = this.avatar.files[0]
        formData.append("avatar", avatar)
        console.log(avatar)
        axios.post(`/avatar/${this.props.username}`, formData)
            .then((res)=>{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Avatar berhasil diubah',
                    showConfirmButton: false,
                    timer: 1000
                })
                this.getUser()
                this.setState({file_name: ''})
            }).catch((err)=>{
                console.log(err)
            })
    }

    render() {

        if(!isNull(this.state.profile)){

            let {name, username, email, phone_number, avatar} = this.state.profile
            let localData = JSON.parse(localStorage.userdata)
                // console.log(this.state.profile.avatar)
            localData.avatar = this.state.profile.avatar
            localData.username = this.state.profile.username
            localStorage.setItem("userdata", JSON.stringify(localData))

            return (
                <div className="row mt-3">
                    <div className="col-12 col-md-4">
                        <div className="card bg-light mb-3 mx-auto shadow" style={{maxWidth:"18rem"}}>
                            <div className="card-header">Foto Profile</div>
                            <div className="card-body">
                                <center>
                                    <img style={{width:170, height:170}} className="card-img-top rounded-circle" src={avatar} alt="img"/>
                                </center>
                                <p className="text-muted font-weight-lighter mt-3 mb-0">Besar file: Maksimal 2 Megabytes</p>
                                <p className="text-muted font-weight-lighter my-0">Ekstensi file yang diperbolehkan: JPG</p>
                                <div className="custom-file mt-3">
                                    <input onChange={this.placeFilename} ref={(input)=>{this.avatar = input}} type="file" className="custom-file-input" id="customFileLangHTML"/>
                                    <label className="custom-file-label" htmlFor="customFileLangHTML" data-browse="Browse">{this.state.file_name ? this.state.file_name : 'Pilih Foto'}</label>
                                </div>
                                <button onClick={this.onUpload} className="btn btn-block btn-outline-dark mt-3">Save Foto</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="card shadow">
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="col-3">Informasi Umum</th>
                                            <th className="text-right"><button onClick={this.toggle2} className="btn btn-outline-dark"><i className="far fa-edit"></i>Edit</button></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="font-weight-bold">Nama</td>
                                            <td>{name}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-weight-bold">Username</td>
                                            <td>{username}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-weight-bold">Email</td>
                                            <td>{email}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-weight-bold">Nomor Telephone</td>
                                            <td>{phone_number}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Modal isOpen={this.state.modal2} toggle={this.toggle2}>
                        <ModalHeader toggle={this.toggle2}>Edit Profile</ModalHeader>
                        <ModalBody>
                            <form className="form-row">
                                <div className="form-group col-12 mt-3">
                                    <span className="p-float-label">
                                        <InputText maxLength={30} ref={(input)=>{this.name = input}} id="nameInput" type="text" className="w-100" defaultValue={name} />
                                        <label htmlFor="nameInput">Nama</label>
                                    </span>
                                </div>
                                <div className="form-group col-12 mt-3">
                                    <span className="p-float-label">
                                        <InputText maxLength={30} id="emailInput" type="text" className="w-100" defaultValue={email} />
                                        <label htmlFor="emailInput">Email</label>
                                    </span>
                                </div>
                                <div className="form-group col-12 mt-3">
                                    <span className="p-float-label">
                                        <InputText keyfilter="pnum" maxLength={14} id="phoneInput" type="text" className="w-100" defaultValue={phone_number} />
                                        <label htmlFor="phoneInput">Nomor Telephone</label>
                                    </span>
                                </div>
                                <div className="form-group col-12 mt-3">
                                    <span className="p-float-label">
                                        <InputText id="passwordInput" type="password" className="w-100" />
                                        <label htmlFor="passwordInput">Password</label>
                                    </span>
                                </div>
                                
                            </form>
                        </ModalBody>
                        <ModalFooter>
                        <Button color="primary" onClick={this.onSaveBiodataClick}>Save</Button>{' '}
                        <Button color="secondary" onClick={this.toggle2}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            )
        }else{
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }
    }
}

const mapStateToProps = (state)=>{
    return{
        id: state.auth.id,
        username: state.auth.username,
        name: state.auth.name,
        phone_number: state.auth.phone_number
    }
}

export default connect(mapStateToProps)(TabBiodata)
