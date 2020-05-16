// for validation of null & undefined
export const validate = value => {
    if(value !== null && value !== undefined)
        return true;
    return false;
    
}