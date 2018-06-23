import './ButterMenu.sass'

export default class ButterMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: this.props.open || false
        };
    };

    componentDidMount() {
        setTimeout(() => {
            this.refs.f.classList.add('appear');
        }, 300);
        setTimeout(() => {
            this.refs.s.classList.add('appear');
        }, 400);
        setTimeout(() => {
            this.refs.t.classList.add('appear');
        }, 500)

    };

    onClick = e => {
        if(this.props.onClick) this.props.onClick();
    };


    render() {

        const style = {
            div: {
                backgroundColor: this.props.barColor || 'white',
                height: this.props.barHeight || 1
            }
        };

        return (
            <div className={this.props.open ? 'ButterMenu open' : 'ButterMenu'} onClick={this.onClick}>
                <div className="f" ref="f" style={style.div}></div>
                <div className="s" ref="s" style={style.div}></div>
                <div className="t" ref="t" style={style.div}></div>
            </div>
        );
    }
};