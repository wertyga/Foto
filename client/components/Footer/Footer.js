import './Footer.sass';

export default class Footer extends React.Component {
    render() {
        return (
            <div className="Footer" ref={this.props.refFooter}>
                <div className="address">
                    <h4>Время работы:</h4>
                    <div className="content">
                        <p><strong>Пн.-Пт.:</strong><span>10:00 - 19:00</span></p>
                        <p><strong>Сб: </strong><span>10:00 - 17:00</span></p>
                    </div>
                </div>
                <div className="phone">
                    <h4>Телефоны:</h4>
                    <div className="content">
                        <p><strong>Velcom: </strong><span>+375 29 334 09 86</span></p>
                        <p><strong>Life :) </strong><span>+375 25 959 89 70</span></p>
                        <p><strong>Viber: </strong><span>+375 25 959 89 70</span></p>
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