import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import axios from '../../config/axios';

import TabManageProduct from './TabManageProduct'
import TabManageStock from './TabManageStock'
import TabManageCategory from './TabManageCategory'

class ManageProduct extends Component {

    render() {
        if(this.props.username){
            return (
                <div className="flex-column mt-5 mb-5">
                    <div className="admin-content">
                        <div className="container">
                            <Tabs className=" ">
                                <TabList>
                                <Tab>Manage Products</Tab>
                                <Tab>Manage Stock</Tab>
                                <Tab>Manage Category and Product Type</Tab>
                                </TabList>
                            
                                <TabPanel>
                                    <TabManageProduct/>
                                </TabPanel>
                                <TabPanel>
                                    <TabManageStock/>
                                </TabPanel>
                                <TabPanel>
                                    <TabManageCategory />
                                </TabPanel>
                            </Tabs>
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

export default connect(mapStateToProps)(ManageProduct)
