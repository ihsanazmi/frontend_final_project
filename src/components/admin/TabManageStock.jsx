import React, { Component } from 'react'
import {Paginator} from 'primereact/paginator'
import axios from '../../config/axios'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap'
import moment from 'moment'
import {connect} from 'react-redux'
import Swal from 'sweetalert2'

class TabManageStock extends Component {
    
    state = {
        products:[],
        searchProduct: [],
        first: 0, 
        rows: 10,
        lastIndex: 10,
        totalRecords: 0,
        modal_stock: false,
        nama_produk: '',
        input_stock: '',
        id_product: 0,
    }

    componentDidMount(){
        this.getAllProducts()
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

    onPageChange(event) {
        this.setState({
            first: event.first,
            rows: event.rows,
            lastIndex: event.first + event.rows
        });
    }

    searchProduct = ()=>{
        let keyWords = this.search_produk.value
        let hasilSearch = this.state.products.filter(product=>{
            return product.nama_produk.toLowerCase().includes(keyWords.toLowerCase())
        })

        this.setState({searchProduct: hasilSearch, totalRecords: hasilSearch.length})
    }

    toggle_exit = ()=>{
        this.setState({modal_stock: !this.state.modal_stock})
    }

    openModal =(id)=>{
        // console.log(id)
        this.setState({id_product: id})
        axios.get(`/products/get/${id}`)
        .then(res=>{
            console.log(res.data[0].stock)
            this.setState({
                nama_produk: res.data[0].nama_produk,
                input_stock: res.data[0].stock
            })
        }).catch(err=>{
            console.log(err)
        })
        
        this.setState({modal_stock: !this.state.modal_stock})
    }

    editStock = (id_product)=>{
        let stock = this.input_stock.value
        let updated_at = new Date()
        updated_at = moment(updated_at).format('YYYY-MM-DD HH-mm-ss')
        let updated_by = this.props.id
        // console.log(stock)
        if(!stock){
            // console.log('true')
            return (
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Stock harus diisi angka',
                    showConfirmButton: false,
                    timer: 1000
                })
            )
        }

        axios.patch(`/products/stockUpdate/${id_product}`, {stock, updated_at, updated_by})
        .then(res=>{
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Stock berhasil di ubah',
                showConfirmButton: false,
                timer: 1000
            })
            this.getAllProducts()
            this.setState({
                nama_produk: '',
                input_stock: '',
                id_product: 0,
                modal_stock: !this.state.modal_stock
            })
        }).catch(err=>{
            console.log(err)
        })
        console.log(updated_by)

    }

    renderTableStock = (first, last)=>{
        let data = this.state.searchProduct
        data = data.slice(first, last)
        let i = 1
        let j = 1 + this.state.first
        let hasil = data.map((product)=>{
            return(
                <tr key={i++}  className="text-center">
                    <td>{j++}</td>
                    <td>{product.nama_produk}</td>
                    <td>{product.stock}</td>
                    <td>
                        <button onClick={()=>{this.openModal(product.id)}} className="btn btn-warning ml-2"><i className="far fa-edit"></i></button>
                    </td>
                </tr>
            )
        })
        return hasil
    }

    handleChangeStock = ()=>{
        let stock = this.input_stock.value
        this.input_stock.value = stock.match(/\d*$/)
    }

    render() {
        if(this.state.products.length === 0){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }
        return (
            <div className="card mt-5">
                <p className="card-header">Manage Stock</p>
                <div className="card-body">
                    <div className="col align-self-center mx-auto w-75 p-0">
                        <input ref={(input)=>{this.search_produk = input}} onChange={this.searchProduct} className="form-control" type="text" placeholder="Search Product ..."/>
                    </div>
                    <Paginator className="col align-self-center mx-auto w-75 mt-3" first={this.state.first} rows={this.state.rows} totalRecords={this.state.totalRecords}onPageChange={(e)=>{this.onPageChange(e)}}></Paginator>
                    
                    <table className="col align-self-center table table-hover table-responsive w-75 mx-auto">
                        <thead>
                            <tr className="text-center">
                                <th>No.</th>
                                <th className="col-4">Product</th>
                                <th>Stock</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.renderTableStock(this.state.first, this.state.lastIndex)}
                        </tbody>
                    </table>
                </div>

                <Modal isOpen={this.state.modal_stock} toggle={this.toggle_exit}>
                    <ModalHeader toggle={this.toggle_exit}>Edit Stock</ModalHeader>
                    <ModalBody>
                        
                        <label htmlFor="nama_produk">Nama Produk</label>
                        <input readOnly id="nama_produk" type="text" className="form-control" defaultValue={this.state.nama_produk} />
                        

                        <label htmlFor="input_stock">Stock</label>
                        <input onChange={this.handleChangeStock} ref={(input)=>{this.input_stock = input}} id="input_stock" className="form-control" defaultValue={this.state.input_stock} type="text"/>

                        
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={()=>{this.editStock(this.state.id_product)}}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.toggle_exit}>Cancel</Button>
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

export default connect(mapStateToProps)(TabManageStock)
