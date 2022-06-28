const Response = (code, message, data) => {
    let respObject = {
        code,
        message,
        data
    }
    // console.log(respObject);
    return respObject;
};

module.exports =  Response