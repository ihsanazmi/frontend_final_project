import React, { Component } from 'react'
import Footer from '../Footer'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from './../../config/axios'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Swal from 'sweetalert2'
import {Spinner} from 'reactstrap'


class Cart extends Component {

    state = {
        count: '',
        productCarts: null,
        totalItem: '',
        grandTotal: '',
        modal_qty: false,
        value_qty: '',
        stock: 0
    }

    componentDidMount(){
        this.getCart()
    }

    getCart = ()=>{
        let customer_id = this.props.id
        axios.get(`/cart/getAll/${customer_id}`)
        .then(res=>{
            let grandTotal = 0
            let totalItem = 0
            res.data.map((val)=>{
                grandTotal = (val.qty * val.price) + parseInt(grandTotal)
                totalItem = parseInt(totalItem) + val.qty
                return res.data
            })
            // console.log(res.data)
            this.setState({
                productCarts: res.data,
                totalItem: totalItem,
                grandTotal: grandTotal
            })
        })
    }

    deleteCart = (id_cart)=>{
        Swal.fire({
            title: 'Hapus product?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus product'
        }).then((result) => {
            if (result.value) {
                axios.delete(`/cart/delete/${id_cart}`)
                .then(res=>{
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Produk berhasil dihapus',
                        showConfirmButton: false,
                        timer: 1000
                      })
                    this.getCart()
                }).catch(err=>{
                    console.log(err)
                })
            }
        })
    }

    editQty = (id_cart)=>{
        let qty = this.edit_qty.value
        if(!qty){
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Qty tidak boleh kosong',
                showConfirmButton: false,
                timer: 1000
            })
            return
        }
        axios.patch(`/cart/update/${id_cart}`, {qty})
        .then(res=>{
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Qty berhasil di ubah',
                showConfirmButton: false,
                timer: 1000
            })
            this.setState({
                modal_qty: !this.state.modal_qty
            })
            this.getCart()
        })
        .catch(err=>{
            console.log(err)
        })

    }

    toggle = (id)=>{
        axios.get(`/cart/getQty/${id}`)
        .then(res=>{
            // console.log(res.data)
            this.setState({
                id_cart : id,
                value_qty: res.data[0].qty,
                stock:res.data[0].stock,
                modal_qty: !this.state.modal_qty
            })
        })
    }

    toggle_exit_edit = ()=>{
        this.setState({
            modal_qty: !this.state.modal_qty,
            value_qty: ''
        })
    }

    handleChange = ()=>{
        let qty = parseInt(this.edit_qty.value)
        // console.log(this.state.stock)
        if(qty >= this.state.stock){
            return(
                this.setState({value_qty: this.state.stock})
            )
        }
        if(!qty){
            this.setState({
                value_qty: ''
            })
        }else{
            this.setState({
                value_qty: qty,
            })
        }
    }

    renderCart = ()=>{
        let productCart = this.state.productCarts.map((val)=>{
            return(
                <tr key={val.id}>
                    <td>
                        <div className="d-flex flex-row justify-content-between">
                            <img className="rounded border mx-auto my-auto" style={{height:120, width:120}} src={val.image_product} alt="img"/>

                            <div className="flex-column w-75">
                                <p className="pl-3">{val.product}</p>
                                <p className="pl-3 mb-0" style={{color: 'red'}}> Rp.{Intl.NumberFormat().format(val.price).replace(/,/g, '.')}</p>

                                <p className="pl-3 mt-0 font-weight-bold">{val.qty} pcs</p>
                                <button onClick={()=>{this.toggle(val.id)}} className="btn btn-outline-dark ml-3">Change qty</button>
                            </div>

                            <button onClick={()=>{this.deleteCart(val.id)}} className="btn btn-outline-danger align-self-end"><i className="fas fa-trash-alt"></i></button>

                        </div>
                        <div></div>
                    </td>
                </tr>
            )
        })
        return productCart
    }

    render() {
        if(this.props.id){
            if(this.state.productCarts === null){
                return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
            }
            if(this.state.productCarts.length !== 0){
                return (
                    <div className="main-content">
                        <div className="container pt-5">
                            <div className=" row pb-5">
                                <div className="col-md-8 col-12">
                                    <table className="table table-bordered shadow">
                                        <tbody>
                                            {this.renderCart()}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4 col-12" >
                                    <div className="d-flex flex-column shadow rounded p-3">
                                        <h5 className="mb-3">Ringkasan Belanja</h5>
                                        
                                        <div className=" border-top d-flex flex-row justify-content-between">
                                            <p className="pt-3">Total Harga</p>
                                            <p className="pt-3">Rp.{Intl.NumberFormat().format(this.state.grandTotal).replace(/,/g, '.')}</p>
                                        </div>
                                        <Link to="/checkout">
                                            <button className="btn btn-info btn-block">Beli ({this.state.totalItem})</button>
                                        </Link>
        
                                    </div>
                                </div>
                            </div>
                            <Modal isOpen={this.state.modal_qty} toggle={this.toggle_exit_edit}>
                            <ModalHeader toggle={this.toggle_exit_edit}>Edit Quantity</ModalHeader>
                            <ModalBody>
                                <label htmlFor="qty">Qty</label>
                                <input onChange={this.handleChange} className="form-control" id="qty" type="text" ref={(input)=>{this.edit_qty = input}} value={this.state.value_qty} />
                            </ModalBody>
                            <ModalFooter>
                            <Button color="primary" onClick={()=>{this.editQty(this.state.id_cart)}}>Save</Button>{' '}
                            <Button color="secondary" onClick={this.toggle_exit_edit}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                        </div>
                        <div>
                            <Footer/>
                        </div>
                    </div>
                )
            }else{
                return(
                    <div className="main-content">
                        <div className="pt-5">
                        <center>
                            <h1 className="display-4">Oops!</h1>
                            <h3>Keranjang anda masih kosong</h3>
                            <h3>Mulai belanja disini</h3>
                            <Link to="/">
                                <button className="btn btn-info">Belanja</button>
                            </Link>
                        </center>
                        </div>
                    </div>
                )
            }

        }else{
            return(
                <div className="pt-5">
                    <div className="mt-5">
                        <center>
                            <h1 className="display-4">Oops!</h1>
                            <h3>Untuk melihat keranjang harus login terlebih dahulu</h3>
                            <Link to="/">
                                <button className="btn btn-info">Home</button>
                            </Link>
                        </center>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = (state)=>{
    return{
        id: state.auth.id
    }
}

export default connect(mapStateToProps)(Cart)
