import axios from 'axios'

export default axios.create({
    // baseURL: 'http://localhost:2018'
    baseURL: 'https://backend-komputer-shop.herokuapp.com/'
})