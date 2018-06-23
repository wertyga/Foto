import { connect } from 'react-redux';


const mapState = state => {
    return {
        userAuth: state.userAuth
    }
};


@connect(mapState)
export default class SignInOut extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            password: '',
            email: ''
        };
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        return (
            <div className="SignInOut">
                <h1>{this.props.userAuth ? 'Войти' : 'Регистрация'}</h1>
                <form className="sign-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Логин или E-mail..."
                        onChange={this.onChange}
                        disabled={this.state.loading}
                        value={this.state.name}
                    />
                    <input
                        type="text"
                        name="password"
                        placeholder="Пароль..."
                        onChange={this.onChange}
                        disabled={this.state.loading}
                        value={this.state.password}
                    />
                    {this.props.userAuth &&
                        <input
                            type="text"
                            name="email"
                            placeholder="E-mail..."
                            onChange={this.onChange}
                            disabled={this.state.loading}
                            value={this.state.email}
                        />
                    }

                    <button className="btn">{this.props.userAuth ? "Войти" : "Регистрация"}</button>
                </form>
            </div>
        );
    };
};