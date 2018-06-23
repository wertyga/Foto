import prices from '../../../server/data/prices';

import './Prices.sass';

export default class Prices extends React.Component {

    componentDidMount() {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
    };

    render() {
        return (
            <div className="Prices">
                <h1>Прейскурант</h1>

                <div className="middle">
                    {prices.map((item, i) => {
                        return (
                            <div className="list" key={i}>
                                <h3>{item.header}</h3>
                                {item.content.map((item, i) => {
                                    // const value = item.value.split(' ')[0].toFixed(2) + ' руб.';

                                    return (
                                        <div className="title" key={i}>
                                            <h6>- {item.title}: </h6>
                                            <span>{item.value}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <div className="others">
                    Цены на другие товары и услуги, вы можете узнать у нас в ателье или по телефонам ниже
                </div>
            </div>
        );
    }
};

