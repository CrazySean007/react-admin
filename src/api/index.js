import ajax from './ajax'
import jsonp from 'jsonp'
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

export const reqAdduser = (userInfo) => ajax('/manager/user/add', userInfo, 'POST')

export const reqLocation = () => {
    const url = 'http://ip-api.com/json'
    console.log(url)
    return new Promise((resolve) => {
        jsonp(url, {
            param : 'callback'
        }, (error, response) => {
            if (!error && response.status === 'success') {
                const latitude = response.lat
                const longitude = response.lon
                console.log(latitude)
                resolve({latitude, longitude})
            } else {
                alert('location load failed!')
            }
        })
    })
}

export const reqCategoryList = (parentId) => ajax('/manage/category/list', {parentId}, 'GET')

export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {parentId, categoryName}, 'POST')

export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')

export const reqWeather = (latitude, longitude) => {
    const url = 'https://api.forecast.io/forecast/7bed1e6e8d5e3bffa65c55c1f9fa190e/'+latitude+','+longitude+'?exclude=minutely,hourly,alerts,flags'
    return new Promise((resolve, reject) => {
        jsonp(url, {
            param: 'callback'
        }, (error, response) => {
            if (!error && response.currently) {
                const result = response.currently
                var icon = ''
                switch(result.icon) {
                    case "clear-day" || "clear-night" :
                        icon = "sunny"
                        break;
                    case "rain" :
                        icon = "rain"
                        break;
                    case "snow" :
                        icon ="snow"
                        break
                    case "sleet" :
                        icon = "sleet"
                        break
                    case "wind":
                        icon = "windy"
                        break
                    case "fog":
                        icon = "foggy"
                        break
                    case "cloudly":
                        icon = "cloudy"
                        break
                    case "partly-cloudy-day" || "partly-cloudy-night":
                        icon = "pcloudy"
                        break
                    default:
                        icon = "sunny"
                }
                const weatherCondition = result.summary
                resolve({weatherCondition, icon})
            } else {
                alert('weather load failed!')
            }
        })
    })
}

export const reqProductList = (pageNum = 1, pageSize) => ajax('/manage/product/list', {pageNum, pageSize}, 'GET')

export const reqSearchProduct = (searchInfo) => ajax('/manage/product/search', searchInfo, 'GET');

export const reqSearchCategoryName = (categoryId) => ajax('/manage/category/info', {categoryId}, 'GET');

export const reqUpdateProductStatus = (data) => ajax('/manage/product/updateStatus', data, 'POST')

export const reqAddProduct = (data) => ajax('/manage/product/add', data, 'POST')

export const reqUpdateProduct = (data) => ajax('/manage/product/update', data, 'POST')

export const reqDeleteProduct = (_id) => ajax('/manage/product/delete', {_id}, 'POST')

export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

export const reqRoleList = () => ajax('/manage/role/list', {}, 'GET')

export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')

export const reqUpdateRole = (data) => ajax('/manage/role/update', data, 'POST')

export const reqUserList = () => ajax('/manage/user/list', {}, 'GET')

export const reqAddUser = (data) => ajax('/manage/user/add', data, 'POST')

export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST')

export const reqUpdateUser = (data) => ajax('/manage/user/update', data, 'POST')