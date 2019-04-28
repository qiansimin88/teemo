export default{

    m2B(value) { //M to B
        return parseInt(value, 10) * 1024 * 1024;
    },

    b2Size(bytes) {
        if (bytes === 0) return '0 B';
        let k = 1000; // or 1024
        let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    }
    
};
