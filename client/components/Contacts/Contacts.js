import { connect } from 'react-redux';

import { sendMessage } from '../../actions/common';

import Map from '../Map/Map';
import Loading from '../Loading/Loading';

import './Contacts.sass';


const style = {
    error: {
        marginTop: 10
    }
};

@connect(null, { sendMessage })
export default class Contacts extends React.Component {
    constructor(props) {
        super(props);

        this.levkovaCoords = {
            lat: 53.8814256,
            lng: 27.5539121
        };
        this.eseninaCoords = {
            lat: 53.849685,
            lng: 27.465211
        };

        this.state = {
            openMap: false,
            openHeight: false,
            message: '',
            name: '',
            contacts: '',
            error: {},
            loading: false,
            sendEmail: false,
            mapCoords: this.levkovaCoords
        };
    };

    openMap = (sign) => {
        if(!this.state.openMap) {
            this.setState({
                openMap: true
            })
        };
        switch(sign) {
            case(1):
                this.setState({
                    mapCoords: this.levkovaCoords,
                    openHeight: this.state.openHeight === 1 ? false : 1
                });
                break;
            case(2):
                this.setState({
                    mapCoords: this.eseninaCoords,
                    openHeight: this.state.openHeight === 2 ? false : 2
                });
                break;
            default:
                this.setState({
                    mapCoords: this.levkovaCoords,
                    openHeight: false
                });
        }
    };

    onChangeField = e => {
        this.setState({
            [e.target.name]: e.target.value,
            error: {
                ...this.state.error,
                [e.target.name]: ''
            }
        });
    };

    sendMessage = () => {
        const { message, name, contacts } = this.state;

        if(!contacts || contacts.length > 1000) {
            this.setState({
                error: {
                    ...this.state.error,
                    contacts: 'Что-то не так с контактными данными'
                }
            });
            return;
        };
        this.setState({
            loading: true
        });
        this.props.sendMessage({
            name,
            contacts,
            message
        }).then(res => {
            this.setState({
                loading: false,
                sendEmail: true,
                message: '',
                contacts: '',
                name: ''
            });
            setTimeout(() => this.setState({ sendEmail: false }), 1000)
        })
            .catch(err => this.setState({
                loading: false,
                error: {
                ...this.state.error,
                contacts: err.response ? err.response.data.error : err.message
            }
            }));
    };

    render() {

        const form = (
            <div className="form">
                <div className="main">
                    <input className="custom-input" onChange={this.onChangeField} type="text" value={this.state.name} name="name" placeholder="Имя..."/>
                    <input className="custom-input" onChange={this.onChangeField} type="text" value={this.state.contacts} name="contacts" placeholder="Контактные данные..."/>
                    {this.state.error.contacts && <div className="error" style={style.error}>{this.state.error.contacts}</div>}
                </div>
                <textarea className="custom-input" onChange={this.onChangeField} type="text"value={this.state.message} name="message"  placeholder="Сообщение..."/>
                <button disabled={this.state.loading} className="btn" onClick={this.sendMessage} onMouseOver={this.props.onMouseOver}>Отослать...</button>
            </div>
        );

        return (
            <div className="Contacts">
                <h1>Контакты</h1>
                    <div className="wrapper">
                        <h3 ref="address"><i className="fa fa-map-marker" aria-hidden="true" /> Адрес: </h3>
                        <div className="map_wrapper">
                            <div className="map_item">
                                <p>г. Минск, ул. Левкова, 8/2</p>
                                <div className="map">
                                    <p
                                        style={{ marginBottom: 10, cursor: 'pointer' }}
                                        onClick={() => this.openMap(1)}
                                    >
                                        {this.state.openHeight === 1 ? 'Закрыть карту...' : 'Открыть карту...'}
                                    </p>
                                </div>
                            </div>
                            <div className="map_item">
                                <p>г. Минск, ул. Есенина, 10</p>
                                <div className="map">
                                    <p
                                        style={{ marginBottom: 10, cursor: 'pointer' }}
                                        onClick={() => this.openMap(2)}
                                    >
                                        {this.state.openHeight === 2 ? 'Закрыть карту...' : 'Открыть карту...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {this.state.openMap &&
                            <Map open={this.state.openHeight}
                                 lat={this.state.mapCoords.lat}
                                 lng={this.state.mapCoords.lng}
                            />
                        }
                    </div>

                    <div className="wrapper">
                        <h3 ref="phone"><i className="fa fa-phone" aria-hidden="true" /> Контактный телефон: </h3>
                        <a href="tel:+375259598070"><span>Life:)</span> +375 25 959 89 70</a>
                        <a href="tel:+375293340986"><span>Velcom</span> +375 29 334 09 86</a>
                        <p>Viber: +375 29 334 09 86</p>
                    </div>

                    <div className="email">
                        <div className="wrapper">
                            <h3 ref="email"><i className="fa fa-envelope-o" aria-hidden="true" />E-mail:</h3>
                            <a href="malto:fotopodsolnux@gmail.com">fotopodsolnux@gmail.com</a>
                        </div>
                    </div>

                <div className="wrapper">
                    <h3><i className="fa fa-address-book-o" aria-hidden="true"/> Форма обратного контакта:</h3>

                    <div className="form">
                        <div className="main" ref={node => this.formMain = node}>
                            <input disabled={this.state.loading} onChange={this.onChangeField} type="text" value={this.state.name} name="name" placeholder="Имя..."/>
                            <input disabled={this.state.loading} onChange={this.onChangeField} type="text" value={this.state.contacts} name="contacts" placeholder="Контактные данные..."/>
                            {this.state.error.contacts && <div className="error" style={style.error}>{this.state.error.contacts}</div>}
                        </div>
                        <textarea disabled={this.state.loading} onChange={this.onChangeField} type="text"value={this.state.message} name="message"  placeholder="Сообщение..."/>
                        {this.state.loading && <Loading />}
                    </div>
                    {this.state.sendEmail && <div className="send-email">Сообщение отослано!</div>}
                    <button
                        disabled={this.state.loading}
                        className="btn"
                        onClick={this.sendMessage}
                    >
                        Отослать...
                    </button>
                </div>

                </div>
        );
    }
};