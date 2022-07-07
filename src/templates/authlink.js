const returnAuthTemplate = (link) => {
   return  `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentication</title>
    <style>
        html{
            background-color: #f5f5f5;
        }
        #overview{
            margin-top: 10%;
            background-color: #b1bae8;
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            margin: auto;
            align-items: center;
        }
        #header{
            background-color:#f8cbe7;
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        p{
            padding: 10px;
            text-align: left;
        }
    </style>
</head>
<body>
    <div id="overview">
        <div id= "header">Diary App</div>
        <div>
            <p>Welcome to DiaryApp</p>
            <p>Click on the link below to activate your account.</p>
            <p>${link}</p>
        </div>
    </div>
</body>
</html>`;
}

module.exports = returnAuthTemplate;