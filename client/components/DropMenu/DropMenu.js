import { NavLink } from 'react-router-dom';

import lists from '../../../server/data/menuList';

import './DropMenu.sass';

export default class DropMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            markerPosition: window.location.href,
            wrapper: {},
            link: {},
            after: {
                top: 0,
                height: 0,
                display: 'block'
            }
        };
    };

    async componentDidUpdate(prevProps, prevState) {
        if(this.state.markerPosition !== window.location.href) {
            await this.setState({
                markerPosition: window.location.href
            });
            this.isActiveLink();
            this.setState({
                after: {
                    ...this.state.after,
                    display: this.state.after === prevState.after ? 'none' : 'block'
                }
            });
        };
    };

    componentDidMount() {
        this.isActiveLink();
    };

    isActiveLink = (e) => {
        let activeLink;
        if(!e) {
            activeLink = this.mainRef.getElementsByClassName('active')[0]
        } else {
            activeLink = e.target;
        };
        if(!activeLink) return;
        const [height, top] = [
            activeLink.offsetHeight,
            Math.round(activeLink.getBoundingClientRect().top - activeLink.parentElement.getBoundingClientRect().top)
        ];
        this.setState({
            after: {
                height,
                top
            }
        });

    };

    render() {
        return (
            <div className={`DropMenu ${this.props.className}`.trim()} ref={node => this.mainRef = node}>
                {lists.map((item, i) =>
                    <NavLink exact onClick={this.isActiveLink} className="dropItem" to={item.route} key={i} >
                        {item.title}
                    </NavLink>
                )}
                <div className="after" style={this.state.after}></div>
            </div>
        );
    };
};