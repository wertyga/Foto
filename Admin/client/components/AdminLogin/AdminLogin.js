import { connect } from 'react-redux';

import { authAdmin } from '../../actions/auth';
import validation from '../../../server/middlewares/validation';

import { Form, Button } from 'semantic-ui-react';

import './AdminLogin.sass';


function mapStateToProps(state) {
    return {
        globalError: state.globalError
    }
};

@connect(mapStateToProps, { authAdmin })

export default class AdminLogin extends React.Component {

    state = {
        name: '',
        password: '',
        loading: false,
        errors: {}
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

    onSubmit = e => {
        e.preventDefault();
        this.setState({loading: true});

        const { errors, isValid } = validation(this.state);
        if(!isValid) {
            this.setState({
                errors,
                loading: false
            })
        } else {
            this.props.authAdmin(this.state)
                .then(() => {
                    this.setState({ loading: false });
                    this.props.history.push('/admin');
                })
                .catch(err => {
                    this.setState({
                        loading: false,
                        errors: err
                    });
                })
        }
    };

    render() {

        const { errors } = this.state;

        return (
            <Form onSubmit={this.onSubmit} className='AdminLogin'>
                <h1>Admin login page</h1>
                {this.props.globalError && <div className="global-error">{this.props.globalError}</div>}
                <Form.Field>
                    <label>Enter login name</label>
                    <input disabled={this.state.loading} type="text" name="name" placeholder="Name..." value={this.state.name} onChange={this.onChange}/>
                    {errors.name && <div className="error">{errors.name}</div>}
                </Form.Field>
                <Form.Field>
                    <label>Enter password</label>
                    <input disabled={this.state.loading} type="password" name="password" placeholder="Password..." value={this.state.password} onChange={this.onChange}/>
                    {errors.password && <div className="error">{errors.password}</div>}
                </Form.Field>
                <Button type="submit" disabled={this.state.loading} primary>Submit</Button>
            </Form>
        );
    }
}