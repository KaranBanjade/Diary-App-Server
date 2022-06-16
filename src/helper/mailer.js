const emailjs = require('emailjs');

const sendMail = (email, id, message) => {
    // var data = {
    //     service_id: 'DiaryMailer',
    //     template_id: 'AccountActive',
    //     user_id: 'yu1zAc_6D0itni0wd',
    //     template_params: {
    //         'username': 'James',
    //         'g-recaptcha-response': '03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...'
    //     }
    // };
     
    emailjs.send("DiaryMailer","AccountActive",{
        email,
        Topic: "karan",
        id,
        message
        })
        .then((data) => {
            console.log(data)
        })
    
}