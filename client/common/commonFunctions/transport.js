import jwt from 'jsonwebtoken';
import axios from 'axios';

import clientConfig from '../../../server/common/clientConfig';

export default function(opt) {
    let { user, files, maxFileSize, sendFiles, uploadProgress, self, orderName, contacts } = opt;

    return {
        onSubmit() {
            this.formData = new FormData();

            for(let i = 0; i < files.length; i++) {
                    const jwtFile = jwt.sign({
                        user: user,
                        ...files[i]
                    }, clientConfig.secret);
                    if(files[i].file) {
                        this.formData.append(jwtFile, files[i].file);
                    } else {
                        this.formData.append(jwtFile, files[i].name)
                    };
            };

            return this._sendFiles({ data: this.formData })
        },

        _sendFiles(opt) {
            if(self.state.error) {
                self.setState({
                    error: ''
                })
            };

            let cancelToken = axios.CancelToken;
            this._source = cancelToken.source();

            return sendFiles({
                orderName,
                user,
                contacts,
                data: opt.data,
                onUploadProgress(e) {
                    return uploadProgress(e)
                },
                cancelToken: this._source.token
            })
        }
    }
};