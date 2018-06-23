import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import isEmpty from 'lodash/isEmpty';
import FilpMove from 'react-flip-move';


import { renameUser } from '../../actions/auth';
import { setGlobalError } from '../../actions/errors';

import { validateInput } from '../../../server/common/validate';

import Input from '../../common/Input/Input';
import Loading from '../Loading/Loading';

import './ContactsPage.sass';


const mapState = state => {
    return {
        user: state.user,
        globalError: state.globalError
    }
};

@connect(mapState, { renameUser, setGlobalError })
export default class ContactsPage extends React.Component {
    constructor(props) {
        super(props);

        const user = this.props.user;

        this.state = {
            loading: false,
            sign: false,
            username: {
                value: user.username,
                fixedValue: user.username,
                require: true,
                hidden: true,
                error: ''
            },
            email: {
                value: user.email,
                fixedValue: user.email,
                require: true,
                hidden: true,
                error: ''
            },
            phone: {
                value: user.phone || '',
                fixedValue: user.phone || '',
                hidden: true,
                error: ''
            },
            address: {
                value: user.address || '',
                fixedValue: user.address || '',
                hidden: true,
                error: ''
            }
        };
    };

    componentDidMount() {
        if(isEmpty(this.props.user)) {
            this.props.history.push('/');
        };
    };

    componentDidUpdate(prevProps) {
        if((this.props.user !== prevProps.user) && isEmpty(this.props.user)) {
            this.props.history.push('/');
        };
    };

    onClickToChangeInput = e => {
        const name = e.currentTarget.getAttribute('name');

        this.setState({
            [name]: {
                ...this.state[name],
                hidden: false
            }
        });


    };

    onChange = e => {
       const name = e.target.name;
       this.setState({
           [name]: {
               ...this.state[name],
               value: e.target.value,
               error: ''
           }
       });
    };

    confirmChanging = async name => {
        if(this.state[name].require) {
            const {isValid, errors} = await validateInput({ [name]: this.state[name].value });
            if(!isValid) {
                await this.setState({
                    [name]: {
                        ...this.state[name],
                        error: errors[name]
                    }
                });
                return;
            }
        };
        await this.setState({
            [name]: {
                ...this.state[name],
                value: this.state[name].value,
                fixedValue: this.state[name].value,
                hidden: true
            }
        });

        this.setSignState(name);
    };

    setSignState = (name) => {
        this.setState({
            sign: name ? this.state[name].fixedValue !== this.props.user[name] : false
        });
    };

    cancelInputing = name => {
        this.setState({
            [name]: {
                ...this.state[name],
                value: this.state[name].fixedValue,
                hidden: true,
                error: ''
            }
        });
    };

    onSubmit = () => {
        let sendObj = { _id: this.props.user._id };
        for(let key in this.state) {
            if(key === 'loading') continue;
            sendObj[key] = {
                fixedValue: this.state[key].fixedValue,
                require: this.state[key].require
            };
        };

        if(this.state.sign) {
            this.setState({ loading: true });
            this.props.renameUser(sendObj)
                .then(() => {
                    this.setState({ loading: false });
                    this.setSignState();
                })
                .catch(err => {
                    err = err.response.data.error;
                    for(let key in err) {
                        this.setState({
                            loading: false,
                            [key]: {
                                ...this.state[key],
                                error: err[key]
                            }
                        });
                    };

                })
        }

    };

    render() {
        return (
            <FilpMove appearAnimation="fade" enterAnimation="none" leaveAnimation="none" className="ContactsPage">
                <h1>Страничка пользователя</h1>

                <div className="link">
                    <Link to={`/user/order-page/${this.props.user._id}`} className="btn">Мои заказы</Link>
                </div>

                {this.state.loading && <Loading />}

                <div className="user-profile-content">

                    {this.props.globalError && <h5 className="error">{this.props.globalError}</h5>}

                    <div className="user-profile-item">
                        <div>Логин:</div>
                        {this.state.username.error && <div className="error">{this.state.username.error}</div>}
                        <Input
                            {...this.state.username}
                            name='username'
                            onClick={this.onClickToChangeInput}
                            onChange={this.onChange}
                            confirmChanging={this.confirmChanging}
                            cancelInputing={this.cancelInputing}
                        />

                    </div>

                    <div className="user-profile-item">
                        <div>E-mail:</div>
                        {this.state.email.error && <div className="error">{this.state.email.error}</div>}
                        <Input
                            {...this.state.email}
                            name='email'
                            onClick={this.onClickToChangeInput}
                            onChange={this.onChange}
                            confirmChanging={this.confirmChanging}
                            cancelInputing={this.cancelInputing}
                        />

                    </div>

                    <div className="user-profile-item">
                        <div>Телефон:</div>
                        {this.state.phone.error && <div className="error">{this.state.phone.error}</div>}
                        <Input
                            {...this.state.phone}
                            name='phone'
                            onClick={this.onClickToChangeInput}
                            onChange={this.onChange}
                            confirmChanging={this.confirmChanging}
                            cancelInputing={this.cancelInputing}
                        />

                    </div>

                    <div className="user-profile-item">
                        <div>Адрес:</div>
                        {this.state.address.error && <div className="error">{this.state.address.error}</div>}
                        <Input
                            {...this.state.address}
                            name='address'
                            onClick={this.onClickToChangeInput}
                            onChange={this.onChange}
                            confirmChanging={this.confirmChanging}
                            cancelInputing={this.cancelInputing}
                        />

                    </div>

                </div>
                <button className="btn" onClick={this.onSubmit} disabled={!this.state.sign}>Сохранить</button>
            </FilpMove>
        );
    }
};