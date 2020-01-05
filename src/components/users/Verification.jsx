import React, { Component } from 'react'
import axios from '../../config/axios'
import Swal from 'sweetalert2'
import {Redirect} from 'react-router-dom'
import {Spinner} from 'reactstrap'

class Verification extends Component {

    state={
        name : '',
        username: '',
        redirect: false
    }

    componentDidMount(){
        this.getDataUser()
    }

    getDataUser = ()=>{
        let username = this.props.match.params.username
        axios.get(`/users/getDataUser/${username}`)
        .then(res=>{
            this.setState({
                name: res.data[0].name,
                username: username
            })
            console.log(res.data[0].name)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    verification = (username)=>{
        axios.get(`/verification/${username}`)
        .then(res=>{
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Email berhasil diverifikasi',
                showConfirmButton: false,
                timer: 1000
            })
            this.setState({redirect: true})
        })  
        .catch(err=>{
            console.log(err)
        })
    }

    render() {
        if(this.state.name === ''){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }
        if(this.state.redirect){
            return <Redirect to="/login"/>
        }
        return (
            <div className="pt-5">
                <div className="mt-2 container">
                    <center>
                        <p>Selamat Datang {this.state.name}</p>
                        <p>Untuk dapat berbelanja di toko ini, harap registrasi email terlebih dahulu.</p>
                        <p>Dengan cara mengklik tombol Verifikasi dibawah ini</p>
                        <button onClick={()=>{this.verification(this.state.username)}} className="btn btn-info">Verifikasi</button>
                    </center>
                </div>
                
            </div>
        )
    }
}

export default Verification
