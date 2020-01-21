import React, { Component } from 'react'
import axios from '../../config/axios'
import {Paginator} from 'primereact/paginator'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap'
import {connect} from 'react-redux'
import moment from 'moment'
import Swal from 'sweetalert2'

class TabManageCategory extends Component {

    state = {
        first: 0, 
        rows: 10,
        lastIndex: 10,
        totalRecords: 0,
        kategori: [],
        search_kategori : [],
        tipe: [],
        search_tipe: [],
        first2: 0, 
        rows2: 10,
        lastIndex2: 10,
        totalRecords2: 0,
        modal_kategori: false,
        modal_tipe : false,
        nama_kategori: '',
        nama_tipe: '',
        value_type: 0,
        id_kategori: 0,
        id_tipe: 0,
        file_name: ''

    }

    componentDidMount(){
        this.getKategori()
        this.getTipe()
    }

    getTipe = ()=>{
        axios.get('/products/type_products')
        .then(res=>{
            this.setState({
                tipe: res.data,
                search_tipe: res.data,
                totalRecords2: res.data.length
            })
        })
    }

    getKategori = ()=>{
        axios.get('/products/getkategori')
        .then(res=>{
            this.setState({
                kategori: res.data,
                search_kategori: res.data,
                totalRecords: res.data.length
            })
        })
    }

    onPageChange(event) {
        console.log(event.first)
        this.setState({
            first: event.first,
            rows: event.rows,
            lastIndex: event.first + event.rows
        });
    }

    onPageChange2(event) {
        this.setState({
            first2: event.first,
            rows2: event.rows,
            lastIndex2: event.first + event.rows
        });
    }

    toggle_kategori = (id_kategori)=>{
        // console.log(id_kategori)

        if(id_kategori !== 0){
            axios.get(`/products/getTipeId/${id_kategori}`)
            .then(res=>{
                this.setState({
                    nama_kategori: res.data[0].category,
                    value_type: res.data[0].type_id,
                    id_kategori: id_kategori
                })
            }).catch(err=>{
                console.log(err)
            })
        }
        
        this.setState({
            modal_kategori: !this.state.modal_kategori
        })
    }

    toggle_kategori_exit = ()=>{
        this.setState({
            modal_kategori: !this.state.modal_kategori,
            nama_kategori: '',
            value_type: ''
        })
    }

    toggle_tipe = (id_tipe)=>{
        // console.log(id_kategori)

        if(id_tipe !== 0){
            axios.get(`/products/getTipeId/${id_tipe}`)
            .then(res=>{
                this.setState({
                    nama_tipe: res.data[0].type,
                    id_tipe: id_tipe
                })
            }).catch(err=>{
                console.log(err)
            })
        }
        
        this.setState({
            modal_tipe: !this.state.modal_tipe
        })
    }

    toggle_tipe_exit = ()=>{
        this.setState({
            modal_tipe: !this.state.modal_tipe,
            nama_tipe: ''
        })
    }

    onSearchKategori = ()=>{
        let keyWords = this.search_kategori.value
        let hasilSearch = this.state.kategori.filter(kategori=>{
            return kategori.category.toLowerCase().includes(keyWords.toLowerCase())
        })

        this.setState({search_kategori: hasilSearch, totalRecords: hasilSearch.length})
    }

    onSearchTipe = ()=>{
        let keyWords = this.search_tipe.value
        let hasilSearch = this.state.tipe.filter(tipe=>{
            return tipe.type.toLowerCase().includes(keyWords.toLowerCase())
        })

        this.setState({search_tipe: hasilSearch, totalRecords2: hasilSearch.length})
    }
    
    deleteKategori = (id_kategori)=>{
        axios.patch(`/products/deleteKategori/${id_kategori}`)
        .then(res=>{
            if(res.data.error){
                return(
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Oopss..',
                        text: 'Something went wrong! Try again later',
                        showConfirmButton: true,
                    })
                )
            }
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Kategori berhasil di hapus',
                showConfirmButton: false,
                timer: 1000
            })
            this.getKategori()
            console.log(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    saveKategori = (id_product)=>{
        let category = this.input_kategori.value
        let type_id = this.state.value_type
        let updated_at = new Date()
        updated_at = moment(updated_at).format('YYYY-MM-DD HH-mm-ss')
        let updated_by = this.props.id
        let created_at = new Date()
        created_at = moment(created_at).format('YYYY-MM-DD HH-mm-ss')
        let created_by = this.props.id
        let deleted = 0
        
        if(!category || !type_id){
            return(
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Form harus diisi',
                    showConfirmButton: false,
                    timer: 1000
                })
            )
        }

        if(id_product){
            console.log('updatekategori')
            axios.patch(`/products/updateKategori/${id_product}`, {category, type_id, updated_at, updated_by})
            .then(res=>{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: id_product ? 'Kategori berhasil diubah' : 'Kategori berhasil di tambahkan',
                    showConfirmButton: false,
                    timer: 1000
                })
                this.getKategori()
                this.setState({
                    modal_kategori: !this.state.modal_kategori,
                    nama_kategori: '',
                    value_type: ''
                })
                console.log(res)
            }).catch(err=>{
                console.log(err)
            })
        }else{
            axios.post(`/products/saveKategori`, {category, type_id, created_at, created_by, deleted})
            .then(res=>{
                if(res.data.error){
                    return(
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Oopss..',
                            text: 'Something went wrong! Try again later',
                            showConfirmButton: true,
                        })
                    )
                }
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: id_product ? 'Kategori berhasil diubah' : 'Kategori berhasil di tambahkan',
                    showConfirmButton: false,
                    timer: 1000
                })
                this.getKategori()
                this.setState({
                    modal_kategori: !this.state.modal_kategori,
                    nama_kategori: '',
                    value_type: ''
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }
    
    deleteTipe = (id_tipe)=>{
        console.log(id_tipe)
        axios.patch(`/products/deleteTipe/${id_tipe}`)
        .then(res=>{
            if(res.data.error){
                return(
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Oopss..',
                        text: 'Something went wrong! Try again later',
                        showConfirmButton: true,
                    })
                )
            }
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tipe berhasil di hapus',
                showConfirmButton: false,
                timer: 1000
            })
            this.getTipe()
            console.log(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    saveTipe = (id_tipe)=>{
        let formData = new FormData()

        let type = this.input_tipe.value
        let type_image = this.edit_img_tipe.files[0]
        let created_at = new Date()
        created_at = moment(created_at).format('YYYY-MM-DD HH-mm-ss')
        let created_by = this.props.id
        let updated_at = new Date()
        updated_at = moment(updated_at).format('YYYY-MM-DD HH-mm-ss')
        let updated_by = this.props.id
        let deleted = 0

        if(!type){
            return(
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Form harus diisi',
                    showConfirmButton: false,
                    timer: 1000
                })
            )
        }

        if(id_tipe){
            
            formData.append("type", type)
            formData.append("updated_at", updated_at)
            formData.append("updated_by", updated_by)
            formData.append("type_image", type_image)
            // console.log(id_tipe)
            // Upload jika ada perubahan gambar
            if(type_image !== undefined){
                axios.patch(`/products/updateTipeWithImg/${id_tipe}/${type}`, formData)
                .then(res=>{
                    console.log(id_tipe)
                    if(res.data.error){
                        return(
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: 'Oopss..',
                                text: res.data.error,
                                showConfirmButton: true,
                            })
                        )
                    }
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Tipe produk berhasil diubah',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    this.getTipe()
                    this.setState({
                        modal_tipe: !this.state.modal_tipe,
                        nama_tipe: '',
                        file_name: ''
                    })
                    console.log(res.data)
                })
                .catch(err=>{
                    console.log(err)
                })
            // Upload jika tidak ada perubahan gambar
            }else{
                axios.patch(`/products/updateTipe/${id_tipe}`, {type, updated_at, updated_by})
                .then(res=>{
                    if(res.data.error){
                        return(
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: 'Oopss..',
                                text: 'Something went wrong! Try again later',
                                showConfirmButton: true,
                            })
                        )
                    }
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Tipe produk berhasil diubah',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    this.getTipe()
                    this.setState({
                        modal_tipe: !this.state.modal_tipe,
                        nama_tipe: '',
                        file_name: ''
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        // Kondisi untuk save tipe
        }else{
            console.log('s')
            formData.append("type", type)
            formData.append("created_at", created_at)
            formData.append("created_by", created_by)
            formData.append("type_image", type_image)
            
            // KOndisi jika save tipe baru dengan image
            if(type_image !== undefined){
                axios.post(`/products/saveTipewithImg`, formData)
                .then(res=>{
                    if(res.data.error){
                        console.log(res.data)
                        return(
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: 'Oopss..',
                                text: 'Something went wrong! Try again later',
                                showConfirmButton: true,
                            })
                        )
                    }
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Tipe produk berhasil ditambah',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    this.getTipe()
                    this.setState({
                        modal_tipe: !this.state.modal_tipe,
                        nama_tipe: '',
                        file_name: ''
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
                
            }else{
                axios.post(`/products/saveTipe`, {type, created_at, created_by, deleted})
                .then(res=>{
                    if(res.data.error){
                        console.log(res.data)
                        return(
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: 'Oopss..',
                                text: 'Something went wrong! Try again later',
                                showConfirmButton: true,
                            })
                        )
                    }
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Tipe produk berhasil ditambah',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    this.getTipe()
                    this.setState({
                        modal_tipe: !this.state.modal_tipe,
                        nama_tipe: '',
                        file_name:''
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        }

    }

    renderTableKategori = (first, last)=>{
        let data = this.state.search_kategori
        data = data.slice(first, last)

        let hasil = data.map(kat=>{
            return (
                <tr key={kat.id}  className="text-center">
                    <td>{kat.category}</td>
                    <td>{kat.type}</td>
                    <td>
                        <button onClick={()=>this.toggle_kategori(kat.id)} className="btn btn-warning"><i className="far fa-edit"></i></button>
                        <button onClick={()=>{this.deleteKategori(kat.id)}} className="btn btn-danger ml-2"><i className="fas fa-trash"/></button>
                    </td>
                </tr>
            )
        })
        return hasil
    }   

    renderTableTipe = (first, last) =>{
        let data = this.state.search_tipe
        data = data.slice(first, last)

        let hasil = data.map(tipe=>{
            return(
                <tr key={tipe.id}  className="text-center">
                    <td><img className="table_img" src={tipe.type_image} alt="img"/></td>
                    <td>{tipe.type}</td>
                    <td>
                        <button onClick={()=>{this.toggle_tipe(tipe.id)}} className="btn btn-warning"><i className="far fa-edit"></i></button>
                        <button onClick={()=>{this.deleteTipe(tipe.id)}} className="btn btn-danger ml-2"><i className="fas fa-trash"/></button>
                    </td>
                </tr>
            )
        })
        return hasil
    }

    renderOptiontipe = ()=>{
        let option = this.state.tipe.map(tipe=>{
            return(
            <option key={tipe.id} value={tipe.id}>{tipe.type}</option>
            )
        })
        // console.log(option)
        return option
    }

    placeFilename =()=>{
        this.setState({
            file_name: this.edit_img_tipe.files[0].name
        })
    }

    render() {
        if(this.state.kategori.length === 0 || this.state.tipe.length === 0){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }
        return (
            <div className="card mt-5">
                <p className="card-header">Manage Category and Product Type</p>
                <div className="card-body">
                    <div className="row justify-content-around">
                        <div className="col-12 col-md-6">
                            <div className="row justify-content-between">
                                <div className="col-5">
                                    <button onClick={()=>this.toggle_kategori(0)} className="btn btn-success mr-auto mb-3"><i className="fas fa-plus"></i> Tambah Kategori</button>
                                </div>
                                <div>
                                    
                                </div>
                                <div className="col-5">
                                    <input ref={(input)=>{this.search_kategori = input}} onChange={this.onSearchKategori} className="form-control" type="text" placeholder="Search Kategori"/>
                                </div>
                            </div>
                            <Paginator className="col align-self-center mx-auto" first={this.state.first} rows={this.state.rows} totalRecords={this.state.totalRecords}onPageChange={(e)=>{this.onPageChange(e)}}></Paginator>
                            <table className="col align-self-center table table-hover mx-auto">
                                <thead>
                                    <tr className="text-center">
                                        <th>Kategori</th>
                                        <th>Tipe Produk</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.renderTableKategori(this.state.first, this.state.lastIndex)}
                                </tbody>
                            </table>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="row justify-content-between">
                                <div className="col-5">
                                    <button onClick={()=>{this.toggle_tipe(0)}} className="btn btn-success mr-auto mb-3"><i className="fas fa-plus"></i> Tambah Tipe</button>
                                </div>
                                <div>
                                    
                                </div>
                                <div className="col-5">
                                    <input ref={(input)=>{this.search_tipe = input}} onChange={this.onSearchTipe} className="form-control" type="text" placeholder="Search Tipe"/>
                                </div>
                            </div>
                            <Paginator className="col align-self-center mx-auto" first={this.state.first2} rows={this.state.rows2} totalRecords={this.state.totalRecords2}onPageChange2={(e)=>{this.onPageChange2(e)}}
                            template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink">
                            ></Paginator>
                            <table className="table table-hover  ">
                                <thead>
                                    <tr className="text-center">
                                        <th>Tipe Produk</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.renderTableTipe(this.state.first2, this.state.lastIndex2)}
                                </tbody>
                            </table>
                        </div>
                        
                    </div>
                </div>

                <Modal isOpen={this.state.modal_kategori} toggle={this.toggle_kategori_exit}>
                    <ModalHeader toggle={this.toggle_kategori_exit}>Edit Stock</ModalHeader>
                    <ModalBody>
                        <label htmlFor="nama_kategori">Nama Kategori</label>
                        <input maxLength={40} ref={(input)=>{this.input_kategori = input}} id="nama_kategori" type="text" className="form-control" defaultValue={this.state.nama_kategori} />
                        
                        <select className="form-control mt-3" value={this.state.value_type} onChange={(e)=>this.setState({value_type: e.target.value })}>
                            <option value="">-Pilih Tipe Produk-</option>
                            {this.renderOptiontipe()}
                        </select>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={()=>{this.saveKategori(this.state.id_kategori)}}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.toggle_kategori_exit}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modal_tipe} toggle={this.toggle_tipe_exit}>
                    <ModalHeader toggle={this.toggle_tipe_exit}>Edit Stock</ModalHeader>
                    <ModalBody>
                        <label htmlFor="nama_tipe">Nama Tipe</label>
                        <input maxLength={40} ref={(input)=>{this.input_tipe = input}} id="nama_tipe" type="text" className="form-control" defaultValue={this.state.nama_tipe} />
                        <div className="custom-file mt-4">
                            <input onChange={this.placeFilename} ref={(input) => this.edit_img_tipe = input} id="customFileLang"  className="custom-file-input" type="file"/>
                            <label className="custom-file-label" htmlFor="customFileLang">{this.state.file_name ? this.state.file_name : 'Please Insert File'}</label>
                        </div>
                        
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={()=>{this.saveTipe(this.state.id_tipe)}}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.toggle_tipe_exit}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        id: state.auth.id
    }
}

export default connect(mapStateToProps)(TabManageCategory)
