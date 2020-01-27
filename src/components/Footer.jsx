import React, { Component } from 'react'
import Deliver from '../img/DELIVER.png'
import Lowprice from '../img/LOWPRICE.png'
import Secure from '../img/SECURE.png'
import Trusted from '../img/TRUSTED.png'
import {NavLink } from 'reactstrap';
import {Link} from 'react-router-dom'

class Footer extends Component {
    render() {
        return (
            <div className="shadow-lg w-100" style={{}}>
                <div className="container">
                    <div className="py-5 d-flex flex-row flex-wrap justify-content-around align-items-center">
                        <div className="d-flex flex-column align-items-center">
                            <img src={Lowprice} alt="low"/>
                            <p>Harga Termurah</p>
                        </div>
                        <div  className="d-flex flex-column align-items-center">
                            <img src={Trusted} alt="trusted"/>
                            <p>Terpercaya</p>
                        </div>
                        <div  className="d-flex flex-column align-items-center">
                            <img src={Deliver} alt="deliver"/>
                            <p>Dijamin Sampai</p>
                        </div>
                        <div  className="d-flex flex-column align-items-center">
                            <img src={Secure} alt="secure"/>
                            <p>Jaminan Keamanan</p>
                        </div>
                    </div>

                    <hr/>

                    <div className="py-5 d-flex flex-wrap flex-row justify-content-around">
                        <div>
                            <p className="font-weight-bold">Bantuan</p>
                            <ul className="list-unstyled">
                                <NavLink className="pl-0 pt-0" tag={Link} to="/howtopay">
                                    <li className="pb-3 text-muted">Pembayaran</li>
                                </NavLink>
                                <NavLink className="pl-0 pt-0" tag={Link} to="/howtopay">
                                    <li className="pb-3 text-muted">Pengiriman</li>
                                </NavLink>
                                <NavLink className="pl-0 pt-0" tag={Link} to="/howtopay">
                                    <li className="pb-3 text-muted">Hubungi Kami</li>
                                </NavLink>
                                
                            </ul>
                        </div>
                        <div>
                            <p className="font-weight-bold">Tentang Kami</p>
                            <ul className="list-unstyled">
                                <NavLink className="pl-0 pt-0" tag={Link} to="/howtopay">
                                    <li className="pb-3 text-muted">Tentang Kami</li>
                                </NavLink>
                                <NavLink className="pl-0 pt-0" tag={Link} to="/howtopay">
                                    <li className="pb-3 text-muted">Our Store</li>
                                </NavLink>
                                <NavLink className="pl-0 pt-0" tag={Link} to="/howtopay">
                                    <li className="pb-3 text-muted">Kebijakan Privasi</li>
                                </NavLink>
                                
                            </ul>
                        </div>
                        <div>
                            <p className="font-weight-bold">Toko Kami</p>
                            <ul className="list-unstyled">
                                <li className="pb-2"><p className="text-muted">Bandung, 40599</p></li>
                                <li className="pb-2"><p className="text-muted">Buka Senin-Sabtu, 10:00-19:00 WIB</p></li>
                                <li className="pb-2"><p className="text-muted"><i className="fas fa-phone"></i> 081931474569</p></li>
                                <li className="pb-2"><p className="text-muted"><i className="fas fa-envelope"></i> project.computer.shop@gmail.com</p></li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-weight-bold">Social Media</p>
                            <div className="d-flex flex-row justify-content-around">
                                <a className="text-dark" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" ><i className="fab fa-facebook"></i></a>
                                <a className="text-dark" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                                <a className="text-dark" href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                            </div>
                        
                        </div>
                    </div>

                    <hr/>

                    <div className="pb-2">
                        <p>Copyright 2019 <b><a className="text-decoration-none text-black-50" target="_blank" href="/">ComputerShop Developer</a></b>. All Rights Reserved</p>
                    </div>

                </div>
            </div>
        )
    }
}

export default Footer
