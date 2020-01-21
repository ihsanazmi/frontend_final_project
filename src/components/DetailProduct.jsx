import React, { Component } from 'react'
import {connect} from 'react-redux'
import axios from './../config/axios'
import {Rating} from 'primereact/rating';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ModalImage from "react-modal-image"
import moment from 'moment'
import Swal from 'sweetalert2'
import {Spinner} from 'reactstrap'

class DetailProduct extends Component {
    
    state = {
        product: null,
        totalReview: '',
        review: null,
        count: 1,
        stock: 0,
    }

    componentDidMount(){
        this.getProduct()
        this.getReview()
    }

    getReview = ()=>{
        let id_product = this.props.match.params.id_product
        axios.get(`/products/review/${id_product}`)
        .then(res=>{
            // console.log(res.data)
            this.setState({
                totalReview: res.data.length,
                review: res.data
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }

    getProduct = ()=>{
        let id_product = this.props.match.params.id_product
        axios.get(`/products/getDetail/${id_product}`)
        .then(res=>{
            this.setState({product: res.data, stock : res.data[0].stock})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    onClickPlus = ()=>{
        this.setState(prevState => {
            if(parseInt(prevState.count) === this.state.stock){
                return {count: this.state.stock }
            }
            return {
                count: parseInt(prevState.count) + 1
            }
          });
    }

    onClickMinus = ()=>{
        this.setState(prevState => {
            if(prevState.count > 1) {
              return {
                count: parseInt(prevState.count) - 1
              }
            } else {
              return null;
            }
          });
    }

    handleChange=()=>{
        let qty = parseInt(this.qty.value)
        console.log(this.state.stock)
        if(qty >= this.state.stock){
            return(
                this.setState({count: this.state.stock})
            )
        }
        if(!qty){
            this.setState({
                count: 1
            })
        }else{
            this.setState({
                count: qty,
            })
        }
    }

    addToCart = ()=>{
        if(!this.props.id){
            return(
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Harus Login Terlebih dahulu',
                    showConfirmButton: false,
                    timer: 1000
                })
            )
        }
        let customer_id = this.props.id
        let product_id = this.props.match.params.id_product
        let qty = this.qty.value
        let price = this.state.product[0].price
        let created_at = new Date()
        created_at = moment(created_at).format('YYYY-MM-DD HH-mm-ss')
        // console.log(product_id)
        axios.get(`/cart/get/${product_id}/${customer_id}`)
        .then(res=>{
            // ADD KE KERANJANG BARU
            if(res.data.length === 0){
                // console.log('add baru')
                axios.post(`/cart/post`, 
                    {customer_id, product_id, qty, price, created_at}
                )
                .then(res=>{
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Produk Baru berhasil ditambah ke keranjang',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    // console.log(res.data)
                })
                .catch(err=>{
                    console.log(err)
                })
            // UPDATE QTY
            }else{
                qty = parseInt(res.data[0].qty) + parseInt(qty)
                let id_cart = res.data[0].id

                axios.patch(`/cart/update/${id_cart}`, 
                    {qty}
                )
                .then(res=>{
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Produk Baru berhasil di ubah',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    // console.log(res.data)
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        })
    }

    renderReview = ()=>{
        // console.log(this.state.review)
        if(this.state.review.length === 0){
            return(
                <tr>
                    <td>Belum ada ulasan</td>
                </tr>
            )
        }

        let review = this.state.review.map((val)=>{
            return(
                <tr key = {val.id}>
                    <td>
                        <div className="d-flex align-items-center">
                            <img className="rounded-circle" style={{height:32, width:32}} src={val.avatar} alt=""/>
                            <div className="d-flex flex-column">
                                <p className="ml-2 my-0">{val.name}</p>
                                <p className="ml-2 my-0 text-muted" style={{fontSize:'10px'}}>{moment(val.created_at).startOf('day').fromNow()}</p>
                            </div>
                        </div>
                        <div>
                            <Rating style={{color:'yellow'}} value={val.rating} readonly={true} stars={5} cancel={false} />
                            <p>"{val.comment}"</p>
                        </div>
                    </td>
                </tr>
            )
        })
        return review
    }
    
    render() {
        if(this.state.product === null || this.state.review === null){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }
        return (
            <div className="pt-5 ">
                <div className="container">
                    <div className="row">
                        {/* Gambar produk */}
                        <div className="col-12 col-md-5">
                            <center>
                                <ModalImage className="img-thumbnail w-75"
                                small={this.state.product[0].image_product}
                                large={this.state.product[0].image_product}
                                alt="img"
                                />
                            </center>
                        </div>
                        <div className="col-12 col-md-7">
                            <h3>{this.state.product[0].product}</h3>
                            <Rating style={{color: "yellow"}} value={this.state.product[0].rating} readonly={true} stars={5} cancel={false} />
                            ({this.state.totalReview} ulasan)
                            <p className="text" style={{color:'red', fontSize:24}}>Rp.{Intl.NumberFormat().format(this.state.product[0].price).replace(/,/g, '.')}</p>
                            <p>Stock : {this.state.product[0].stock}</p>
                            <button className="btn" onClick={()=>{this.onClickMinus()}}>
                            <i className="fas fa-minus-circle fa-lg"></i>
                            </button> 
                            <input ref = { (input)=> {this.qty = input} } type="text" className="form-control d-inline-block col-1" value={this.state.count} onChange={this.handleChange} /> 
                            <button className="btn" onClick={()=>{this.onClickPlus()}}>
                                <i className="fas fa-plus-circle fa-lg"></i>
                            </button>
                        </div>
                        <div className="col-12 mt-5 mb-5 pb-5" style={{height:'30vh'}}>
                            <Tabs className=" pb-5 mb-5 ">
                                <TabList>
                                <Tab>Informasi Produk</Tab>
                                <Tab>Ulasan</Tab>
                                </TabList>
                                
                                <TabPanel>
                                    <textarea className="form-control" style={{backgroundColor: 'white', border:'none'}} readOnly cols="30" rows="5" defaultValue={this.state.product[0].description}></textarea>
                                </TabPanel>
                                <TabPanel>
                                    <table className="table table-bordered table-hover mb-5 pb-5">
                                        <tbody>
                                            {this.renderReview()}
                                            
                                        </tbody>
                                    </table>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
                <div className="shadow fixed-bottom p-3" style={{backgroundColor:'white'}}>
                    <div className="d-flex justify-content-end align-items-center container">
                        <div>
                            <p className="mt-0 mb-0 text-muted">Total</p>
                            <p className="mt-0 mb-0" style={{fontSize:24}}>Rp.{Intl.NumberFormat().format(this.state.product[0].price * this.state.count).replace(/,/g, '.')}</p>
                        </div>
                        <div className="border rounded ml-3">
                            <i className="far fa-heart p-3"></i>
                        </div>
                        {/* <button onClick={this.onBeliClick} className="btn btn-lg btn-outline-warning align ml-3">Beli</button> */}
                        <button onClick={this.addToCart} className="btn btn-lg btn-warning ml-3" disabled={this.state.product[0].stock === 0 ? true : false}>Tambah ke Keranjang</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        id: state.auth.id
    }
}

export default connect(mapStateToProps)(DetailProduct)
