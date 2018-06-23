export default function(price, discount) {
    return (price - (price / 100 * discount)).toFixed(2);
};