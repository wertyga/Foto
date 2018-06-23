import './EmptyImage.sass';

export default class EmptyImage extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            height: ''
        };
    };
    
    componentDidMount() {
        this.updateHeight();
        window.addEventListener('resize', this.updateHeight);
    };

    updateHeight = () => {
        if(!this.mainRef) return;
        this.setState({
            height: this.mainRef.offsetWidth
        });
    };
    
    render() {

        const { style } = this.props;
        return (
            <div className="EmptyImage" ref={node => this.mainRef = node} style={{ height: this.state.height, ...style }}>
                <div className="inner"></div>
                <div className="title">No Image...</div>
            </div>
        );
    }
};