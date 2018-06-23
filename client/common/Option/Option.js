import './Option.sass';

export default class Option extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            setName: this.setName()
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

        if(this.props.value !== prevProps.value) {
            this.setState({
                setName: this.setName()
            });
        };
    };

    setName = () => {
        const name = this.props.items.find(item => item.title === this.props.value);
        return name ? name.name : 'Выберите значение'
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
        return (
            <div className={this.props.className ? `${this.props.className} Option` : 'Option'} onClick={this.optionClick} ref={node => this.mainRef = node}>
                <label>{this.props.label}</label>
                <div className="main-select">
                    <div className="upper">
                        <div
                            className="default item"
                            onClick={() => { this.setState({ open: !this.state.open }) }}
                        >
                            {this.props.value &&
                            this.props.items.length > 0 &&
                            this.state.setName}
                        </div>
                        <i className="down" style={this.props.iconStyle}/>
                    </div>
                    {this.state.open &&
                        <div className="other-content">
                            {this.props.items.map((item, i) => {
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
            </div>
        );
    };
};

Option.propTypes = {
    label: PropTypes.string, // Label for select
    value: PropTypes.string.isRequired, //Current value of select
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired, //title of inner value of the select
        name: PropTypes.string.isRequired, //name of visible value of the select
    })).isRequired,
    onClick: PropTypes.func.isRequired //Function for changing between options
};