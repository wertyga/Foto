export default class Icon extends React.Component {

    render() {

        const style = {
            bubble: {
                backgroundColor: this.props.backgroundColor || 'white',
                height: this.props.size || 3 ,
                width: this.props.size || 3 ,
                borderRadius: '50%'
            },

            main: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: this.props.height && this.props.height,
                width: this.props.width && this.props.width,
                paddingRight: 20,
                paddingLeft: 20
            }
        };

        const returnBubbles = count => {
            let result = [];
            for(let i = 0; i < count; i++) {
                let element = (
                    <div className="bubble" key={i} style={style.bubble}></div>
                );
                result.push(element)
            };
            return result;
        };

        return (
            <div ref="bubble" className={`Icon`} style={style.main} onClick={this.props.onClick}>
                {returnBubbles(this.props.countBubbles)}
            </div>
        );
    }
};
