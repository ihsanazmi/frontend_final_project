import React, { Component } from 'react'
import Footer from '../Footer'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from '../../config/axios'
import logo from '../../img/mandiri-logo.png'
import moment from 'moment'
import Swal from 'sweetalert2'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap'
import {InputText} from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import {AutoComplete} from 'primereact/autocomplete';

class Checkout extends Component {

    state = {
        totalItem: '',
        grandTotal: '',
        address: null,
        productCart: null,
        modalAddress: false,
        allAddress: null,
        allKodepos:[],
        filteredKecamatan: null,        // object berisi {id, kecamatan, kabupaten, provinsi}
        kecamatan: null,                // PARONGPONG  
        kodepos: '',
        inputDaerahPengiriman: '',      // Kec. parongpong, bandung barat, jawa barat
        inputIdKodepos: '', 
        redirect: false,            // 2068 
        modalNew: false,
        stock : true,
    }

    componentDidMount(){
        this.getCart()
        this.getAddres()
        this.getAllAddress()
        this.getAllKodepos()
    }

    getCart = ()=>{
        let customer_id = this.props.id
        axios.get(`/cart/getAll/${customer_id}`)
        .then(res=>{
            let grandTotal = 0
            let totalItem = 0
            let stock_available = true
            res.data.map((val)=>{
                grandTotal = (val.qty * val.price) + parseInt(grandTotal)
                totalItem = parseInt(totalItem) + val.qty
                if(val.stock === 0){
                    stock_available = false
                }
                return res.data
            })
            this.setState({
                productCart: res.data,
                totalItem: totalItem,
                grandTotal: grandTotal,
                stock: stock_available
            })
        })
    }

    getAddres = ()=>{
        let customer_id = this.props.id
        axios.get(`/users/addresActive/${customer_id}`)
        .then(res=>{
            this.setState({address: res.data})
            // console.log(res.data)
        })
    }

    getAllAddress = ()=>{
        let customer_id = this.props.id
        axios.get(`/users/address/${customer_id}`)
        .then(res=>{
            this.setState({
                allAddress: res.data
            })
            // console.log(res.data)
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
        }).catch(err=>{
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
        // console.log(this.state.inputDaerahPengiriman)
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
    
    addAddress = ()=>{
        this.setState({nestedModal: !this.state.nestedModal})
    }

    updateAddress = (id_address)=>{
        let userid = this.props.id
        axios.patch(`/users/address/update/${id_address}/${userid}`)
        .then(res=>{
            Swal.fire({
                position: 'center',
                icon: 'info',
                title: 'Berhasil mengubah alamat utama',
                showConfirmButton: false,
                timer: 1000
            })
            this.getAddres()
            this.getAllAddress()
            console.log(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    saveAddress = ()=>{
        let user_id = this.props.id
        let penerima = document.getElementById('inputPenerima').value
        let phone_number = document.getElementById('inputHpPenerima').value
        let daerah_pengiriman = this.state.inputDaerahPengiriman
        let alamat_pengiriman = document.getElementById('alamat').value
        let kodepos_id = this.state.inputIdKodepos
        let status_active = "1"
        let create_at = new Date()
        create_at = moment(create_at).format('YYYY-MM-DD HH-mm-ss')

        if(!penerima || !phone_number || !daerah_pengiriman || !alamat_pengiriman || !kodepos_id){
            return(
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Form harus diisi Semua',
                    showConfirmButton: false,
                    timer: 1000
                })
            )
        }

        const data = {
            user_id, penerima, phone_number, daerah_pengiriman, alamat_pengiriman, kodepos_id, status_active, create_at
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
            this.getAllAddress()
            this.getAddres()
            this.setState({
                nestedModal: !this.state.nestedModal,
                modalAddress: false,
            })
            // this.getUserAddress()
        }).catch(err=>{
            console.log(err)
        })
    }

    renderAlamat = ()=>{
        let alamatRender = this.state.allAddress.map((val)=>{
            let color 
            let status
            let border
            if(val.status_active === '1'){
                color = '#d6ffde'
                status = 'Utama'
                border = 'rgb(156, 229, 162)'
            }else{
                color = 'transparent' 
                status = ''
                border = 'grey'
            }
            return(
                <div key={val.id} className="rounded my-2" style={{border: `1px solid ${border}`}}>
                    <div className="p-4">
                        <div className="d-flex flex-row">
                            <p className="font-weight-bold mb-0">{val.penerima}</p> 
                            <p className=" ml-3 mb-0 px-3 my-auto rounded-pill" style={{backgroundColor:color}}>{status}</p>
                        </div>
                        <p>{val.phone_number}</p>
                        <p className="mb-0">{val.alamat_pengiriman}</p>
                        <p>{val.daerah_pengiriman}</p>
                        {val.status_active !== '1' ? <button onClick={()=>{this.updateAddress(val.id)}} className="btn btn-outline-info">Pilih Sebagai Alamat Utama</button> : ''}
                    </div>
                </div>
            )
        })
        return alamatRender
    }

    toggle_modal = ()=>{
        this.setState({modalAddress: !this.state.modalAddress})
    }

    addNew = ()=>{
        this.setState({modalAddress: !this.state.modalAddress})
    }

    onCheckoutClick = ()=>{

        if(this.state.address.length === 0){
            Swal.fire({
                icon: 'error',
                title: 'Isi alamat pengiriman terlebih dahulu',
            })
            return
        }
        
        let transaction_id = Date.now() + `${this.props.username}`
        let customer_id = this.props.id
        let penerima = this.state.address[0].penerima
        let destination = `${this.state.address[0].alamat_pengiriman}, ${this.state.address[0].daerah_pengiriman}` 
        let status = 1 //status_id 1 = Pending
        let grand_total = this.state.grandTotal
        let created_at = new Date()
        let tahun = created_at.getFullYear()
        let bulan = parseInt(created_at.getMonth()) + 1
        let hari = created_at.getDate()
        created_at = moment(created_at).format('YYYY-MM-DD HH-mm-ss')
        let no_invoice = `INV/${tahun}${bulan}${hari}/${Date.now()}`

        axios.patch(`/product/updateStock`, {customer_id})
        .then(res=>{
            // console.log(res.data)
        })
        .catch(err=>{
            console.log(err)
        })

        axios.post(`/cart/checkout`, 
            {transaction_id, no_invoice, customer_id, penerima, destination, status, grand_total, created_at}
        )
        .then(res=>{
            Swal.fire({
                icon: 'info',
                title: 'Barang sudah dipesan',
                text: `Upload bukti pembayaran untuk memulai pengiriman
                Dengan No Invoice ${no_invoice}`
              })
              this.setState({redirect: true})
            // console.log(res.data)
        })
        .catch(err=>{
            console.log(err)
        })

        // console.log(grandTotal)
    }

    renderAlamatPengiriman = ()=>{
        // console.log(this.state.address)
        if(this.state.address.length !== 0){
            return(
                <div>
                    <p className="mt-3 mb-0">{this.state.address[0].penerima}</p>
                    <p className="my-0">{this.state.address[0].phone_number}</p>
                    <p className="my-0">{this.state.address[0].alamat_pengiriman}</p>
                    <p className="mt-0 mb-3">{this.state.address[0].daerah_pengiriman}</p>
                </div>
            )
        }else{
            return(
                <center>
                    <h1 style={{color:'red', fontWeight:'bold'}}>Mohon isi dulu alamat pengiriman</h1>
                </center>
            )
        }
    }

    renderProduct = ()=>{
        let product = this.state.productCart.map((val)=>{
            return (
                <div key ={val.id} className="d-flex flex-row justify-content-center my-4 pb-3 border-top border-bottom">
                    <img className="rounded border my-auto" style={{height:120 ,width:120}} src={val.image_product} alt="img"/>
                    <div className="flex-column w-75">
                        <p className="pl-3">{val.product}</p>
                        {val.stock === 0 ? <p className="pl-3 text-danger font-weight-bold">Out of Stock</p> : ''}
                        <p className="pl-3 mb-0" style={{color: 'red'}}> Rp.{Intl.NumberFormat().format(val.price).replace(/,/g, '.')}</p>
                        <p className="pl-3 mt-0 font-weight-bold">{val.qty} pcs</p>
                        <hr className="pl-3"/>
                        <div className="d-flex flex-row">
                            <p className="pl-3">Sub Total </p>
                            <p className="ml-auto">Rp.{Intl.NumberFormat().format(val.price * val.qty).replace(/,/g, '.')}</p>
                        </div>
                    </div>
                </div>
            )
        })
        return product
    }

    render() {
        if(this.props.id){
            if(this.state.address === null || this.state.productCart === null || this.state.allAddress === null){
                return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
            }

            if(this.state.productCart.length === 0){
                return <Redirect to="/"/>
            }

            if(!this.state.redirect){
                    return (
                        <div className="main-content">
                            <div className="container pt-5">
                                <div className="row pb-5">
                                    <div className="col-md-8 col-12">
                                        <p>Checkout</p>
                                        <p>Alamat Pengiriman</p>
                                        <div className="border-top border-bottom">
                                            {this.renderAlamatPengiriman()}
                                            
                                        </div>
                                        {this.state.address.length !== 0 ? <button onClick={this.toggle_modal} className="btn btn-outline-dark my-3">Pilih Alamat Pengiriman</button> : <button onClick={this.addNew} className="my-3 btn btn-outline-success">Tambah Alamat</button> }
                                        
            
                                        {this.renderProduct()}
                                        
                                    </div>
                                    <div className="col-md-4 col-12">
                                        <div className="d-flex flex-column shadow rounded p-3">
                                            <h5 className="mb-3">Ringkasan Belanja</h5>
                                            
                                            <div className=" border-top d-flex flex-row justify-content-between">
                                                <p className="pt-3">Total Harga</p>
                                                <p className="pt-3">Rp.{Intl.NumberFormat().format(this.state.grandTotal).replace(/,/g, '.')}</p>
                                            </div>
                                            <p>({this.state.totalItem} Produk)</p>
                                            <button onClick={this.onCheckoutClick} className="btn btn-info btn-block" disabled={this.state.stock? false : true}>Checkout</button>
                                            <p className="text-danger" style={{display:this.state.stock? 'none' : ''}}>Out of Stock</p>
                                        </div>
                                        <div className="d-flex flex-column shadow rounded p-3">
                                            <h5 className="mb-3">Transfer Bank</h5>
                                            <div className="d-flex flex-row justify-content-center">
                                                <img className="w-25" src={logo} alt="img"/>
                                                <div className="d-flex flex-column pl-3">
                                                    <p className="my-0">PT. Toko Komputer Online</p>
                                                    <p className="my-0">15112980098</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Footer/>
                            </div>
                            <Modal size={'lg'} isOpen={this.state.modalAddress} toggle={this.toggle_modal}>
                                <ModalHeader toggle={this.toggle_modal}>Pilih Alamat Pengiriman</ModalHeader>
                                <ModalBody>
                                    <div className="container">
                                        <button onClick={this.addAddress} className="btn btn-block btn-success mb-4">Tambah Alamat Baru</button>
                                        {this.renderAlamat()}
                                    </div>
                                    <Modal isOpen={this.state.nestedModal} toggle={this.addAddress}>
                                        <ModalHeader toggle={this.addAddress}>Tambah Alamat</ModalHeader>
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
                                        <Button color="primary" onClick={this.saveAddress}>Save</Button>
                                        <Button color="secondary" onClick={this.addAddress}>Back</Button>
                                        </ModalFooter>
                                    </Modal>
                                </ModalBody>
                                <ModalFooter>
                                <Button color="secondary" onClick={this.toggle_modal}>Back</Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    )
            }else{
                return <Redirect to='/pembelian' />
            }
        }else{
            return <Redirect to="/"/>
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

export default connect(mapStateToProps)(Checkout)
