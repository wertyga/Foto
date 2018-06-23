export const ERROR = 'ERROR';

export function globalError(err) {
    return {
        type: ERROR,
        error: err
    }
};