/*
    send asynchronized requests
    use axios library
    return value of the function is a promise object so that the result can be used for further operations
 */

import axios from 'axios'

export default function ajax(url, data = {}, method = 'GET') {
    if(method === 'GET') {
        return axios.get(url, {
            params: data
        })
    }
    else {
        return axios.post(url, data)
    }
} 
