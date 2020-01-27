import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect,} from 'react-router-dom'
import axios from '../../config/axios'
import moment from 'moment'
import ModalImage from "react-modal-image"
import Swal from 'sweetalert2'
import {Calendar} from 'primereact/calendar'
import queryString from 'query-string'
import {Spinner} from 'reactstrap'

class ManageTransaction extends Component {
    
    
    state={
        allTransaction : null,
        total_transaction : '',
        pending : '',
        sending : '',
        rejected : '',
        completed : '',
        delivered: '',
        cancel : '',
        filter: 'all',
        dates2: [],
        search_invoice:''
    }

    componentDidMount(){
        const values = queryString.parse(this.props.location.search)
        // console.log(values.status)
        if(values.status){
            this.setState({filter: values.status})
        }
        this.getAllTransaction()
    }

    getAllTransaction = ()=>{
        axios.get(`/getAllTransaction`)
        .then(res=>{
            let pending = 0
            let sending = 0
            let rejected = 0
            let delivered = 0
            let completed = 0
            let cancel = 0
            res.data.map((val)=>{
                if(val.status === 'Pending'){
                    pending = pending + 1
                }else if(val.status === 'Sending'){
                    sending = sending + 1
                }else if(val.status === 'Rejected'){
                    rejected = rejected + 1
                }else if(val.status === 'Completed'){
                    completed = completed + 1
                }else if(val.status === 'Delivered'){
                    delivered = delivered + 1
                }else if(val.status === 'Cancel'){
                    cancel = cancel + 1
                }
                return res.data
            })
            
            this.setState({
                allTransaction: res.data, 
                total_transaction : res.data.length,
                pending : pending,
                // allTransaction : this.state.allTransaction.length,
                sending : sending,
                rejected : rejected,
                completed : completed,
                delivered : delivered,
                cancel : cancel
            })

        })
        .catch(err=>{
            console.log(err)
        })
    }

    rejectTransaction = async(id_transaction)=>{

        const { value: notes } = await Swal.fire({
            input: 'textarea',
            title: 'Alasan reject',
            inputPlaceholder: 'Type your message here...',
            inputAttributes: {
              'aria-label': 'Type your message here'
            },
            showCancelButton: true
          })
          
        if (notes) {
            axios.patch(`/transaction/reject/${id_transaction}`, {notes})
            .then(res=>{
                console.log(res.data)
                this.getAllTransaction()
            })  
            .catch(err=>{
                console.log(err)
            })
        }
    }

    addResi = async(transaction_id)=>{
        const { value: no_resi } = await Swal.fire({
            title: 'Masukan Nomor Resi',
            input: 'text',
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return 'Nomor Resi Tidak Boleh Kosong'
              }
            }
          })
          let updated_at = new Date()
          updated_at = moment(updated_at).format('YYYY-MM-DD HH-mm-ss')
          if (no_resi) {
              axios.patch(`/transaction/updateResi/${transaction_id}`, {no_resi, updated_at})
              .then(res=>{
                console.log(res.data)
                Swal.fire(`Nomor Resi adalah ${no_resi}`)
                this.getAllTransaction()
              })
              .catch(err=>{
                console.log(err)
              })
          }
          
    }

    filterTransaction = (param)=>{
        this.setState({filter: param})
    }

    searchInvoice = ()=>{
        let keywords = this.search.value
        // console.log(keywords)
        this.setState({search_invoice : keywords})
    }

    resetFilter = ()=>{
        this.setState({
            dates2: [],
            search_invoice: ''
        })
        this.search.value = ''
    }

    finishTransaction = (transaction_id)=>{
        let delivered_at = new Date()
        delivered_at = moment(delivered_at).format('YYYY-MM-DD HH-mm-ss')

        axios.patch(`/transaction/delivered/${transaction_id}`, {delivered_at})
        .then(res=>{
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Pesanan sudah sampai kepada penerima',
                showConfirmButton: false,
                timer: 1000
            })
            console.log(res.data)
            this.getAllTransaction()
        })
        .catch(err=>{
            console.log(err)
        })
    }

    renderAllTransaction = ()=>{
        
        let dataTransaction = this.state.allTransaction
        let resultFilter = []

        if(this.state.filter === 'pending'){
            resultFilter = dataTransaction.filter((val)=>{
                return val.status === 'Pending'
            })
        }else if(this.state.filter === 'all'){
            resultFilter = this.state.allTransaction
        }else if(this.state.filter === 'rejected'){
            resultFilter = dataTransaction.filter((val)=>{
                return val.status === 'Rejected'
            })
        } else if(this.state.filter === 'completed'){
            resultFilter = dataTransaction.filter((val)=>{
                return val.status === 'Completed'
            })
        }else if(this.state.filter === 'sending'){
            resultFilter = dataTransaction.filter((val)=>{
                return val.status === 'Sending'
            })
        }else if(this.state.filter === 'delivered'){
            resultFilter = dataTransaction.filter((val)=>{
                return val.status === 'Delivered'
            })
        }else if(this.state.filter === 'cancel'){
            resultFilter = dataTransaction.filter(val=>{
                return val.status === 'Cancel'
            })
        }
        
        if(this.state.dates2.length !== 0){
            let filterTanggal = []
            if(this.state.dates2[0] !== null && this.state.dates2[1] !== null){
                filterTanggal = resultFilter.filter((val)=>{
                    return  new Date(val.created_at).getTime() > this.state.dates2[0].getTime() && new Date(val.created_at).getTime() < this.state.dates2[1].getTime()
                })
                resultFilter = filterTanggal
            }
        }

        if(this.state.search_invoice){
            let filterInvoice = []
            filterInvoice = resultFilter.filter((val)=>{ 
                // console.log(this.state.search_invoice)
                return val.no_invoice.toLowerCase().includes(this.state.search_invoice.toLowerCase())
            })
            // console.log(dataTransaction)
            resultFilter = filterInvoice
        }
        
        let render = resultFilter.map((val)=>{
            let color
            if(val.status === 'Pending'){
                color = 'orange'
            }else if(val.status === 'Sending'){
                color = 'blue'
            }else if(val.status === 'Rejected'){
                color = 'red'
            }else if(val.status === 'Cancel'){
                color = 'red'
            }else{
                color = 'green'
            }
            
            return (
                <tr key={val.transaction_id}>
                    <td> 
                        <p className="mb-0 text-center">{moment(val.created_at).format("DD MMM YYYY, h:mm:ss a")}</p>
                        <p className="border rounded-pill px-3 text-center" style={{backgroundColor: color}}>{val.status}</p>
                    </td>
                    <td>
                        <p className="mb-0">{val.name}</p>
                        <p>{val.email}</p>
                    </td>
                    <td>
                        <p className="mb-0 font-weight-bold">Penerima:</p>
                        <p>{val.penerima}</p>
                        <p className="mb-0 font-weight-bold">Alamat:</p>
                        <p>{val.destination}</p>
                    </td>
                    <td>
                        <p className="mb-0 font-weight-bold"> No Invoice:</p>
                        <p>{val.no_invoice}</p>
                        <p className="mb-0 font-weight-bold">No: Resi:</p>
                        <p>{val.no_resi ? val.no_resi : 'Nomor Resi Belum ditambahkan'}</p>
                    </td>
                    <td>
                        <ModalImage className="table_img_payment"
                            small={val.payment_proof}
                            large={val.payment_proof}
                            alt="Bukti Pembayaran belum di upload"
                        />
                    </td>
                    <td>
                        <p>Grand Total: Rp.{Intl.NumberFormat().format(val.grand_total).replace(/,/g, '.')}</p>
                        {val.payment_proof.slice(-4) === 'null' || val.status === 'Sending' || val.status === 'Delivered' || val.status === 'Completed' || val.status === 'Cancel' ?'' :  <button onClick={()=>{this.addResi(val.transaction_id)}} className="btn btn-block btn-outline-warning">Add No Resi</button>}
                        
                        {val.no_resi && val.status !== 'Completed' && val.status !== 'Delivered' ? <button onClick={()=>{this.finishTransaction(val.transaction_id)}} className="btn btn-block btnoutlien btn-outline-success">Finish</button> : '' }
                        
                        {val.no_resi || val.status === 'Cancel' ? '' : <button onClick={()=>{this.rejectTransaction(val.transaction_id)}} className="btn btn-block btn-outline-danger">Reject</button>}
                    </td>
                </tr>
            )
        })

        
        return render
    }
    
    render() {
        if(this.props.username){
            if(this.state.allTransaction === null){
                return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
            }
            return (
                <div className="flex-column my-5">

                    <div className="admin-content">
                        <div className="container">
                            <div className="d-flex overflow-auto flex-row mb-3">
                                <p className="font-weight-bold mb-0 pt-1 mr-2">Filter Status: </p>
                                <button onClick={()=>{this.filterTransaction('all')}} className="btn btn-outline-dark shadow">All <span className="rounded p-1 font-weight-bold">{this.state.total_transaction}</span></button>
                                <button onClick={()=>{this.filterTransaction('pending')}} className="btn btn-outline-dark ml-3 shadow">Pending <span className="rounded p-1 font-weight-bold">{this.state.pending}</span></button>
                                <button onClick={()=>{this.filterTransaction('sending')}} className="btn btn-outline-dark ml-3 shadow">Sending <span className="rounded p-1 font-weight-bold">{this.state.sending}</span></button>
                                <button onClick={()=>{this.filterTransaction('rejected')}} className="btn btn-outline-dark ml-3 shadow">Rejected <span className="rounded p-1 font-weight-bold">{this.state.rejected}</span></button>
                                <button onClick={()=>{this.filterTransaction('cancel')}} className="btn btn-outline-dark ml-3 shadow">Cancel <span className="rounded p-1 font-weight-bold">{this.state.cancel}</span></button>
                                <button onClick={()=>{this.filterTransaction('delivered')}} className="btn btn-outline-dark ml-3 shadow">Delivered <span className="rounded p-1 font-weight-bold">{this.state.delivered}</span></button>
                                <button onClick={()=>{this.filterTransaction('completed')}} className="btn btn-outline-dark ml-3 shadow">Completed <span className="rounded p-1 font-weight-bold">{this.state.completed}</span></button>
                            </div>

                            <div className="d-flex flex-row">
                                <div className="p">
                                    <Calendar placeholder="dari tanggal - ke tanggal" value={this.state.dates2} onChange={(e) => this.setState({dates2: e.value})} selectionMode="range" readonlyInput={true} showIcon={true} />
                                </div>
                            </div>
                                <p className="d-inline" style={{cursor:'pointer'}} onClick = {this.resetFilter} >Reset Filter</p>

                            <div className="card shadow mt-3">
                                <p className="card-header">Manage Transaction User</p>
                                <div className="card-body">
                            <input ref={(input)=>{this.search = input}} className="form-control" onChange={this.searchInvoice} placeholder="Search Invoice" type="text"/>

                                    <table className="table table-responsive overflow-auto">
                                        <thead>
                                            <tr>
                                                <th>Tanggal</th>
                                                <th>User</th>
                                                <th>Destination</th>
                                                <th className="col-2">No. Resi</th>
                                                <th>Payment Proof</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderAllTransaction()}
                                        </tbody>

                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return <Redirect to="/"/>
        }
    }
}

const mapStateToProps = (state)=>{
    return {
        id: state.auth.id,
        username: state.auth.username
    }
}

export default connect(mapStateToProps)(ManageTransaction)
