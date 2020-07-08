/*
    Utils component to manage local storage data
 */

import store from 'store'
const USER_KEY = 'user_key'
export default {
    /*
        store userInfo
        read userInfo
        remove userInfo
     */

    saveUser(user) {
        store.set(USER_KEY, user)
    },

    getUser() {
        return store.get(USER_KEY)||{}
    },

    removeUser() {
        store.remove(USER_KEY)
    }
}