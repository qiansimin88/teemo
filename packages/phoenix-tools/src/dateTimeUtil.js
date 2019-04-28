export default {
    getDate(tm) {
        return (new Date(tm)).toISOString().slice(0, 19).replace(/T/g, " ");
    },
    getNowTime() {
        let now = new Date();
        let y = now.getFullYear();
        let m = now.getMonth() + 1;
        let d = now.getDate();
        return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
    },
    date2Timestamp(date) {
        if (!date || date === '') return '';
        // console.log(date);
        // date = date.replace(/-/g, '/');
        return new Date(date).getTime();
    },
    tranTime(timeStamp) {
        if (timeStamp === '') return '';
        var date = new Date(timeStamp);
        var Month = parseInt(date.getMonth(), 10) + 1;
        return date.getFullYear() + '-' +
            (Month < 10 ? '0' + Month : Month) + '-' +
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '  ' +
            (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' +
            (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
            (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    },
    tranDate(timeStamp) {
        if (timeStamp === '') return '';
        var date = new Date(timeStamp);
        var Month = parseInt(date.getMonth(), 10) + 1;
        return date.getFullYear() + '-' +
            (Month < 10 ? '0' + Month : Month) + '-' +
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    }
};
