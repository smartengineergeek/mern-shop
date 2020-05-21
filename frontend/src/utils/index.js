// for validation of null & undefined
export const validate = value => {
    // console.log("value ", value)
    if(value !== null && value !== undefined)
        return true;
    return false;
    
}