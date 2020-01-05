import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Footer from '../Footer'

import TabBiodata from './TabBiodata'
import TabAlamat from './TabAlamat'


class Profile extends Component {

    render() {
        if(this.props.username){
            return (
                <div>
                    <div className="container">
                        <Tabs className="mt-5 pt-2  ">
                            <TabList>
                                <Tab>Biodata Diri</Tab>
                                <Tab>Alamat Pengiriman</Tab>
                            </TabList>
                        
                            <TabPanel><TabBiodata/></TabPanel>
                            <TabPanel><TabAlamat/></TabPanel>
                        </Tabs>
                    </div>
                    <Footer/>
                </div>
            )
        }else{
            return <Redirect to = '/'/>
        }
    }
}

const mapStateToProps = (state)=>{
    return{
        username: state.auth.username
    }
}

export default connect(mapStateToProps)(Profile)
