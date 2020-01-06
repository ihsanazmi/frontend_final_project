import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {Spinner} from 'reactstrap'
import {keepLogin} from '../actions/index'
import axios from '../config/axios'

import Home from './Home'
import Header from './Header'
import NotFound from './NotFound'
import Catalog from './Catalog'
import DetailProduct from './DetailProduct'
import Admin from './admin/Admin'
import Cart from './users/Cart'
import Checkout from './users/Checkout'
import Verification from './users/Verification'
import Login from './users/Login'
import Register from './users/Register'
import Profile from './users/Profile'
import Pembelian from './users/Pembelian'


export class App extends Component {

    state = {
        loading: true,
    }

    componentDidMount(){
        let userData = JSON.parse(localStorage.getItem('userdata'))
        if(userData){
            this.props.keepLogin(userData)
        }
        this.setState({loading:false})

        axios.get(`/getAllTransaction`)
        .then(res=>{
            // console.log(res.data)
            let filterTransaksi = res.data.filter((val)=>{
                return(
                    val.status === 'Pending' && val.img === null
                )
            })

            let automatedCancel = new Date()
            automatedCancel.setDate(automatedCancel.getDate() - 1)

            filterTransaksi.map((val)=>{
                let start_transaction = new Date(val.created_at)
                let user_id = val.customer_id
                let transaction_id = val.transaction_id
                if(automatedCancel > start_transaction){
                    // Tambahin stock yang di cancel
                    axios.patch(`/products/updateStockCancel`, {user_id, transaction_id})
                    .then(res=>{
                        console.log(res.data)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                    
                    // Ubah status transaksi di tabel transaksi
                    axios.patch(`/transaction/cancelTransaction`,{transaction_id} )
                    .then(res=>{
                        console.log(res.data)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }
                return filterTransaksi
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }

    render() {
        if(this.state.loading){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }

        return (
            <div>
                <BrowserRouter>
                    <div className="d-flex flex-column">
                        <Header/>
                        <Switch>
                            <Route path="/" exact component={Home}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/register" component={Register}/>
                            <Route path="/profile" component={Profile}/>
                            <Route path="/pembelian" component={Pembelian}/>
                            <Route path="/admin" component={Admin}/>
                            <Route path="/cart" component={Cart}/>
                            <Route path="/catalog" component={Catalog}/>
                            <Route path="/detail/:id_product" component={DetailProduct}/>
                            <Route path="/checkout" component={Checkout}/>
                            <Route path="/verification" component={Verification}/>
                            <Route path="*" component={NotFound}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}

export default connect(null, {keepLogin})(App)
