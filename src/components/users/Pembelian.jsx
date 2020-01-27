import React, { Component } from 'react'
import Footer from '../Footer'
import {connect} from 'react-redux'
import axios from '../../config/axios'
import moment from 'moment'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import {Redirect, Link} from 'react-router-dom'
import StarRatings from 'react-star-ratings'
import {Rating} from 'primereact/rating';



class Pembelian extends Component {

    state = {
        transaction : null,
        modal_detail: false,
        modal_finish: false,
        detail_product: null,
        transaction_id:'',
        rating: [],
    }

    componentDidMount(){
        this.getTransaction()
    }

    getTransaction = ()=>{
        let customer_id = this.props.id

        axios.get(`/transaction/${customer_id}`)
        .then(res=>{

            this.setState({
                transaction: res.data.reverse()
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }

    uploadPaymentProof = async(transaction_id)=>{
        const { value: file } = await Swal.fire({
            title: 'Select image',
            input: 'file',
            inputAttributes: {
              accept: 'image/*',
              'aria-label': 'Upload your profile picture'
            }
          })
          
          if (file) {
            const reader = new FileReader()
            console.log(file)
            let formData = new FormData()
            formData.append("payment_proof", file)
            axios.patch(`/transaction/upload/${transaction_id}`, formData)
            .then(res=>{
                reader.onload = (e) => {
                  Swal.fire({
                    title: 'Your uploaded picture',
                    imageUrl: e.target.result,
                    imageAlt: 'The uploaded picture'
                  })
                  this.getTransaction()
                  console.log(res.data)
                }
                reader.readAsDataURL(file)
            })
            .catch(err=>{
                console.log(err)
            })
          }
    }

    seeDetail = (transaction_id)=>{
        this.setState({
            modal_detail: !this.state.modal_detail
        })
        // console.log(transaction_id)
        axios.get(`/transaction/getDetail/${transaction_id}`)
        .then(res=>{
            this.setState({detail_product : res.data})
            console.log(res.data.length)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    toggle_exit_detail = ()=>{
        this.setState({
            modal_detail: !this.state.modal_detail
        })
        
    }

    renderDetail = ()=>{
        if(this.state.detail_product === null){
            return
        }
        let i = 0
        let render = this.state.detail_product.map((val)=>{
            i++
            return (
                <tr key={val.transaction_id}>
                    <td>{i}</td>
                    <td><img style={{width:45, height:45}} src={val.image_product} alt="Gambar Produk"/></td>
                    <td>{val.product}</td>
                    <td>{val.qty}</td>
                    <td>Rp.{Intl.NumberFormat().format(val.price).replace(/,/g, '.')}</td>
                </tr>
            )
        })
        return render
    }

    renderReview = ()=>{
        if(this.state.detail_product === null){
            return
        }
        
        let i = 0

        console.log(this.state.detail_product)
        
        let render = this.state.detail_product.map((val)=>{
            i++

        if(val.reviewed === '1'){
           
            return(
                <tr key={i}>
                <td>{i}</td>
                <td><img src={val.image_product} style={{width:45, height:45}} alt="Gambar Produk"/></td>
                <td className="w-25">{val.product}</td>
                <td>
                    <Rating style={{color: "yellow"}} value={val.rating} readonly={true} stars={5} cancel={false} />
                </td>
                <td><textarea disabled defaultValue={val.comment} className="form-control" id="" cols="40" rows="4"/></td>
                <td><p className="bg-success">Already Review</p></td>
            </tr>
            )
        }
            let index = this.state.rating[i-1].index
            return(
                <tr key={i}>
                    <td>{i}</td>
                    <td><img src={val.image_product} style={{width:45, height:45}} alt="Gambar Produk"/></td>
                    <td className="w-25">{val.product}</td>
                    <td>
                    <StarRatings
                        id={i}
                        rating={this.state.rating[i-1].rate}
                        starRatedColor="yellow"
                        changeRating={this.changeRating}
                        starDimension='30px'
                        starSpacing = '2px'
                        numberOfStars={5}
                        name={`rating${i-1}`}
                    />
                    </td>
                    <td><textarea ref={(input)=>{this.comment = input}} className="form-control" id={`comment${i-1}`} cols="40" rows="4"></textarea></td>
                    <td><button onClick={()=>{this.submitReview(val.product_id, index )}} id={`button${i}`} className="btn btn-warning">Submit</button></td>
                </tr>
            )
        })
        return render
    }

    changeRating = ( newRating, name )=> {
        let index = this.state.rating.findIndex(x=> x.name === name)
        let data = {rate : newRating}
        this.setState({
            rating: [
               ...this.state.rating.slice(0,index),
               Object.assign({}, this.state.rating[index], data),
               ...this.state.rating.slice(index+1)
            ]
          });
    }

    toggle_modal_finish = (transaction_id, status)=>{
        
        if(status === 'Delivered'){
            Swal.fire({
                title: 'Produk diterima?',
                text: "Pastikan produk sudah diterima!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sudah, Transaksi Selesai'
              }).then((result) => {
                if (result.value) {
                    axios.patch(`/transaction/completed/${transaction_id}`)
                    .then(res=>{
                        Swal.fire(
                            'Transaksi Selesai',
                            'Terimakasih sudah belanja! Silahkan beri ulasan tentang produk kami',
                            'success'
                        )
                        this.getTransaction()
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                    
                }
              })
        }else{
            this.setState({modal_finish: !this.state.modal_finish, transaction_id:transaction_id})
            axios.get(`/transaction/getDetail/${transaction_id}`)
            .then(res=>{
                // console.log(res.data)
                // console.log(res.data.length)
                let data = []
                for(let i = 0; i<res.data.length; i++){
                    data.push({index: i, name: `rating${i}`, rate: 0})
                }
                // console.log(data)
                this.setState({detail_product : res.data, rating: data})
                
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }

    submitReview = (id, index)=>{
        // alert(product_id)
        let rating = this.state.rating[index].rate
        let comment = document.getElementById(`comment${index}`).value
        let product_id = id
        let customer_id = this.props.id
        let created_at = new Date()
        let transaction_id = this.state.transaction_id
        created_at = moment(created_at).format('YYYY-MM-DD HH-mm-ss')

        // console.log({rating, comment, product_id, customer_id, created_at, transaction_id})
        axios.post(`/transaction/review`, {rating, comment, product_id, customer_id, created_at, transaction_id})
        .then(res=>{
                console.log(res.data)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Ulasan berhasil di submit, terimakasih',
                    showConfirmButton: false,
                    timer: 1000
                })
                this.toggle_exit_finish()
                // this.setState({rating: 0})
           
        })
        .catch(err=>{
            console.log(err)
        })
        axios.patch(`/transaction/updateReview`, {transaction_id, product_id})
        .then(res=>{
            console.log(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    toggle_exit_finish = ()=>{
        this.setState({modal_finish: !this.state.modal_finish})
    }

    renderTransaction = ()=>{
        let transaction = this.state.transaction.map((val)=>{
            let color
            if(val.status === 'Pending'){
                color = 'orange'
            }else if(val.status === 'Sending'){
                color = 'blue'
            }else if(val.status === 'Rejected'){
                color = 'red'
            }else{
                color = 'green'
            }
            return(
                <div key={val.transaction_id} className="border rounded shadow-sm m-3 overflow-auto">
                    <div className="p-4">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="d-flex flex-column">
                                <p className="m-0">Tanggal Transaksi</p>
                                <p className="m-0 font-weight-bold">{moment(val.created_at).format("MMMM Do YYYY, h:mm:ss a")}</p>
                            </div>
                            <div className="d-flex flex-column">
                                <p className="m-0 text-right">Status</p>
                                <p className="m-0 font-weight-bold px-2 border rounded-pill text-center" style={{backgroundColor: color}}>{val.status}</p>
                                <p className="m-0 font-weight-bold" style={{color:'red'}}>{val.notes}</p>
                            </div>
                        </div>
                        <hr/>
                        <div className="d-flex flex-row flex-wrap justify-content-between">
                            <div className="d-flex flex-column align-items-center" style={{flex:1}}>
                                <img src={val.payment_proof} className="img-thumbnail" style={{width:'20%', minWidth:100}} alt="Upload Bukti Pembayaran"/>
                                {val.status !== 'Pending' && val.status !== 'Rejected' ? '' : <button onClick={()=>{this.uploadPaymentProof(val.transaction_id)}} className="btn btn-outline-info mt-3">Upload</button> }
                                
                            </div>
                            <div className="d-flex flex-column" style={{width:350}}>
                                <p className="my-0 font-weight-bold">Penerima: </p>
                                <p>{val.penerima}</p>
                                <p className="my-0 font-weight-bold">Alamat Pengiriman :</p>
                                <p>{val.destination}</p>
                            </div>

                            <div className="d-flex flex-column" style={{width:300}}>
                                <p className="my-0 font-weight-bold">No Resi: </p>
                                <p>{val.no_resi ? val.no_resi : 'No Resi Belum di upload oleh admin'}</p>
                                <p className="my-0 font-weight-bold">No Invoice: </p>
                                <p>{val.no_invoice}</p>
                            </div>
                            
                            <div className="d-flex flex-column justify-content-between">
                                <p className="mb-0 font-weight-bold">Total Belanja</p>
                                <p className="">Rp.{Intl.NumberFormat().format(val.grand_total).replace(/,/g, '.')}</p>

                                {val.status !== 'Pending' && val.status !== 'Rejected' && val.status !== 'Sending' ? <button onClick={()=>{this.toggle_modal_finish(val.transaction_id, val.status)}} className="btn btn-success">{val.status === 'Delivered' ? 'Produk Diterima': 'Review Produk'}</button> : ''}

                                <button onClick={()=>{this.seeDetail(val.transaction_id)}} className="btn btn-outline-warning ">See Detail</button>
                            </div>
                        </div>
                        <hr/>
                    </div>
                </div>
            )
        })

        return transaction
    }

    render() {

        if(this.props.id){

            if(this.state.transaction === null){
                return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
            }

            if(this.state.transaction.length === 0){
                return(
                    <div className="main-content">
                        <div className="pt-5">
                            <div className="mt-5">
                            <center>
                                <h1 className="display-4">Oops!</h1>
                                <h3>Belum pernah melakukan transaksi</h3>
                                <h3>Mulai belanja disini</h3>
                                <Link to="/">
                                    <button className="btn btn-info">Belanja</button>
                                </Link>
                            </center>
                            </div>
                        </div>
                    </div>
                )
            }
    
            return (
                <div className="main-content">
                    <div className="pt-5">
                        <div className="container border rounded mb-5" style={{backgroundColor:'white'}}>
                            {this.renderTransaction()}
                        </div>
                        <div>
                        <Modal size={'lg'} isOpen={this.state.modal_detail} toggle={this.toggle_exit_detail}>
                            <ModalHeader toggle={this.toggle_exit_detail}>Detail Transaksi</ModalHeader>
                            <ModalBody>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <td>No</td>
                                            <td>Gambar</td>
                                            <td>Product</td>
                                            <td>Qty</td>
                                            <td>Harga</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderDetail()}
                                    </tbody>
                                </table>
                            </ModalBody>
                            <ModalFooter>
                            <Button color="secondary" onClick={this.toggle_exit_detail}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                        <Modal size={'xl'} isOpen={this.state.modal_finish} toggle={this.toggle_exit_finish}>
                            <ModalHeader toggle={this.toggle_exit_finish}>Finish Transaksi</ModalHeader>
                            <ModalBody>
                                <center>
                                    <h1 className="lead">Berikan review tentang produk yang dibeli</h1>
                                    
                                    <table className="table table-responsive">
                                        <thead>
                                            <tr>
                                                <td>No</td>
                                                <td>Gambar</td>
                                                <td>Produk</td>
                                                <td>Rating</td>
                                                <td>Review</td>
                                                <td>Action</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderReview()}
                                        </tbody>
                                    </table>
                                </center>
                            </ModalBody>
                            <ModalFooter>
                            
                            <Button color="secondary" onClick={this.toggle_exit_finish}>Exit</Button>
                            </ModalFooter>
                        </Modal>
                        </div>
                        <Footer/>
                    </div>
                </div>
            )
        }else{
            return <Redirect to="/" />
        }

    }
}

const mapStateToProps = (state)=>{
    return {
        id: state.auth.id
    }
}

export default connect(mapStateToProps)(Pembelian)
