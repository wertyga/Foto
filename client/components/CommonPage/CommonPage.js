import ReactDOM from 'react-dom';

import DropMenu from '../DropMenu/DropMenu';

import './CommonPage.sass';

export default class CommonPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            marginTop: 0
        };
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.props.openMenu !== prevProps.openMenu) {
            this.moveRightContent(this.props.openMenu);
        };
    };

    moveRightContent = (count) => {
        const translate = count ? ReactDOM.findDOMNode(this.dropRef).offsetWidth + 10 : 0;

        this.content.style.transform = `translateX(${translate}px)`;
    };

    render() {

        const enter = {
            from : {
                transform: 'translateX(-100%)',
                transformOrigin: '50% 0'
            },
            to: {
                transform: 'translateX(0)',
                transformOrigin: '50% 0'
            }
        };
        const leave = {
            from : {
                transform: 'translateX(0)',
                transformOrigin: '50% 0'
            },
            to: {
                transform: 'translateX(-100%)',
                transformOrigin: '50% 0'
            }
        };

        return (
            <div
                className={`CommonPage ${this.props.className ? this.props.className : ''}`.trim()}
            >
                <div
                    className={this.props.openMenu ? 'DropMenuWrapper open' : 'DropMenuWrapper'}
                    ref={dropRef => this.dropRef = dropRef}
                    style={{ position: 'fixed' }}
                    >
                    <DropMenu
                        open={this.props.openMenu}
                        goToMain={this.props.goToMain}
                    />
                </div>
                <div className="content"
                    ref={node => this.content = node}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
};