import { connect } from 'react-redux';

import { updatePassword } from '../../actions/auth';
import { setGlobalError } from '../../actions/errors';

import { validateInput } from '../../../server/common/validate';

import Loading from '../Loading/Loading';

import './RecoveryPassword.sass';


const mapState = state => {
    return {
        globalError: state.globalError
    }
};

@connect(mapState, { updatePassword, setGlobalError })
export default class RecoveryPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            loading: false,
            error: ''
        };
    };

    componentDidUpdate(prevProps) {
        if(this.props.globalError !== prevProps.globalError) {
            this.setState({
                error: this.props.globalError
            });
        };
    };

    componentWillUnmount() {
        this.props.setGlobalError('')
    };

    onChange = e => {
        this.setState({
            value: e.target.value,
            error: ''
        });
    };

    onSubmit = e => {
        e.preventDefault();

        const { errors, isValid } = validateInput({ value: this.state.value });
        if(!isValid) {
            this.setState({ error: errors.value })
        } else {
            this.setState({
                loading: true
            });
            this.props.updatePassword({ password: this.state.value, id: this.props.location.search.split('?id=')[1]})
                .then(() => this.props.history.push('/login'))
                .catch(err => {
                    this.setState({
                        loading: false
                    });
                    setTimeout(() => this.props.history.push('/login'), 1000);
                });
        }
    };

    render() {
        return (
            <div className="RecoveryPassword">
                {this.state.loading && <Loading />}
                <form onSubmit={this.onSubmit}>
                    <p>Введите новый пароль</p>
                    <input
                        type="text"
                        className="custom-input"
                        placeholder="Новый пароль..."
                        value={this.state.value}
                        onChange={this.onChange}
                        disabled={this.state.loading}
                    />
                    {this.state.error && <div className="error">{this.state.error}</div>}
                    <button disabled={this.state.loading} className="btn">Сменить пароль</button>
                </form>
            </div>
        );
    };
};