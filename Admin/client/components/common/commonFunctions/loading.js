export default function(load) {
    if(load) {
        this.setState({
            loading: true
        });
    } else {
        this.setState({
            loading: false
        });
    }
};