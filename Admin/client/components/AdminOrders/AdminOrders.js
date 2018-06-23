import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import prices from '../../../../server/data/prices';
import ordersStatus from '../../../../server/data/orderStatus';

import { checkFileType } from '../../../../client/common/commonFunctions/checkFileType';

import { fetchOrders, downloadFiles, changeStatus, deleteAdminOrder } from '../../actions/orders';
import { fetchFotoParams } from '../../../../client/actions/params';

import { Loader, Button, Segment } from 'semantic-ui-react';

import './AdminOrders.sass';

const mapState = state => {
    return {
        orders: state.orders || [],
        fotoParams: state.fotoParams
    };
};

@connect(mapState, { fetchOrders, fetchFotoParams, changeStatus, deleteAdminOrder })
export default class AdminOrders extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showStatus: '',
            showOrders: [],
            loading: false,
            error: ''
        };
    };

    componentDidMount() {
        this.setState({
            loading: true
        });
        this.props.fetchFotoParams();
        this.props.fetchOrders()
            .then(() => {
                this.setState({
                    loading: false
                })
            })
            .catch((err) => this.setState({
                loading: false,
                error: err.response ? (err.response.data.error || err.response.data) : err.message
            }));

    };

    getFiles = (order) => {
        let resultObj = {};

        order.files.forEach(file => {
            let fileType = checkFileType(file.filePath);
            fileType = fileType === 'image' ? 'Изображение' : ( fileType === 'archive' ? 'Архив' : 'Неизвестный тип' )
            if(resultObj[fileType]) {
                if(resultObj[fileType][file.format] && resultObj[fileType][file.format][file.paper]) {
                    resultObj[fileType][file.format][file.paper] += file.amount;
                } else {
                    resultObj[fileType][file.format] = {
                        [file.paper]: file.amount

                    };
                };
            } else {
                resultObj[fileType] = {
                    [file.format]: {
                        [file.paper]: file.amount
                    }
                };
            };
        });

        const resultHtml = (
            <div className="formats-prices">
                <h4>Файлы:</h4>
                <div className="content">
                    {Object.keys(resultObj).map(item => {
                        return (
                            <div className="type" key={item}>
                                <div>Тип: <span>{item}</span></div>
                                {Object.keys(resultObj[item]).map(format => {
                                    return (
                                        <div className="format" key={format}>
                                            <h5>{format}</h5>
                                            {Object.keys(resultObj[item][format]).map(paper => {
                                                return (
                                                    <div className="paper" key={paper}>
                                                        <span className="paper-type">
                                                            {this.props.fotoParams
                                                                .find(item => item.title === format).paperType
                                                                .find(format => format.title === paper).name
                                                            }: <span>{resultObj[item][format][paper]}</span>
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    )}
                </div>
            </div>
        );

        return resultHtml;

    };

    getTotalPrice = obj => {
        let totalPrice = 0;
        const content = prices.find(print => print.title === 'fotoprint').content;
        Object.keys(obj).forEach(item => {
            const format = content.find(priceFormat => priceFormat.title === item);
            const formatPrice = parseFloat(format.value);
            Object.keys(obj[item]).forEach(pp => {
                totalPrice += obj[item][pp] * formatPrice
            });
        })
        return totalPrice.toFixed(2)
    };

    showStatus = (orderName) => {
        this.setState({
            showStatus: this.state.showStatus === orderName ? '' : orderName
        });
    };

    setStatus = (e, buttonStatus, orderName) => {
        const parentButton = e.target.parentElement.parentElement.getElementsByClassName('status-btn')[0];

        this.setState({
            loading: true
        });
        this.props.changeStatus({
            orderName,
            status: buttonStatus
        })
            .then((res) => {
                this.setState({
                    showStatus: '',
                    loading: false
                });
                this.setShowOrders(findDOMNode(this.mainButton))
            })
            .catch(err => {
                    this.setState({
                        showStatus: '',
                        loading: false,
                        error: err.response ? err.response.data.error : err.message
                    })
                    if(err.response && err.response.status === 410) {
                        setTimeout(() =>  location.reload(), 1000)
                    }
            })
    };

    //DeleteOrder by OrderName
    deleteOrder = orderName => {
        this.setState({ loading: true });
        this.props.deleteAdminOrder(orderName)
            .then(() => {
                this.setState({
                    showOrders: this.state.showOrders.filter(order => order.orderName !== orderName),
                    loading: false
                });
            })
            .catch(err => {
                this.setState({
                    showStatus: '',
                    loading: false,
                    error: err.response ? err.response.data.error : err.message
                })
                if(err.response && err.response.status === 410) {
                    setTimeout(() =>  location.reload(), 1000)
                }
            })
    };

    showOrdersDate = () => {
        const result = this.state.showOrders.map(item =>
            <div className="orders-wrapper" key={item._id}>
                <div className="upper-block">
                    <div className="order">
                        <div className="id">Номер заказа: <span>{item.orderName}</span></div>
                        <div className="date">Число: <span>{item.datePath}</span></div>
                        <div className="contacts">Комментарии: <span>{item.contacts || 'No contacts'}</span></div>
                        <div className="status">
                            Статус:
                            <Button
                                disabled={this.state.loading}
                                onClick={() => this.showStatus(item.orderName)}
                                className="status-btn"
                                negative={item.status === 'await'}
                                primary={item.status === 'progress'}
                                positive={item.status === 'done'}
                            >
                                {item.status}
                            </Button>
                            <Segment style={{ display: this.state.showStatus === item.orderName ? 'block' : 'none', marginBottom: 10 }}>
                                {ordersStatus.filter(status => status !== item.status)
                                    .map(buttonStatus =>
                                        <Button
                                            disabled={this.state.loading}
                                            onClick={(e) => this.setStatus(e, buttonStatus, item.orderName)}
                                            key={buttonStatus}
                                            negative={buttonStatus === 'await'}
                                            primary={buttonStatus === 'progress'}
                                            positive={buttonStatus === 'done'}
                                        >
                                            {buttonStatus}
                                        </Button>
                                    )}
                            </Segment>
                        </div>
                        <div className="created">Создан: <span>{item.createdAt}</span></div>
                    </div>
                    {item.owner &&
                    <div className="user"><h4>Пользователь:</h4>
                        <div>Имя: <span>{item.owner.username}</span></div>
                        <div>Email: <span>{item.owner.email}</span></div>
                        <div>Телефон: <span>{item.owner.phone}</span></div>
                        <div>Адрес: <span>{item.owner.address}</span></div>
                    </div>
                    }
                </div>
                {this.getFiles(item)}
                <div className="download">
                    <Button positive data-value={item.orderName} onClick={() => this.download(item.orderName)}>Скачать файлы</Button>
                    <Button negative data-value={item.orderName} onClick={() => this.deleteOrder(item.orderName)}>Удалить заказ</Button>
                </div>
            </div>
        );
        return result;
    };

    setShowOrders = (e) => {
        if(e.target) {
            this.setState({
                showOrders: this.props.orders.filter(date => date.datePath === e.target.getAttribute('data-value'))
            });
        } else {
            this.setState({
                showOrders: this.props.orders.filter(date => date.datePath === e.getAttribute('data-value'))
            });
        };
    };

    download = orderName => {
        window.location.href = `/admin/api/download/${orderName}`
    };

    render() {
        return (
            <div className="AdminOrders">
                <h1>Admin-orders</h1>
                {this.state.error && <div className="error">{this.state.error}</div>}

                {this.state.loading ?
                    <Loader active>Loading...</Loader> :
                    <div className="dates">
                        {Object.keys(this.props.orders.reduce((a, b) => {
                            a[String(b.datePath)] = true;
                            return a;
                        }, {})).map(item =>
                            <Button key={item} ref={node => this.mainButton = node} data-value={item} onClick={this.setShowOrders}>{item}</Button>
                        )}
                    </div>
                }
                {this.state.showOrders.length > 0 && this.showOrdersDate()}
            </div>
        );
    };
};