import React, { Component } from 'react'
import img from '../img/notFound.png'
import {Link} from 'react-router-dom'

export class NotFound extends Component {
    render() {
        return (
            <div className="container">
                <div className="d-flex flex-row justify-content-between align-items-center" style={{height:'100vh'}}>
                    <img className="w-50" src={img} alt=""/>
                    <div className="d-flex flex-column text-center">
                        <p className="mb-0">This is a 404 page and we think it's fairly clear</p>
                        <p className="mb-0">You aren't going to find what you're looking for here</p>
                        <p className="mb-0">But we know you're hungry, so don't fret or rage</p>
                        <p className="mb-0">Hit that big red button to go back to our homepage</p>
                        <Link to="/">
                            <button className="btn btn-success mt-3">Back to Home</button>
                        </Link>
                    </div>

                </div>
            </div>
        )
    }
}

export default NotFound
