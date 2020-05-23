// for validation of null & undefined
export const validate = value => {
//    value = value.trim();
    if(value !== null && value !== undefined && value !== "")
        return true;
    return false;
    
}