import './Footer.sass';

export default class Footer extends React.Component {
    render() {
        return (
            <div className="Footer" ref={this.props.refFooter}>
                <div className="address">
                    <h4>Время работы:</h4>
                    <div className="content">
                        <p>Пн: <span>11:00 - 20:00</span></p>
                        <p>Вт: <span>11:00 - 20:00</span></p>
                        <p>Ср: <span>11:00 - 20:00</span></p>
                        <p>Чт: <span>11:00 - 20:00</span></p>
                        <p>Пт: <span>11:00 - 20:00</span></p>
                        <p>Сб: <span>11:00 - 17:00</span></p>
                    </div>
                </div>
                <div className="phone">
                    <h4>Телефоны:</h4>
                    <div className="content">
                        <p>Velcom: +375 29 334 09 86</p>
                        <p>Life :) +375 25 959 89 70</p>
                        <p>Viber: +375 29 334 09 86</p>
                    </div>
                </div>
                <div className="social">
                    <h4>Социальные сети:</h4>
                    <i className="fa fa-facebook-square" aria-hidden="true"/>
                    <i className="fa fa-twitter-square" aria-hidden="true"/>
                    <i className="fa fa-google-plus-square" aria-hidden="true"/>
                    <i className="fa fa-vk" aria-hidden="true"/>
                </div>
            </div>
        );
    };
};