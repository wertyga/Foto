export const images = ['jpg', 'jpeg', 'ttf', 'png', 'bmp', 'gif', 'jpe', 'tiff'];
export const archives = ['rar', 'zip'];

export function checkFileType(file) {
    const arrFile = file.split('\\');
    const type = arrFile[arrFile.length - 1].split('.')[1].toLowerCase();
    if(images.indexOf(type) !== -1) {
        return 'image';
    } else if(archives.indexOf(type) !== -1) {
        return 'archive';
    } else {
        return 'other type';
    }

};