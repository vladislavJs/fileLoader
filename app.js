import {upload} from './upload'

upload('#fileLoader', {
    multiple: true,
    accept: ['.png', '.jpeg', '.jpg', '.gif'],
    onUpload(files) {
        console.log(files)
    }
})