import Loading from '../../../../../client/components/Loading/Loading';

import './Option.sass';

export default class Option extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            // value: this.props.value
        };
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.state.open !== prevState.open) {
           if(this.state.open) {
               document.body.addEventListener('click', this.bodyClose);
               document.body.addEventListener('keydown', this.bodyClose);
           } else {
               document.body.removeEventListener('click', this.bodyClose);
               document.body.removeEventListener('keydown', this.bodyClose);
           }
        };
    };

    onClick = (e) => {
        const value = e.target.getAttribute('data-value');
        this.setState({
            open: !this.state.open
        });
        if(this.state.open) this.props.onClick(value);
    };

    bodyClose = (e) => {
        if(e.target.classList.contains('item')) return;
        if(e.keyCode === 27) {
            this.setState({ open: false });
        } else if(!e.keyCode) {
            this.setState({ open: false });
        };
    };

    render() {

        const main = (
            <div className="main-select">
                <div className="carret"></div>
                <div
                    className="default item"
                    onClick={() => { this.setState({ open: !this.state.open }) }}
                >
                    {this.props.value && this.props.items.find(item => item.title === this.props.value).name}
                </div>
                {this.state.open &&
                <div className="other-content">
                    {this.props.items.map((item, i) => {
                            if(this.props.ignore) {
                                if(this.props.ignore.indexOf(item.title) !== -1) return;
                            }
                            return (
                                <div
                                    style={{ display: item.title === this.props.value && 'none' }}
                                    className="item"
                                    data-value={item.title}
                                    key={i}
                                    onClick={this.onClick}
                                >
                                    {item.name}
                                </div>

                            );
                        }

                    )}
                </div>
                }
            </div>
        );

        return (
            <div className="Option" onClick={this.optionClick} ref={node => this.mainRef = node}>
                <label>{this.props.label}</label>
                {this.props.loading ? <Loading /> : main}
            </div>
        );
    };
};