import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Spinner} from 'reactstrap'
import axios from '../config/axios'
import Typewriter from 'typewriter-effect'
import ReactTooltip from 'react-tooltip'
import {Carousel} from 'primereact/carousel';
import {Rating} from 'primereact/rating';
import Swal from 'sweetalert2'
import moment from 'moment'
import Footer from './Footer'

const responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 2,
        numScroll: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
];

export class Home extends Component {

    state = {
        type: null,
        category:null,
        bestSeller:null,
    }

    componentDidMount(){
        this.getTipe()
        this.getCategory()
        this.getBestSeller()
    }

    getBestSeller = ()=>{
        axios.get(`/infoTotalTerjual`)
        .then(res=>{
            this.setState({bestSeller: res.data})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    getTipe = ()=>{
        axios.get('/products/type_products')
        .then(res=>{
            this.setState({type : res.data})
        })
    }

    getCategory = ()=>{
        axios.get('/products/homekategori')
        .then(res=>{
            this.setState({category: res.data})
        })
    }

    addToCart = (id, harga, stock)=>{
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

        if(stock === 0){
            return(
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Stock habis, tunggu beberapa hari',
                    showConfirmButton: false,
                    timer: 1000
                })
            )
        }
        let customer_id = this.props.id
        let product_id = id
        let qty = 1
        let price = harga
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
                        title: 'Produk Baru berhasil di tambah',
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
                        title: 'Qty produk berhasil di ubah',
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

    renderType = ()=>{
        let hasil = this.state.type.map((val)=>{
            return (
                <Link key={val.id} to={`/catalog?id_type=${val.id}`}>
                    <div  className="d-flex flex-column align-items-center" style={{cursor:'pointer'}}>
                        <img style={{width:64}} src={val.type_image} alt="png"/>
                        <p className="mt-2 px-3 ph-2 rounded-pill border">{val.type}</p>
                    </div>
                </Link>
            )
        })
        return hasil
    }

    renderCategory = ()=>{
        let hasil = this.state.category.map((val)=>{
            return(
                <Link key={val.id} to={`/catalog?id_category=${val.id}`}>
                    <div key ={val.id} className="px-3 mx-1 mb-3 d-inline-block rounded-pill border" style={{cursor:'pointer'}}>
                        <img style={{width:24}} src={val.type_image} alt=""/><span>{` ${val.category}`}</span>
                    </div>
                </Link>
            )
        })
        return hasil
    }

    productTemplate = (products)=>{
        
        return(
            <div className=" card m-3 p-3" style={{width:'14rem'}}>
                <Link to={`/detail/${products.product_id}`}>
                <img className="card-img-top align-self-center" src={products.image_product} alt="img" style={{cursor:'pointer'}}/>
                </Link>
                <div className="card-body">
                    <p data-tip={products.product} className="font-weight-bold card-title text-truncate">{products.product}</p>
                    <p className="card-text font-weight-bold">Rp.{Intl.NumberFormat().format(products.price).replace(/,/g, '.')}</p>
                    <Rating style={{color: "yellow"}} value={5} readonly={true} stars={5} cancel={false} />
                    <button onClick={()=>{this.addToCart(products.product_id, products.price, products.stock)}} className="btn btn-block btn-outline-dark my-2">Add to Cart</button>
                </div>
            </div>
        )
    }

    render() {
        if(this.state.type === null || this.state.category === null || this.state.bestSeller === null){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }

        return (
            <div>
                <div className="pt-3">
                    <div className="welcomeFont m-3 mx-auto container rounded shadow" >
                        <div className="p-1 text-center">
                            <h1 className="display-2 mt-4">
                                <Typewriter
                                    onInit={(typewriter) => {
                                        typewriter.typeString('Welcome to Our Online Store')
                                        typewriter.typeString('<h1 class="display-3 d-inline-block">Please enjoy your shopping!</h1>')
                                        .start()
                                    }}
                                    options={{
                                        cursor:''
                                    }}
                                />
                            </h1>
                        </div>
                    </div>

                    <div className="mt-5 container rounded shadow" >
                        <div className="pt-4 px-3">
                            <h4>Pilihan Produk Kami</h4>
                        </div>
                        <div className="mt-3 d-flex flex-row overflow-auto justify-content-around" >
                            {this.renderType()}
                        </div>
                        <hr/>
                        <div className=" px-3">
                            <h5>Pilihan Kategori Kami</h5>
                        </div>
                        <div className="overflow-auto mt-3 px-3" style={{whiteSpace:'nowrap'}}>
                            {this.renderCategory()}
                        </div>
                    </div>

                    <div className=" container mt-5 container rounded shadow" style={{display: this.state.bestSeller> 0 ? '' : 'none'}}>
                        <div className="pt-4 px-3">
                            <h4>Best Seller</h4>
                        </div>
                        <ReactTooltip place="top" type="dark" effect="solid"/>
                        <Carousel 
                            value={this.state.bestSeller} 
                            itemTemplate={this.productTemplate}
                            numVisible={4} 
                            numScroll={3} 
                            responsiveOptions={responsiveOptions}
                        />        
                    </div>
                </div>
                <div className="mt-5">
                    <Footer/>
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

export default connect(mapStateToProps)(Home)
