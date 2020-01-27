import React, { Component } from 'react'
import axios from '../../config/axios'
import {Paginator} from 'primereact/paginator'
import {Link} from 'react-router-dom'
import {Spinner} from 'reactstrap'

import pending from '../../img/hourglass.png'
import sending from '../../img/send.png'
import rejected from '../../img/rejected.png'
import delivered from '../../img/parcel.png'
import completed from '../../img/complete.png'

class DashboardAdmin extends Component {

    state = {
        transaction: null,
        stock: null,
        totalTerjual: null,
        first: 0,
        rows: 5,
        lastIndex: 5,
        totalRecords: 0,
        first2: 0,
        rows2: 5,
        lastIndex2: 5,
        totalRecords2: 0,

    }

    componentDidMount(){
        this.getCountTransaction()
        this.infoStock()
        this.infoTerjual()
    }

    infoTerjual = ()=>{
        axios.get(`/infoTotalTerjual`)
        .then(res=>{
            this.setState({totalTerjual: res.data, totalRecords2: res.data.length})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    infoStock = ()=>{
        axios.get(`/informasiStock`)
        .then(res=>{
            this.setState({stock: res.data, totalRecords: res.data.length})
            // console.log(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    getCountTransaction = ()=>{
        axios.get(`/totalTransaction`)
        .then(res=>{
            this.setState({transaction: res.data})
            // console.log(res.data)
        })
        .catch(err=>{
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

    onPageChange2(event) {
        this.setState({
            first2: event.first,
            rows2: event.rows,
            lastIndex2: event.first + event.rows
        });
    }

    renderTerlaku = (first2, last2)=>{
        let i = 0
        let data = this.state.totalTerjual
        data = data.slice(first2, last2)
        // console.log(data)
        let result = data.map(val=>{
            i++
            return(
                <tr key={val.id}>
                    <td>{i}</td>
                    <td><img src={val.image_product} style={{width:64, height:64}} alt="img"/></td>
                    <td>{val.product}</td>
                    <td>{val.total_terjual}</td>
                </tr>
            )
        })
        return result
    }

    renderInfoStock = (first, last)=>{
        let i = 0
        let data = this.state.stock
        data = data.slice(first, last)
        let result = data.map((val)=>{
            i++
            return(
                <tr className="text-danger" key={val.id}>
                    <td>{i}</td>
                    <td><img src={val.image_product} style={{width:64, height:64}} alt="img"/></td>
                    <td>{val.product}</td>
                    <td>{val.stock}</td>
                </tr>
            )
        })
        return result
    }

    renderStatusTransaksi = ()=>{
        // let nameclass
        let result = this.state.transaction.map((val)=>{
            var nameclass
            var imgname
            var btnclass
            if(val.status === 'Pending'){
                nameclass = 'card-header bg-warning'
                imgname = pending
                btnclass = 'btn btn-outline-warning'
            }else if(val.status === 'Sending'){
                nameclass = 'card-header bg-primary'
                imgname = sending
                btnclass = 'btn btn-outline-primary'
            }else if(val.status === 'Rejected' || val.status === 'Cancel'){
                nameclass = 'card-header bg-danger'
                imgname = rejected
                btnclass = 'btn btn-outline-danger'
            }else if(val.status === 'Delivered' ){
                nameclass = 'card-header bg-info'
                imgname = delivered
                btnclass = 'btn btn-outline-info'
            }else{
                nameclass = 'card-header bg-success'
                imgname = completed
                btnclass = 'btn btn-outline-success'
            }
            return(
                <div key={val.id} className="card text-white mb-3" style={{maxWidth: '14rem'}}>
                    <div className={nameclass}>{val.status}</div>
                    <div className="card-body text-dark d-flex flex-row">
                        <img src={imgname} style={{width:42, height:42}} alt="img"/>
                        <div className="ml-3 d-flex flex-column">
                            <h5 className="card-title">{`${val.total} Transaksi`}</h5>
                            <Link to={`/admin/manageTransaction?status=${val.status.toLowerCase()}`}>
                                <button className={btnclass}>Lihat</button>                        
                            </Link>
                        </div>
                    </div>
                </div>
            )
        })

        return result
    }

    render() {
        if(this.state.transaction === null || this.state.stock === null || this.state.totalTerjual === null){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }
        // console.log(this.state.transaction)
        return (
            <div className="flex-column">
                    
                <div className="admin-content mb-5">
                    <div className="container">
                        <div className="mb-4 mt-4">
                            <div className="card">
                                <h3 className="card-header">Informasi Transaksi</h3>
                                <div className="card-body shadow rounded">
                                    <div className="d-flex flex-lg-row flex-column align-items-center justify-content-lg-between flex-wrap">
                                        {this.renderStatusTransaksi()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 col-12">
                                <div className="card">
                                    <h3 className="card-header">Informasi Stock Kurang dari 5pcs</h3>
                                    <div className="card-body shadow rounded">
                                    <Paginator first={this.state.first} rows={this.state.rows} totalRecords={this.state.totalRecords}onPageChange={(e)=>{this.onPageChange(e)}}></Paginator>
                                        <table className="table table-responsive table-hover">
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>Gambar</th>
                                                    <th>Produk</th>
                                                    <th>Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.renderInfoStock(this.state.first, this.state.lastIndex)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-12">
                                <div className="card">
                                    <h3 className="card-header">Produk Terlaku</h3>
                                    <div className="card-body shadow rounded">
                                        <Paginator first={this.state.first2} rows={this.state.rows2} totalRecords={this.state.totalRecords2} onPageChange={(e)=>{this.onPageChange2(e)}}></Paginator>
                                        <table className="table table-responsive table-hover">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Gambar</th>
                                                    <th>Produk</th>
                                                    <th>Terjual</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.renderTerlaku(this.state.first2, this.state.lastIndex2)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DashboardAdmin
