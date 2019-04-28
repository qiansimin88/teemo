'use strict';
module.exports = function(count) {
    if (typeof count === 'string') count = parseFloat(count);

    if (count >= 1000) {
        if (count % 1000 === 0) {
            return count / 1000 + 'K';
        } else {
            return parseFloat(count / 1000).toFixed(1) + 'K';
        }
    } else {
        return count;
    }
}