var stock = {
    randomAroundZero: function() {
        return Math.random() > 0.5 ? 1 : -1;
    },

    getProductStock: function(input) {
        let start = input.price;
        let rate = input.rate;
        let variance = input.variance;

        return start * rate + variance * stock.randomAroundZero();
    }
};

module.exports = stock;
