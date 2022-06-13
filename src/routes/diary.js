const express  = require("express");
const diary = require("../models/diary.js");
const user = require("../models/user.js");
const router = express.Router();
router.get('/', (req, res) => {
    res.send("Hellow")
    console.log(req.context.user);
});

// Get all diary Of users
router.get("/my/all", (req, res) => {
    const uid = req.context.user.userID;
    user.findOne({uid})
    .then((user)=>{
        console.log(user);
        if(user==null)
            return res.send("Context Failed");
        diary.find().where('_id').in(user.diaries)
        .then((diaries)=>{
            console.log(diaries);
            return res.send(diaries);
        })
        .catch((err)=>{
            res.send("Error Fetching Diaries");
        })
    })
    .catch((err)=>{
        res.send("Error Fetching User");
    })
})

// Get A single Diary Entry
router.get('/my/:id',async(req,res) => {
    const uid = req.context.user.userID;
    const _id = req.params.id;
    const diaryData = await diary.findOne({uid,_id}).exec();
    if(diaryData == null) 
        return res.send("No entry found");
    res.send(diaryData);
})  

// ADD A DIARY
router.post('/my/add', (req, res) => {
    const uid = req.context.user.userID;
    const data = {...req.body, uid};
    diary.create(data).then((diaryData)=>{
        console.log("Diary created");
        user.updateOne(
            {_id:uid},
            {$push: { diaries: diaryData._id } }
        ).then((userData)=>{
            console.log("User updated");
            console.log(userData);
        })
        res.send(diaryData);
    })
    .catch((err) => {
        console.log(err);
        res.send("not Created");
    });
})

//UPDATE A DIARY
router.patch('/my/update/:id', (req, res) => {
    const uid = req.context.user.userID;
    const _id = req.params.id;
    const data = req.body;
    diary.updateOne({_id, uid}, {...data}).then((data) => {
        if(data.modifiedCount == 0)
            return res.send("No Updates found");
        return res.send("Updated");
    })
})

//DELETE A DIARY
router.delete('/my/delete/:id', (req, res) => {
    const uid = req.context.user.userID;
    const _id = req.params.id;

    diary.findOneAndDelete({uid, _id}).then((data)=>{
        console.log(data);
        if(!data)
            return res.send("Not Found");
        user.findOneAndUpdate({"_id": uid},
             {$pull:
                 {
                diaries: _id
                }
            }
        ).then((data)=>{
            console.log(data);
        })
        return res.send("Deleted")
    })

})

module.exports = router;
