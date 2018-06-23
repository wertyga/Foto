import { connect } from 'react-redux';

import { fetchFotoParams, updatePaperType } from '../../../../client/actions/params';

import Option from '../common/Option/Option';
import Cross from '../common/cross/cross';
import { Loader, Button, Input } from 'semantic-ui-react';

import './FotoParams.sass';


const mapState = state => {
    return {
        fotoParams: state.fotoParams || []
    }
};

@connect(mapState, { fetchFotoParams, updatePaperType })
export default class FotoParams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fotoParams: [],
            error: '',
            showAddNewParam: false,
            inputs: {
                format: '',
                types: '',
                errors: {}
            }
        };
    };

    componentDidMount() {
        this.setState({
            loading: true
        });
        this.props.fetchFotoParams()
            .then(() => this.setState({ loading: false }))
            .catch(() => this.setState({ loading: false }))
    };

    componentDidUpdate(prevProps) {
        if(this.props.fotoParams !== prevProps.fotoParams) {
            this.setState({
                fotoParams: this.props.fotoParams.map(item => { return {...item, loading: false }})
            });
        };
    };

    onChangePaper = e => {
        const [paper, type] = e.target.name.split('-');
        const id = e.target.parentElement.getAttribute('id');
        this.setState({
            fotoParams: this.state.fotoParams.map(item => {
                if(item._id !== id) {
                    return item;
                } else {
                    return {
                        ...item,
                        loading: true
                    }
                }
            })
        });
        this.props.updatePaperType({ id, paper, type, value: !(e.target.value === 'true') })
            .then(res => this.cancelLoading(res.data.result))
            .catch(err => {
                this.setState({
                    error: err.message,
                    fotoParams: this.state.fotoParams.map(item => { return { ...item, loading: false } })
                });
            })
    };

    cancelLoading = (result) => {
        this.setState({
            fotoParams: this.state.fotoParams.map(item => {
                if(item._id === result._id) {
                    return {
                        ...result,
                        loading: false
                    };
                } else {
                    return item
                };
            })
        });
    };

    crossClick = () => {
        this.setState({ showAddNewParam: true });
    };

    onChange = e => {
        this.setState({
            inputs: {
                ...this.state.inputs,
                [e.target.name]: e.target.value,
                errors: {
                    ...this.state.inputs.errors,
                    [e.target.name]: ''
                }
            }
        });
    };

    validateParams = () => {
        const { types, format } = this.state.inputs;

        if(!types) this.setState({ errors: { types: 'Field can not be empty' } });
        if(!types.match(/\d{1,2}x\d{1,2}/)) this.setState({ errors: { types: 'Field can not be empty' } });
        if(!format) this.setState({ errors: { format: 'Field can not be empty' } });
        if(!format.match(/\d{1,2}x\d{1,2}/)) this.setState({ errors: { format: 'Field can not be empty' } });
    };

    submitParam = (e) => {
        e.preventDefault();
    };

    render() {

        const addNewParam = (
            <form className="new-param" onSubmit={this.submitParam}>
                <Input
                    name="format"
                    type="text"
                    onChange={this.onChange}
                    value={this.state.inputs.format}
                    error={this.state.inputs.errors.format}
                />
                {this.state.inputs.errors.format && <div className="error">{this.state.inputs.errors.format}</div>}
                <Input
                    name="types"
                    type="text"
                    onChange={this.onChange}
                    value={this.state.inputs.types}
                    error={this.state.inputs.errors.type}
                />
                {this.state.inputs.errors.types && <div className="error">{this.state.inputs.errors.types}</div>}

                <Button primary type="submit">Set param</Button>
            </form>
        );

        const main = (
            <div className="main-content">
                <h2>Foto-parameters</h2>
                {this.state.fotoParams.map((item, i) =>
                    <div className="item-foto-params" key={item._id} >
                        <p>Size: {item.title}</p>
                        <div className="params-content">
                            {item.paperType.map((type, i) =>
                                <div className="content-params" key={i} id={item._id}>
                                    <p>{type.name}</p>
                                    <input
                                        type="checkbox"
                                        value={type.value}
                                        checked={type.value}
                                        name={`${item.title}-${type.title}`}
                                        onChange={this.onChangePaper}
                                        className="type"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );

        return (
            <div className="foto-params">
                {this.state.error && <div className="error">{this.state.error}</div>}
                {this.state.loading ? <Loader active>Loading...</Loader> : main}
            </div>
        );
    };
};