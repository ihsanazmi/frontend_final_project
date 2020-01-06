import React, { Component } from 'react'
import Footer from './Footer'
import {Checkbox} from 'primereact/checkbox';
import axios from '../config/axios'
import ReactTooltip from 'react-tooltip'
import {Rating} from 'primereact/rating';
import queryString from 'query-string'
import {Link} from 'react-router-dom'
import Swal from 'sweetalert2'
import moment from 'moment'
import {connect} from 'react-redux'
import {Spinner} from 'reactstrap'

class Catalog extends Component {

    state ={
        checked: false,
        type: [],
        category: [],
        allType: null,
        allCategory : null,
        allProduct: null,
        seacrhProduct: null,
        mulaiDari: '',
        hingga: '',
        keywords: ''
    }

    componentDidMount(){
        const values = queryString.parse(this.props.location.search)
        let id_category = values.id_category
        let id_type = values.id_type
        // this.setState({mulaiDari: 2})

        if(id_category !== undefined){
            let selectedCategory = [...this.state.category]
            selectedCategory.push(parseInt(id_category))
            this.setState({category: selectedCategory})
        }

        if(id_type !== undefined){
            let selectedType = [...this.state.type];
            selectedType.push(parseInt(id_type));
            this.setState({type: selectedType});
        }

        this.getAllProduct()
        this.getType()
        this.getCategory()
    }

    getAllProduct = ()=>{
        axios.get('/products')
        .then(res=>{
            this.setState({allProduct:res.data})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    getCategory = ()=>{
        axios.get('/products/getkategori')
        .then(res=>{
            this.setState({allCategory: res.data})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    getType = ()=>{
        axios.get('/products/type_products')
        .then(res=>{
            this.setState({allType: res.data})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    searchPrice = ()=>{
        this.setState({
            mulaiDari: parseInt(this.mulaiDari.value),
            hingga: parseInt(this.hingga.value)
        })
    }

    clearSearch = ()=>{
        this.setState({
            mulaiDari: '',
            hingga: '',
            keywords: ''
        })
        this.mulaiDari.value = ''
        this.hingga.value = ''
        this.searchName.value = ''
    }

    filterName = ()=>{
        let keywords = this.searchName.value
        // console.log(keywords)
        this.setState({keywords})
    }

    dataCatalog = ()=>{

        let dataAllProduct = this.state.allProduct
        let resultFilter = []
        if(this.state.type.length !== 0){
            dataAllProduct.filter((val)=>{
                for (let i = 0; i < this.state.type.length; i++){
                    if(val.id_tipe === this.state.type[i]){
                        resultFilter.push(val)
                    }
                }
                return dataAllProduct
            })
        }else{
            resultFilter = this.state.allProduct
        }

        let resultFilterCat = []
        if(this.state.category.length !== 0 && this.state.type.length !== 0){
            resultFilter.filter((val)=>{
                for(let i = 0; i < this.state.category.length; i++){
                    if(val.id_category === this.state.category[i]){
                        resultFilterCat.push(val)
                    }
                }
                return resultFilter
            })
            resultFilter = resultFilterCat
        }else if(this.state.category.length !== 0 && this.state.type.length === 0){
            dataAllProduct.filter((val)=>{
                for(let i = 0; i<this.state.category.length; i++){
                    if(val.id_category === this.state.category[i]){
                        resultFilterCat.push(val)
                    }
                }
                return dataAllProduct
            })
            resultFilter = resultFilterCat
        }

        if(this.state.mulaiDari && !this.state.hingga ){
            let filterPrice = resultFilter.filter((val)=>{
                return val.harga >= this.state.mulaiDari
            })
            resultFilter = filterPrice
        }else if(this.state.mulaiDari && this.state.hingga){
            let filterPrice = resultFilter.filter((val)=>{
                return val.harga >= this.state.mulaiDari && val.harga <= this.state.hingga
            })
            resultFilter = filterPrice
        }else if(!this.state.mulaiDari && this.state.hingga){
            let filterPrice = resultFilter.filter((val)=>{
                return val.harga <= this.state.hingga
            })
            resultFilter = filterPrice
        }

        if(this.state.keywords){
            let filterName = []
            filterName = resultFilter.filter((val)=>{
                return val.nama_produk.toLowerCase().includes(this.state.keywords.toLowerCase())
            })
            resultFilter = filterName
        }

        // console.log(resultFilter)
        
        if(resultFilter.length !== 0){
            let catalog = resultFilter.map((val)=>{
                return(
                    <div key={val.id} className=" card mx-3 mb-3 px-3 pb-3 shadow-sm" style={{width: '14rem'}}>
                        <Link to={`/detail/${val.id}`}>
                            <img className="card-img-top align-self-center" src={val.gambar} alt="img" style={{cursor:'pointer'}}/>
                        </Link>
                        <div className="card-body">
                            <p data-tip={val.nama_produk} className="font-weight-bold card-title text-truncate mb-0">{val.nama_produk}</p>
                            <p className="card-text font-weight-bold">Rp.{Intl.NumberFormat().format(val.harga).replace(/,/g, '.')}</p>
                            <center>
                                <Rating style={{color: "yellow"}} value={val.rating} readonly={true} stars={5} cancel={false} />
                            </center>
                            <button onClick={()=>{this.addToCart(val.id, val.harga, val.stock)}} className="btn btn-block btn-outline-dark my-2">Add to Cart</button>
                        </div>
                    </div>
                )
            })
            return catalog
        }else{
            return (
                <div className="align-self-center">
                    <h1>Product Not Found</h1>
                </div>
            )
        }

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
                        title: 'Produk Baru berhasil di ubah',
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

    onCategoryChange = (e)=>{
        // console.log(e.value)
        let selectedCategory = [...this.state.category];
        
        if(e.checked)
            selectedCategory.push(e.value);
        else
            selectedCategory.splice(selectedCategory.indexOf(e.value), 1);

        this.setState({category: selectedCategory});
    }

    onTypeChange=(e)=>{
        // console.log(e.value)
        let selectedType = [...this.state.type];
        
        if(e.checked)
            selectedType.push(e.value);
        else
            selectedType.splice(selectedType.indexOf(e.value), 1);

        this.setState({type: selectedType});
    }

    renderCbCategory = ()=>{
        let cbCat = this.state.allCategory.map((val)=>{
            return (
                <div key={val.id} className="px-2 pb-1">
                    <Checkbox inputId={`cbCat${val.id}`} value={val.id} onChange={this.onCategoryChange} checked={this.state.category.indexOf(val.id) !== -1}></Checkbox>
                    <label htmlFor={`cbCat${val.id}`} className="p-checkbox-label">{val.category}</label>
                </div>  
            )
        })
        return cbCat
    }

    renderCbType = ()=>{
        let cbType = this.state.allType.map((val)=>{
            return (
                <div key={val.id} className="px-2 pb-1">
                    <Checkbox inputId={`cb${val.id}`} value={val.id} onChange={this.onTypeChange} checked={this.state.type.indexOf(val.id) !== -1}></Checkbox>
                    <label htmlFor={`cb${val.id}`} className="p-checkbox-label">{val.type}</label>
                </div>  
            )
        })
        return cbType
    }

    render() {
        if(this.state.allType === null || this.state.allCategory === null){
            return <Spinner size="lg" animation="border" className="d-flex justify-content-center mx-auto d-block" style={{marginTop : '50vh'}} />
        }
        // console.log(this.state.mulaiDari)
        return (
            <div className="pt-5">
                <div className="container-fluid">
                    <div className="row">
                        <div className="mx-5 mb-5 shadow-sm col-10 col-md-2 border rounded-lg overflow-auto" style={{height:'115vh'}}>
                            <h4 className="pt-4">Filter</h4>
                            <hr/>
                            <div>
                                <input type="text" className="form-control mb-2" ref={(input)=>{this.searchName = input}} onChange={this.filterName} placeholder="Nama Produk" />
                            </div>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                <div className="input-group-text">Rp</div>
                                </div>
                                <input ref={(input)=>{this.mulaiDari = input}} type="number" className="form-control" id="inlineFormInputGroup" placeholder="Dari"/>
                            </div>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                <div className="input-group-text">Rp</div>
                                </div>
                                <input ref={(input)=>{this.hingga = input}} type="number" className="form-control" id="inlineFormInputGroup" placeholder="Hingga"/>
                            </div>

                            <button onClick={this.clearSearch} className="btn btn-outline-dark">Clear</button>
                            <button onClick={this.searchPrice} className="btn btn-dark mx-2">Cari</button>

                            <hr/>

                            <p className="font-weight-bold mt-3">Tipe Produk</p>
                            <div className="overflow-auto d-flex flex-column" style={{height:200, whiteSpace:'nowrap'}}>
                                {this.renderCbType()}
                            </div>
                            
                            <hr/>

                            <p className="font-weight-bold mt-3">Kategori Produk</p>
                            <div className="overflow-auto d-flex flex-column" style={{height:250 , whiteSpace:'nowrap'}}>
                                {this.renderCbCategory()}
                            </div>
                        </div>
                        
                        <div className="col-12 ml-auto col-md-9">
                            <div className="row">
                            <ReactTooltip place="top" type="dark" effect="solid"/>
                                {this.dataCatalog()}
                            </div>
                            {/* <RenderCatalog  /> */}
                        </div>
                    </div>
                </div>
                <div>
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

export default connect(mapStateToProps)(Catalog)
