import { Link } from 'react-router-dom';

import MainContentBlock from '../MainContentBlock/MainContentBlock';

import fotoPrint from '../../../data/images/fotoPrint.jpg';
import docFoto from '../../../data/images/docFoto.jpg';
import digitalize from '../../../data/images/digitalize.jpg';
import retush from '../../../data/images/retush.jpg';
import souvenir from '../../../data/images/souvenir.jpg';

import './MainPage.sass';

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {

        return (
            <div className="MainPage" style={{ paddingTop: this.props.paddingTop }}>
                <h1>Главная страница</h1>

                <div className="header-section">
                    У нас Вы можете заказать различные услуги по фотопечати, печать на различных материалах, таких как текстиль, фарфор, керамика и другие.
                    Мы, также, рады Вам предложить различную сувенирную продукцию.
                    Наши дизайнеры всегда готовы вам помочь в выборе фото и изображений для Ваших подарков.
                </div>

                <MainContentBlock
                    image={fotoPrint}
                    title="Печать фотографий"
                    to='/description/fotoprint'
                >
                    <div className="descr">Всего в несколько кликов выможете заказ печать фотографий в нашем сервисе.</div>
                    <div>Множество доступных форматов на выбор.</div>
                </MainContentBlock>

                <MainContentBlock
                    image={retush}
                    title="Восстановление и ретушь"
                    right
                    to='/description/retush'
                >
                    <div className="descr">
                        Мы, также, поможем Вам восстановить ваши старые фотографии: ретушь царапин, восстановление недостающих частей
                        и прочее.
                        <br/>
                        Восстановление старых фотографий, устранение царапин, заломов, трещин. Восстановление недостающий частей фотографии.
                    </div>
                </MainContentBlock>

                <MainContentBlock
                    image={souvenir}
                    title="Сувенирная продукция"
                    to='/description/souvenir'
                >
                    <div className="descr">
                        Вы можете заказать множество видов сувенирной продукции для подарков любимым и родственниками на праздники и не только.
                    </div>
                </MainContentBlock>

                <MainContentBlock
                    right
                    image={docFoto}
                    title="Фото на документы"
                    to='/description/docfoto'
                >
                    <div className="descr">
                        У нас вы, также, можете сделать фото на документы. <br/>
                        Мы делаем любой формат, под любые параметры: визы, паспорта, удостоверения.
                    </div>
                </MainContentBlock>

                <MainContentBlock
                    image={digitalize}
                    title="Оцифровка видео и фотопленки"
                    to='/description/digitalize'
                >
                    <div className="descr">
                        Мы предоставляем услуги по оцифровке фото и видеопленки. <br/>
                        Записи с видео кассет, 8мм. видео плеки, фотографии на цветных и черно-белых фотопленках, слайдах
                        могут быть перенесены на цифровой носитель(флеш-карты, компакт-диски и др.)
                    </div>
                </MainContentBlock>
                <p>И многое другое ;)</p>
            </div>
        );
    }
}