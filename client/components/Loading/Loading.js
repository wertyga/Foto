import './Loading.sass';

export default class Loading extends React.Component{
    render() {
        return (
            <div className="Loading" style={this.props.style}>
                <div className="cssload-speeding-wheel"></div>
                <p>Загрузка...</p>
                {this.props.children}
            </div>
        );
    }
};