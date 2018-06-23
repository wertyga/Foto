import ShowImages from '../ShowImages/ShowImages';

import './PrivateCab.sass'

export default class PrivateCab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        };
    };

    onChangFiles = (e) => {
        let arr = [];
        for(let i = 0; i < e.target.files.length; i++) {
            arr.push(e.target.files[i]);
        }
        this.setState({
            files: this.state.files.concat(arr).filter(item => item.type.split('/')[0] === 'image')
        });
    };

    checkFiles = opt => {
        return;
    };

    render() {
        return (
            <div className="PrivateCab" style={{ display: 'flex', flexDirection: 'column', marginTop: '10vh' }}>
               
                <ShowImages
                    images={this.state.files}
                />

            </div>
        );
    }
};