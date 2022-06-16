const Response = (code, message, data) => {
    let respObject = {
        code,
        message,
        data
    }
    return respObject;
};

module.exports =  Response