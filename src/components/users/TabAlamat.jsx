import React, { Component } from 'react'
import {connect} from 'react-redux'
import axios from '../../config/axios'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {InputText} from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import {AutoComplete} from 'primereact/autocomplete';
import Swal from 'sweetalert2'
import moment from 'moment'

class TabAlamat extends Component {

    state = {
        userAddress: [],
        allKodepos:[],
        modal_address: false,
        modal_edit_address: false,
        // Proses Search kecamatan pada modal input alamat
        filteredKecamatan: null,        // object berisi {id, kecamatan, kabupaten, provinsi}
        kecamatan: null,                // PARONGPONG  
        kodepos: '',                    // 40599
        inputDaerahPengiriman: '',      // Kec. parongpong, bandung barat, jawa barat
        inputIdKodepos: '',             // 2068
        // Proses Search kecamatan pada modal edit alamat
        editFilteredKecamatan : null,   // object berisi {id, kecamata, kabupaten, provinsi}
        editKecamatan: null,            // KOJA
        editKodepos: '',                // 14210
        editDaerahPengiriman: '',       // Kec. koja, jakarta utara, jawa barat
        editIdKodepos: '',              // 38,
        editPenerima: '',
        editPhoneNumber: '',
        editAlamat: '',
        selectedIdPenerima: '',
    }

    componentDidMount(){
        this.getUserAddress()
        this.getAllKodepos()
    }

    getUserAddress = ()=>{
        axios.get(`/users/address/${this.props.id}`)
        .then(res=>{
            this.setState({
                userAddress: res.data
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }

    getAllKodepos = ()=>{
        axios.get('/kodepos')
        .then((res)=>{
            this.setState({
                allKodepos: res.data
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }

    getKodepos = (e)=>{
        if(e.kecamatan !== undefined){
            this.setState({
                kodepos: e.kodepos,
                inputDaerahPengiriman: `Kec. ${e.kecamatan.toLowerCase()}, ${e.kabupaten.toLowerCase()}, Prov. ${e.provinsi.toLowerCase()} `,
                inputIdKodepos: e.id
            })
        }
    }

    getEditKodepos = (e)=>{
        if(e.kecamatan !== undefined){
            this.setState({
                editKodepos: e.kodepos,
                editIdKodepos: e.id,
                editDaerahPengiriman: `Kec. ${e.kecamatan.toLowerCase()}, ${e.kabupaten.toLowerCase()}, Prov. ${e.provinsi.toLowerCase()} `
            })
        }
    }

    filterKecamatan = (event)=> {
        setTimeout(() => {
            var results = this.state.allKodepos.filter((address) => {
                return address.kecamatan.toLowerCase().startsWith(event.query.toLowerCase());
            })
            this.setState({ 
                filteredKecamatan: results
            })
        }, 250)
    }

    editFilterKecamatan = (event)=>{
        setTimeout(() => {
            var results = this.state.allKodepos.filter((address) => {
                return address.kecamatan.toLowerCase().startsWith(event.query.toLowerCase());
            })
            this.setState({ 
                editFilteredKecamatan: results
            })
        }, 250)
    }

    // OPEN MODAL TAMBAH ALAMAT PENGIRIMAN
    toggle_add_address = ()=>{
        this.setState({
            modal_address: !this.state.modal_address
        })
    }

    // OPEN MODAL EDIT ALAMAT PENGIRIMAN
    toggle_edit_address = (id, penerima, phone_number, alamat_pengiriman, id_penerima)=>{
        let searchAddress = this.state.allKodepos.filter((address)=>{
            return address.id === id
        })
        // console.log(searchAddress[0].id)
        this.setState({
            modal_edit_address: !this.state.modal_edit_address,
            editKecamatan: searchAddress[0].kecamatan,
            editDaerahPengiriman: `Kec. ${searchAddress[0].kecamatan.toLowerCase()}, ${searchAddress[0].kabupaten.toLowerCase()}, Prov. ${searchAddress[0].provinsi.toLowerCase()}`,
            editKodepos: searchAddress[0].kodepos,
            editIdKodepos: searchAddress[0].id,
            editPenerima: penerima,
            editPhoneNumber: phone_number,
            editAlamat: alamat_pengiriman,
            selectedIdPenerima: id_penerima
        })
    }
// TUTUP MODAL EDIT ALAMAT PENGIRIMAN
    toggle_close_edit_address = ()=>{
        this.setState({
            modal_edit_address: !this.state.modal_edit_address
        })
    }

    // TAMBAH ALAMAT PENGIRIMAN
    onTambahAlamatClick = ()=>{
        let user_id = this.props.id
        let penerima = document.getElementById('inputPenerima').value
        let phone_number = document.getElementById('inputHpPenerima').value
        let daerah_pengiriman = this.state.inputDaerahPengiriman
        let alamat_pengiriman = document.getElementById('alamat').value
        let kodepos_id = this.state.inputIdKodepos
        let status_active = "1"
        let create_at = new Date()
        create_at = moment(create_at).format('YYYY-MM-DD HH-mm-ss')

        const data = {user_id, penerima, phone_number, daerah_pengiriman, alamat_pengiriman, kodepos_id, status_active, create_at}

        if(!penerima || !phone_number || !alamat_pengiriman){
            return(
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Alamat tujuan harus diisi lengkap',
                    showConfirmButton: false,
                    timer: 1000
                })
            )
        }

        axios.post(`/address`, data)
        .then(res=>{
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Alamat baru berhasil ditambahkan',
                showConfirmButton: false,
                timer: 1000
            })
            this.setState({
                modal_address: !this.state.modal_address
            })
            this.getUserAddress()
        }).catch(err=>{
            console.log(err)
        })
    }

    // EDIT ALAMAT PENGIRIMAN
    onEditAlamatClick = (id)=>{
        let penerima = document.getElementById('editPenerima').value
        let phone_number = document.getElementById('editHpPenerima').value
        let daerah_pengiriman = this.state.editDaerahPengiriman
        let alamat_pengiriman = document.getElementById('editAlamat').value
        let kodepos_id = this.state.editIdKodepos
        let updated_at = new Date()
        updated_at = moment(updated_at).format('YYYY-MM-DD HH-mm-ss')
        const data = {penerima, phone_number, daerah_pengiriman, alamat_pengiriman, kodepos_id, updated_at}

        if(!penerima || !phone_number || !alamat_pengiriman || !kodepos_id){
            return (
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Alamat tujuan harus diisi semua',
                    showConfirmButton: false,
                    timer: 1000
                })
            )
        }

        axios.patch(`/address/update/${id}`, data)
        .then(res=>{
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Alamat berhasil diubah',
                showConfirmButton: false,
                timer: 1000
            })
            this.setState({
                modal_edit_address : !this.state.modal_edit_address
            })
            this.getUserAddress()
        }).catch(err=>{
            console.log(err)
        })
    }

    // HAPUS ALAMAT PENGIRIMAN
    deleteAddress = (id)=>{
        Swal.fire({
            title: 'Hapus alamat dari daftar alamat?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus alamat'
        }).then((result) => {
            if (result.value) {
                axios.delete(`/address/delete/${id}` )
                .then(res=>{
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Alamat pengiriman berhasil dihapus',
                        showConfirmButton: false,
                        timer: 1000
                      })
                    this.getUserAddress()
                }).catch(err=>{
                    console.log(err)
                })
            }
        })
    }

    handleOptionChange = (id)=>{ 
        Swal.fire({
            title: 'Jadikan sebagai alamat utama?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, jadi alamat utama'
        }).then((result) => {
            if (result.value) {
                axios.patch(`/users/address/update/${id}/${this.props.id}` )
                .then(res=>{
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Berhasil mengubah alamat utama',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    this.getUserAddress()
                }).catch(err=>{
                    console.log(err)
                })
            }
        })
    }

    renderTableUserAddress = ()=>{
        let hasilRender =  this.state.userAddress.map((item)=>{
            return(
                <tr key={item.id} className="text-center">
                    <td><input type="radio" name="utama" id="utama" onChange={()=>{this.handleOptionChange(item.id)}} checked={item.status_active === "1" ? true : false}/></td>
                    <td>{item.penerima}</td>
                    <td>{item.phone_number}</td>
                    <td>{item.alamat_pengiriman}, {item.daerah_pengiriman}</td>
                    <td>
                        <button onClick={()=>{this.toggle_edit_address(item.kodepos_id, item.penerima, item.phone_number, item.alamat_pengiriman, item.id)}} className="btn btn-light "><i className="far fa-edit"></i> Edit</button>
                        <button onClick={()=>{this.deleteAddress(item.id)}} className="btn btn-light ml-2"><i className="fas fa-trash"></i> Hapus</button>
                    </td>
                </tr>
            )
        })
        return hasilRender
    }

    render() {
        if(this.state.userAddress.length === 0){
            return (
                <div className="mt-3 mb-3">
                    <center>
                        <h1 className="display-4">Belum ada Alamat yang diisi</h1>
                        <button onClick={this.toggle_add_address} className="btn btn-success"><i className="fas fa-plus"></i> Tambah Alamat</button>
                    </center>
                    <Modal isOpen={this.state.modal_address} toggle={this.toggle_add_address}>
                    <ModalHeader toggle={this.toggle_add_address}>Tambah Alamat</ModalHeader>
                    <ModalBody>
                        <form className="form-row">
                            
                            <div className="form-group col-12 col-md-6 mt-3">
                                <span className="p-float-label">
                                    <InputText defaultValue={this.props.name} id="inputPenerima" type="text" />
                                    <label htmlFor="float-input">Nama Penerima</label>
                                </span>
                            </div>
                            <div className="form-group col-12 col-md-6 mt-3">
                                <span className="p-float-label">
                                    <InputText keyfilter="pnum" defaultValue={this.props.phone_number} id="inputHpPenerima" type="text" />
                                    <label htmlFor="float-input">No Handphone</label>
                                </span>
                            </div>
                            <div className="form-group col-12 col-md-8">
                                <label htmlFor="kecamatan">Kota atau Kecamatan</label>
                                <AutoComplete id="kecamatan" value={this.state.kecamatan} suggestions={this.state.filteredKecamatan} completeMethod={this.filterKecamatan} field="kecamatan" size={30} placeholder="Kecamatan" minLength={1} onChange={(e) => {
                                    this.setState({kecamatan: e.value})
                                    this.getKodepos (e.value)   
                                }
                                } />
                            </div>
                            <div className="form-group col-12 col-md-4 mt-4 pt-2">
                                <span className="p-float-label">
                                    <InputText id="inputKodepos" readOnly value={this.state.kodepos} placeholder="Kode Pos" type="text" className="w-75"/>
                                    
                                </span>
                            </div>

                            <div className="form-group col-12 mt-2">
                                <label htmlFor="alamat">Alamat</label>
                                <InputTextarea id="alamat" rows={5} className="w-100" autoResize={true}></InputTextarea>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={this.onTambahAlamatClick}>Tambah</Button>{' '}
                    <Button color="secondary" onClick={this.toggle_add_address}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                </div>
            )
        }
        return (
            <div className="mt-3">
                <button onClick={this.toggle_add_address} className="btn btn-success"><i className="fas fa-plus"></i> Tambah Alamat</button>
                <table className="table table-hover table-responsive mt-2">
                    <thead>
                        <tr className="text-center">
                            <th></th>
                            <th>Penerima</th>
                            <th>Nomor Telepon</th>
                            <th className="col-3">Alamat Pengiriman</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTableUserAddress()}
                    </tbody>
                </table>
                <Modal isOpen={this.state.modal_address} toggle={this.toggle_add_address}>
                    <ModalHeader toggle={this.toggle_add_address}>Tambah Alamat</ModalHeader>
                    <ModalBody>
                        <form className="form-row">
                            
                            <div className="form-group col-12 col-md-6 mt-3">
                                <span className="p-float-label">
                                    <InputText defaultValue={this.props.name} id="inputPenerima" type="text" />
                                    <label htmlFor="float-input">Nama Penerima</label>
                                </span>
                            </div>
                            <div className="form-group col-12 col-md-6 mt-3">
                                <span className="p-float-label">
                                    <InputText keyfilter="pnum" defaultValue={this.props.phone_number} id="inputHpPenerima" type="text" />
                                    <label htmlFor="float-input">No Handphone</label>
                                </span>
                            </div>
                            <div className="form-group col-12 col-md-8">
                                <label htmlFor="kecamatan">Kota atau Kecamatan</label>
                                <AutoComplete id="kecamatan" value={this.state.kecamatan} suggestions={this.state.filteredKecamatan} completeMethod={this.filterKecamatan} field="kecamatan" size={30} placeholder="Kecamatan" minLength={1} onChange={(e) => {
                                    this.setState({kecamatan: e.value})
                                    this.getKodepos (e.value)   
                                }
                                } />
                            </div>
                            <div className="form-group col-12 col-md-4 mt-4 pt-2">
                                <span className="p-float-label">
                                    <InputText id="inputKodepos" readOnly value={this.state.kodepos} placeholder="Kode Pos" type="text" className="w-75"/>
                                    
                                </span>
                            </div>

                            <div className="form-group col-12 mt-2">
                                <label htmlFor="alamat">Alamat</label>
                                <InputTextarea id="alamat" rows={5} className="w-100" autoResize={true}></InputTextarea>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={this.onTambahAlamatClick}>Tambah</Button>{' '}
                    <Button color="secondary" onClick={this.toggle_add_address}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modal_edit_address} toggle={this.toggle_close_edit_address}>
                    <ModalHeader toggle={this.toggle_close_edit_address}>Edit Alamat</ModalHeader>
                    <ModalBody>
                        <form className="form-row">
                            
                            <div className="form-group col-12 col-md-6 mt-3">
                                <span className="p-float-label">
                                    <InputText defaultValue={this.state.editPenerima} id="editPenerima" type="text" />
                                    <label htmlFor="float-input">Nama Penerima</label>
                                </span>
                            </div>
                            <div className="form-group col-12 col-md-6 mt-3">
                                <span className="p-float-label">
                                    <InputText keyfilter="pnum" defaultValue={this.state.editPhoneNumber} id="editHpPenerima" type="text" />
                                    <label htmlFor="float-input">No Handphone</label>
                                </span>
                            </div>
                            <div className="form-group col-12 col-md-8">
                                <label htmlFor="kecamatan">Kota atau Kecamatan</label>
                                <AutoComplete id="kecamatan" value={this.state.editKecamatan} suggestions={this.state.editFilteredKecamatan} completeMethod={this.editFilterKecamatan} field="kecamatan" size={30} placeholder="Kecamatan" minLength={1} onChange={(e) => {
                                    this.setState({editKecamatan: e.value})
                                    this.getEditKodepos (e.value)   
                                }
                                } />
                            </div>
                            <div className="form-group col-12 col-md-4 mt-4 pt-2">
                                <span className="p-float-label">
                                    <InputText id="inputKodepos" readOnly value={this.state.editKodepos} placeholder="Kode Pos" type="text" className="w-75"/>
                                    
                                </span>
                            </div>

                            <div className="form-group col-12 mt-2">
                                <label htmlFor="alamat">Alamat</label>
                                <InputTextarea defaultValue={this.state.editAlamat} id="editAlamat" rows={5} className="w-100" autoResize={true}></InputTextarea>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={()=>{this.onEditAlamatClick(this.state.selectedIdPenerima)}}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.toggle_close_edit_address}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
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

export default connect(mapStateToProps)(TabAlamat)
