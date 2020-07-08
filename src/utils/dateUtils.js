export function formatDate(time) {
    if(!time) return '';
    else {
        let date = new Date(time)
        return date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear()+"-"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
    }
}