export default class AdminOrdersDates extends React.Component {
    render() {
        return (
            this.props.orders.map((item, i) =>
                <div className="orders-wrapper" key={item._id}>
                    <div className="order">
                        <div className="id">Номер заказа: <span>{item.orderName}</span></div>
                        <div className="date">Число: <span>{item.datePath}</span></div>
                        <div className="contacts">Комментарии: <span>{item.contacts || 'No contacts'}</span></div>
                        <div className="status">Статус: <span>{item.status}</span></div>
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
            )
        );
    };
};