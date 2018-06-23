import { connect } from 'react-redux';

import FlipMove from  'react-flip-move';

import Loading from '../Loading/Loading';

import { loginAction } from '../../actions/auth';
import { recoveryPass } from '../../actions/auth';

import { validateInput } from '../../../server/common/validate';

import './LoginForm.sass';


const mapState  = state => {
    return {
        globalError: state.globalError
    }
};


@connect(mapState, { loginAction, recoveryPass })
export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            username: '',
            password: '',
            loginUsername: '',
            loginPass: '',
            confirmPass: '',
            register: this.props.location.pathname === '/register',
            loading: false,
            forPass: {
                value: false,
                username: '',
                loading: false,
                error: ''
            },
            errors: {}
        };
    };

    componentDidMount() {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.props.location.pathname !== prevProps.location.pathname) {
            this.setState({
                register: this.props.location.pathname === '/register',
                errors: {}
            });
        };
        if((this.props.globalError !== prevProps.globalError) && this.props.globalError) {
            this.forPass();
        };
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
            errors: {
                ...this.state.errors,
                [e.target.name]: ''
            }
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        let valid;
        const registerObj = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            confirmPass: this.state.confirmPass
        };
        const loginObj = {
            loginUsername: this.state.loginUsername,
            loginPass: this.state.loginPass
        };

        if(this.state.register) {
            valid = validateInput(registerObj);
        } else {
            valid = validateInput(loginObj);
        };

        if(valid.isValid) {
            if(this.state.register) {
                this.sendUserData({
                    ...registerObj,
                    register: true
                });
            } else {
                this.sendUserData({
                    ...loginObj,
                    register: false
                });
            };
        } else {
            this.setState({
                errors: valid.errors
            });
        };
    };

    sendUserData = data => {
        this.setState({ loading: true });
        this.props.loginAction(data)
            .then(() => {
                this.props.history.push('/')
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    errors: {
                        ...err
                    }
                });
            })
    };

    forPass = (e) => {
        e.preventDefault();
        if(this.state.register) return;
        this.setState({
            forPass: {
                value: !this.state.forPass.value,
                username: '',
                emailSended: '',
                error: ''
            }
        });
    };

    sendForPass = (e) => {
        e.preventDefault();
        const { isValid, errors } = validateInput(this.state.forPass, { ignore: ['loading', 'value', 'error', 'emailSended'] });
        if(!isValid) {
            this.setState({
                forPass: {
                    ...this.state.forPass,
                    error: errors.username
                }
            });
        } else {
            this.setState({ forPass: { ...this.state.forPass, loading: true } });
            this.props.recoveryPass({ username: this.state.forPass.username })
                .then(() => {
                    // this.forPass();
                    this.setState({
                        forPass: {
                            ...this.state.forPass,
                            emailSended: 'Инструкция отправлена на E-mail',
                            loading: false,
                            // value: false
                        }
                    });
                })
                .catch(err => {
                    this.setState({
                        forPass: {
                            ...this.state.forPass,
                            loading: false,
                            error: err.response.data.error
                        }
                    });
                });
        }
    };

    forPassChange = e => {
        this.setState({
            forPass: {
                ...this.state.forPass,
                username: e.target.value,
                error: ''
            }
        });
    };

    render() {


        const appear = {
            from: { transform: 'scaleX(0)' },
            to: { transform: 'scaleX(1)' }
        };
        const leave = {
            from: { transform: 'scaleX(1)' },
            to: { transform: 'scaleX(0)' }
        };

        const registerBlock = [
            <div className={!this.state.register ? 'input-block disabled' : 'input-block'} key={1}>
                <h5>Логин:</h5>
                <input
                    placeholder="Логин..."
                    type="text"
                    className="custom-input"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChange}
                    disabled={!this.state.register || this.state.loading}
                />
                {this.state.errors.username && <div className="error">{this.state.errors.username}</div>}
            </div>,
            <div className={!this.state.register ? 'input-block disabled' : 'input-block'} key={2}>
                <h5>E-mail:</h5>
                <input
                    placeholder="E-mail..."
                    type="text"
                    className="custom-input"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    disabled={!this.state.register || this.state.loading}
                />
                {this.state.errors.email && <div className="error">{this.state.errors.email}</div>}
            </div>,
            <div className={!this.state.register ? 'input-block disabled' : 'input-block'} key={3}>
                <h5>Пароль:</h5>
                <input
                    placeholder="Пароль..."
                    type="password"
                    className="custom-input"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    disabled={!this.state.register || this.state.loading}
                />
                {this.state.errors.password && <div className="error">{this.state.errors.password}</div>}
            </div>,
            <div className={!this.state.register ? 'input-block disabled' : 'input-block'} key={4}>
                <h5>Подтверждение пароля:</h5>
                <input
                    placeholder="Подтверждение пароля..."
                    type="password"
                    className="custom-input"
                    name="confirmPass"
                    value={this.state.confirmPass}
                    onChange={this.onChange}
                    disabled={!this.state.register || this.state.loading}
                />
                {this.state.errors.confirmPass && <div className="error">{this.state.errors.confirmPass}</div>}
            </div>
        ];

        const emailSended = (
            <div className="for-pass-content">
                <div>{this.state.forPass.emailSended}</div>
                <div className="btn" onClick={this.forPass} style={{ width: '100%', textAlign: 'center' }}>Ok</div>
            </div>
        );
        const forPassContent = (
            <div className="for-pass-content">
                {this.state.forPass.loading && <Loading/>}

                <h3 className="header">Восстановление пароля</h3>
                <div className="description">Введите логин, указанный при регистрации</div>
                <input
                    type="text"
                    disabled={this.state.forPass.loading}
                    className="custom-input"
                    name="forPassInput"
                    value={this.state.forPass.username}
                    onChange={this.forPassChange}
                    placeholder="Логин..."
                />
                {this.state.forPass.error && <div className="error">{this.state.forPass.error}</div>}

                <div className="description">На e-mail адрес будет отослано письмо с ссылкой на восстановление пароля</div>

                <button className="btn" disabled={this.state.forPass.loading} onClick={this.sendForPass}>Подтвердить</button>
                <button className="btn" disabled={this.state.forPass.loading} onClick={this.forPass}>Назад</button>


            </div>
        );
        const forPass = (
            <div className="for-pass">
                {!this.state.forPass.emailSended ? forPassContent : emailSended}
            </div>
        );

        return (
            <FlipMove appearAnimation="fade" className="LoginForm-wrapper" enterAnimation='none' leaveAnimation='none'>
                {this.state.loading && <Loading />}
            <form className="LoginForm" onSubmit={this.onSubmit}>
                <h2>{this.state.register ? 'Регистрация' : 'Войти'}</h2>
                <button className="btn login-button" type="submit">{!this.state.register ? "Войти" : "Зарегестрироваться"}</button>

                {this.props.globalError && <h3 className="error">{this.props.globalError}</h3>}
                <FlipMove enterAnimation='fade' leaveAnimation='none' className="register">
                    <div className={this.state.register ? 'input-block disabled' : 'input-block'}>
                        <h5>Логин или E-mail:</h5>
                        <input
                            placeholder="Логин или E-mail..."
                            type="text"
                            className="custom-input"
                            name="loginUsername"
                            value={this.state.loginUsername}
                            onChange={this.onChange}
                            disabled={this.state.register || this.state.loading}
                        />
                        {this.state.errors.loginUsername && <div className="error">{this.state.errors.loginUsername}</div>}
                    </div>
                    <div className={this.state.register ? 'input-block disabled' : 'input-block'}>
                        <h5>Пароль:</h5>
                        <input
                            placeholder="Пароль..."
                            type="password"
                            className="custom-input"
                            name="loginPass"
                            value={this.state.loginPass}
                            onChange={this.onChange}
                            disabled={this.state.register || this.state.loading}
                        />
                        {this.state.errors.loginPass && <div className="error">{this.state.errors.loginPass}</div>}
                        <div className={this.state.register ? 'for-pass-link disabled' : 'for-pass-link'}
                             onClick={this.forPass}>
                            Восстановить пароль?
                        </div>

                    </div>
                    {registerBlock}

                </FlipMove>
            </form>
                {this.state.forPass.value && forPass}
            </FlipMove>
        );
    };
};