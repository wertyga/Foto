const style = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '10px',
        width: '100%',
        fontSize: 13
    },
    label: {
        marginBottom: 5
    },
    input: {
        padding: 5
    },
    textArea: {
        width: '100%',
        resize: 'none',
        minHeight: '15vh'
    }
};

export default class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || ''
        };
    };

    onChange = e => {
        this.setState({
            value: e.target.value
        });
    };

    render() {

        const input = (
            <input
                style={style.input}
                type={this.props.type || 'text'}
                onChange={this.props.onChange || this.onChange}
                name={this.props.name}
                value={this.props.value}
                placeholder={this.props.placeholder + '...' || ''}
                id={this.props.label || ''}
                hidden={this.props.hidden}
                disabled={this.props.disabled}
            />
        );

        const textArea = (
            <textarea
                style={style.textArea}
                id={this.props.label || ''}
                value={this.props.value}
                name={this.props.name}
                onChange={this.props.onChange || this.onChange}
                disabled={this.props.disabled}
            />
        );

        return (
            <div className="ui input form" style={style.wrapper}>
                {this.props.label && <label style={style.label} style={{ cursor: this.props.type === 'file' && 'pointer' }} htmlFor={this.props.label}>{this.props.label}</label>}
                {this.props.textarea ? textArea : input}
            </div>
        );
    }
};
