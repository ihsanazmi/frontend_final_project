import React, { Component } from 'react'
import axios from '../../config/axios'
import {Paginator} from 'primereact/paginator'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap'
import moment from 'moment'
import{connect}from 'react-redux'
import Swal from 'sweetalert2'
import ModalImage from "react-modal-image"

export class TabManageProduct extends Component {

    state = {
        searchProduct: [],
        products: [],
        first: 0, 
        rows: 10,
        lastIndex: 10,
        totalRecords: 0,
        modal : false,
        nestedModal: false,
        modal_edit: false,
        categories: [],
        types: [],
        category: '',
        type: '',
        value_cat: 0,
        value_type: 0,
        edit_nama_produk: '',
        edit_harga_produk: '',
        edit_informasi_produk: '',
        id_product: 0,
        file_name: []
    }

    componentDidMount(){
        this.getAllProducts()
        this.getKategori()
        this.getTipe()
        // this.setState({searchProduct: this.props.products})
    }
    
    placeFilename = ()=>{
        this.setState({
            file_name: this.edit_img_produk.files[0].name
        })
    }

    placeFilenameNew = ()=>{
        this.setState({
            file_name: this.img_produk.files[0].name
        })
    }

    getAllProducts = ()=>{
        axios.get('/products')
        .then(res=>{
            this.setState({
                products: res.data,
                searchProduct: res.data,
                totalRecords : res.data.length
            })
        }).catch(err=>{
            console.log(err)
        })
    }

    getTipe = ()=>{
        axios.get('products/type_products')
        .then(res=>{
            
            this.setState({types: res.data})
        })
    }

    getKategori = ()=>{
        axios.get('/products/getkategori')
        .then(res=>{
           
            this.setState({categories: res.data})
        })
    }

    renderOptionKat = ()=>{
        let option = this.state.categories.map(kat=>{
            return(
            <option key={kat.id} value={kat.id}>{kat.category}</option>
            )
        })
        // console.log(option)
        return option

    }

    renderOptiontipe = ()=>{
        let option = this.state.types.map(tipe=>{
            return(
            <option key={tipe.id} value={tipe.id}>{tipe.type}</option>
            )
        })
        // console.log(option)
        return option
    }

    onPageChange(event) {
        this.setState({
            first: event.first,
            rows: event.rows,
            lastIndex: event.first + event.rows
        });
    }

    renderTableProducts = (first, last)=>{
        // console.log(this.props.products)
        let data = this.state.searchProduct
        data = data.slice(first, last)
        // console.log(this.state.totalRecords)
        let hasil = data.map((product)=>{
            return(
                <tr key={product.id} className="text-center">
                    <td><ModalImage className="table_img"
                        small={product.gambar}
                        large={product.gambar}
                        alt="img"
                        />
                    </td>
                    <td>{product.nama_produk}</td>
                    <td>{product.kategori}</td>
                    <td>{product.tipe}</td>
                    <td>Rp.{Intl.NumberFormat().format(product.harga).replace(/,/g, '.')}</td>
                    <td>
                        <button onClick={()=>{this.toggle_edit(product.id)}} className="btn btn-warning ml-2"><i className="far fa-edit"></i></button>
                        <button onClick={()=>{this.deleteProduct(product.id)}} className="btn btn-danger ml-2"><i className="fas fa-trash"></i></button>
                    </td>
                </tr>
            )
        })
        
        return hasil
    }

    toggle = () =>{
        this.setState({modal: !this.state.modal});
        // console.log(this.state.types)
    } 
    toggleNested = () => {
        
        this.setState({nestedModal: !this.state.nestedModal})
    }

    toggle_edit = (id_product)=>{
        this.setState({id_product: id_product})
        axios.get(`/products/get/${id_product}`)
        .then(res=>{
            this.setState({
                value_cat: res.data[0].id_kategori,
                edit_nama_produk: res.data[0].nama_produk,
                edit_harga_produk: res.data[0].harga,
                edit_informasi_produk : res.data[0].description
            })
        }).catch(err=>{
            console.log(err)
        })
        this.setState({modal_edit: !this.state.modal_edit})
    }

    toggle_exit_edit = ()=>{
        this.setState({modal_edit: !this.state.modal_edit})
    }

    saveProduct = ()=>{
        let formData = new FormData()

        let product = this.input_produk.value
        let category_id = this.state.value_cat
        let price = this.input_harga.value
        let stock = this.input_stock.value
        let description = this.description.value
        let image_product = this.img_produk.files[0]
        let created_at = new Date()
        created_at = moment(created_at).format('YYYY-MM-DD HH-mm-ss')
        let created_by = this.props.id
        let updated_by = this.props.id
        let deleted = 0

        if(!product || !category_id || !price || !stock || !description){
            return(
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Form input tidak boleh kosong',
                    showConfirmButton: false,
                    timer: 1000
                })
            )
        }

        formData.append("product", product)
        formData.append("category_id", category_id)
        formData.append("price", price)
        formData.append("stock", stock)
        formData.append("description", description)
        formData.append("img", image_product)
        formData.append("created_at", created_at)
        formData.append("created_by", created_by)
        formData.append("updated_by", updated_by)
        formData.append("deleted", deleted)

        if(image_product !== undefined){
            axios.post(`/products/addProductWithImg/${product}/`, formData)
            .then(res=>{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Produk Baru berhasil di tambahkan',
                    showConfirmButton: false,
                    timer: 1000
                })
                this.getAllProducts()
                this.setState({modal: !this.state.modal, file_name: ''})
                // console.log(res.data)
            }).catch(err=>{
                console.log(err)
            })
        }else{
            axios.post(`/products/addProductWithoutImg`, {product, category_id, price, stock, description, created_at, created_by, updated_by, deleted})
            .then(res=>{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Produk Baru berhasil di tambahkan',
                    showConfirmButton: false,
                    timer: 1000
                })
                this.getAllProducts()
                this.setState({modal: !this.state.modal, file_name: ''})
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }

    editProduk = (id_product)=>{
        let formData = new FormData()

        let product = this.edit_produk.value
        let category_id = this.state.value_cat
        let price = this.edit_harga.value
        let description = this.edit_informasi_produk.value
        let image_product = this.edit_img_produk.files[0]
        let updated_at = new Date()
        updated_at = moment(updated_at).format('YYYY-MM-DD HH-mm-ss')
        let updated_by = this.props.id
            // alert(product, id_product)

        if(!product || !category_id || !price || !description){
            return(
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Form input tidak boleh kosong',
                    showConfirmButton: false,
                    timer: 1000
                })
            )
        }
        
        formData.append("product", product)
        formData.append("category_id", category_id)
        formData.append("price", price)
        formData.append("description", description)
        
        formData.append("image_product", image_product)
        formData.append("updated_at", updated_at)
        formData.append("updated_by", updated_by)
        
        if(image_product !== undefined){
            // alert(id_product)
            axios.patch(`/products/update/${id_product}/${product}`, formData)
            .then(res=>{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Produk Baru berhasil di ubah',
                    showConfirmButton: false,
                    timer: 1000
                })
                console.log(res.data)
                this.getAllProducts()
                this.setState({
                    modal_edit: !this.state.modal_edit,
                    value_cat: 0,
                    edit_nama_produk: '',
                    edit_harga_produk: '',
                    file_name: ''
                })
            }).catch(err=>{
                console.log(err.message)
            })
        }else{
            axios.patch(`/products/updateWithouimg/${id_product}`, {product, category_id, price, description , updated_at, updated_by})
            .then(res=>{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Produk Baru berhasil di ubah',
                    showConfirmButton: false,
                    timer: 1000
                })
                console.log(res.data)
                this.getAllProducts()
                this.setState({
                    modal_edit: !this.state.modal_edit,
                    value_cat: 0,
                    edit_nama_produk: '',
                    edit_harga_produk: ''
                })
            }).catch(err=>{
                console.log(err)
            })

        }

    
        // console.log(category_id)
    }

    deleteProduct = (id_product)=>{
        Swal.fire({
            title: 'Hapus product?',
            
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus product'
        }).then((result) => {
            if (result.value) {
                axios.patch(`/products/delete/${id_product}` )
                .then(res=>{
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Produk berhasil dihapus',
                        showConfirmButton: false,
                        timer: 1000
                      })
                    this.getAllProducts()
                }).catch(err=>{
                    console.log(err)
                })
            }
        })
    }

    searchProduct = ()=>{

        let keyWords = this.search.value
        let hasilSearch = this.state.products.filter(product=>{
            return product.nama_produk.toLowerCase().includes(keyWords.toLowerCase())
        })

        this.setState({searchProduct: hasilSearch, totalRecords: hasilSearch.length})
    }

    saveKategori = ()=>{
        let category = this.input_kategori.value
        let type_id = this.state.value_type
        let created_at = new Date()
        created_at = moment(created_at).format('YYYY-MM-DD HH-mm-ss')
        let created_by = this.props.id
        let updated_by = this.props.id
        // console.log(_tipe_id)

        if(!category || !type_id){
            return(
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Form input tidak boleh kosong',
                    showConfirmButton: false,
                    timer: 1000
                })
            )
        }

        axios.post('/products/inputkategori', {
            type_id, category, created_at, created_by, updated_by
        })
        .then(res=>{
            alert('kategori masuk')
            this.getKategori()
            this.setState({
                nestedModal: !this.state.nestedModal
            })
        }).catch(err=>{
            console.log(err)
        })
    }

    handleChangeHarga = ()=>{
        let harga = this.input_harga.value
        this.input_harga.value = harga.match(/\d*$/)
    }

    handleChangeEditHarga = ()=>{
        let harga = this.edit_harga.value
        this.edit_harga.value = harga.match(/\d*$/)
    }

    handleChangeStock = ()=>{
        let stock = this.input_stock.value
        this.input_stock.value = stock.match(/\d*$/)
    }

    render() {
        // console.log('tes')
        if(this.state.products.length === 0){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }
        return (
            <div className="card mt-5">
                <p className="card-header">Manage All Products</p>
                <div className="card-body">
                    <div className="row justify-content-between">
                        <div className="col-3">
                            <button onClick={this.toggle} className="btn btn-success mr-auto mb-3"><i className="fas fa-plus"></i> Tambah Product</button>
                        </div>
                        <div>
                            
                        </div>
                        <div className="col-3">
                            <input ref={(input)=>{this.search = input}} onChange={this.searchProduct} className="form-control" type="text" placeholder="Search Product"/>
                        </div>
                    </div>
                    <Paginator first={this.state.first} rows={this.state.rows} totalRecords={this.state.totalRecords}onPageChange={(e)=>{this.onPageChange(e)}}></Paginator>
                    
                    <table className="table table-hover table-responsive">
                        <thead>
                            <tr className="text-center">
                                <th className="col-1">Gambar</th>
                                <th className="col-4">Nama</th>
                                <th>Kategory</th>
                                <th>Tipe</th>
                                <th>Harga</th>
                                <th className="col-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.renderTableProducts(this.state.first, this.state.lastIndex)}
                        </tbody>
                    </table>
                </div>

                {/* MODAL */}
                <Modal size={'lg'} isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Tambah Produk</ModalHeader>
                    <ModalBody>
                        <label htmlFor="nama_produk">Nama Produk</label>
                        <input maxLength={256} ref={(input)=>{this.input_produk = input}} id="nama_produk" className="form-control" type="text"/>
                        
                        <select className="form-control mt-3" value={this.state.value_cat} onChange={(e)=>this.setState({value_cat: e.target.value })}>
                            <option value="">-Pilih Kategori-</option>
                            {this.renderOptionKat()}
                        </select>
                        <div className="mt-1">
                            <Button color="success" onClick={this.toggleNested}>Tambah Kategori</Button>
                        </div>
                        <label className="mt-2" htmlFor="harga">Harga</label>
                        <input onChange={this.handleChangeHarga} ref= {(input)=>{this.input_harga = input}}  id="harga" className="form-control" type="text"/>
                        <label className="mt-2" htmlFor="stock">Stock</label>
                        <input onChange={this.handleChangeStock} ref= {(input)=>{this.input_stock = input}}  id="stock" className="form-control" type="text"/>
                        <label htmlFor="description">Informasi Produk</label>
                        <textarea ref={(input)=>{this.description = input}} className="form-control" id="description" cols="20" rows="5"></textarea>
                        <div className="custom-file mt-4">
                            <input onChange={this.placeFilenameNew} ref={(input) => this.img_produk = input} id="customFileLang"  className="custom-file-input" type="file"/>
                            <label className="custom-file-label" htmlFor="customFileLang">{this.state.file_name ? this.state.file_name : 'Please Insert File'}</label>
                        </div>
                    <br />
                    <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested} onClosed={this.state.closeAll ? this.toggle : undefined}>
                        <ModalHeader>Tambah Kategori</ModalHeader>
                        <ModalBody>
                            <label htmlFor="kategori">Kategori</label>
                            <input ref={ (input)=>{this.input_kategori = input}} className="form-control" id="kategori" type="text"/>
                            <select className="form-control mt-3" value={this.state.value_type} onChange={(e)=>this.setState({value_type: e.target.value })}>
                                <option value="">-Pilih Tipe Produk-</option>
                                {this.renderOptiontipe()}
                            </select>

                        </ModalBody>
                        <ModalFooter>
                        <Button color="primary" onClick={this.saveKategori}>Done</Button>{' '}
                        <Button color="secondary" onClick={this.toggleNested}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={this.saveProduct}>Simpan Produk</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modal_edit} toggle={this.toggle_exit_edit}>
                    <ModalHeader toggle={this.toggle_exit_edit}>Tambah Produk</ModalHeader>
                    <ModalBody>
                        
                        <label htmlFor="edit_nama_produk">Nama Produk</label>
                        <input ref={(input)=>{this.edit_produk = input}} id="edit_nama_produk" type="text" className="form-control" defaultValue={this.state.edit_nama_produk} />
                        
                        <label className="mt-3" htmlFor="selectKategori">Pilih Kategori</label>
                        <select id="selectKategori"  className="form-control" value={this.state.value_cat} onChange={(e)=>this.setState({value_cat: e.target.value })}>
                            <option value="">-Pilih Kategori-</option>
                            {this.renderOptionKat()}
                        </select>

                        <label htmlFor="edit_harga">Harga</label>
                        <input onChange={this.handleChangeEditHarga} ref={(input)=>{this.edit_harga = input}} id="edit_harga" className="form-control" defaultValue={this.state.edit_harga_produk} type="text"/>

                        <label htmlFor="description">Informasi Produk</label>
                        <textarea ref={(input =>{this.edit_informasi_produk = input})} className="form-control" id="description" cols="30" rows="10" defaultValue={this.state.edit_informasi_produk}></textarea>

                        <div className="custom-file mt-4">
                            <input onChange={this.placeFilename} ref={(input) => this.edit_img_produk = input} id="customFileLang"  className="custom-file-input" type="file"/>
                            <label className="custom-file-label" htmlFor="customFileLang">{this.state.file_name ? this.state.file_name : 'Please Insert File'}</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={()=>{this.editProduk(this.state.id_product)}}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={this.toggle_exit_edit}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        id: state.auth.id
    }
}

export default connect(mapStateToProps)(TabManageProduct)
