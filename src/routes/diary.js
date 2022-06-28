const express  = require("express");
const diary = require("../models/diary.js");
const user = require("../models/user.js");
const router = express.Router();
const Response = require("../helper/sendResponse");
router.get('/', (req, res) => {
    res.send("Hellow")
    console.log(req.context.user);
});

// Get all diary Of users
router.get("/my/all", (req, res) => {
    const uid = (req.context?req.context.user.userID:null);
    uid && user.findOne({uid})
    .then((user)=>{
        if(user==null){
            return res.send(Response(401, "Invalid Login! Please Login Again", err));
        }
        diary.find().where('_id').in(user.diaries)
        .then((diaries)=>{
            return res.send(Response(200, "Success", diaries));
        })
        .catch((err)=>{
            res.send(Response(500, "Error Fetching Diaries", err));
        })
    })
    .catch((err)=>{
        res.send(Response(500, "Error Fetching User", err));
    })
})

// Get A single Diary Entry
router.get('/my/:id',async(req,res) => {
    const uid = (req.context?req.context.user.userID:null);
    const _id = req.params.id;
    uid && diary.findOne({uid,_id})
    .then(diaryData => {
        if(diaryData == null) 
            return res.send(Response(404,"No Entry Found", null));
        res.send(Response(200,"Diary Fetched", diaryData));
    })
    .catch((err) => {
        console.log(err);
        res.send(Response(500,"Error Fetching Diary", err));
    })
})   

// ADD A DIARY
router.post('/my/add', (req, res) => {
    const uid = (req.context?req.context.user.userID:null);
    const data = {...req.body, uid};
    uid && diary.create(data).then((diaryData)=>{
        user.updateOne(
            {_id:uid},
            {$push: { diaries: diaryData._id } }
        )
        .then(()=>{
            console.log("User updated");
            res.send(Response(200, "Diary Added", diaryData));
        })
        .catch(err=>{
            res.send(Response(500, "Something Went Wrong Updating User", err));    
        })
    })
    .catch((err) => {
        res.send(Response(500, "Diary Not Added", err));
    });
})

//UPDATE A DIARY
router.patch('/my/update/:id', (req, res) => {
    const uid = (req.context?req.context.user.userID:null);
    const _id = req.params.id;
    const data = req.body;
    uid && diary.updateOne({_id, uid}, {...data})
    .then((data) => {
        if(data.modifiedCount == 0)
            return res.send( Response(204, "No Updates found", null));
        return res.send(Response(200, "Diary Updated", null));
    })
})

//DELETE A DIARY
router.delete('/my/delete/:id', (req, res) => {
    const uid = (req.context?req.context.user.userID:null);
    const _id = req.params.id;

    uid && diary.findOneAndDelete({uid, _id})
    .then((data)=>{
        if(!data)
            return res.send(Response(404,"Not Found", null));
        user.findOneAndUpdate({"_id": uid},
             {$pull:
                {
                    diaries: _id
                }
            }
        ).then(()=>{
            console.log("User Updated");
        })
        .catch(()=>{
            return res.send(Response(500, "Something Went Wrong With User", null));    
        })
        return res.send(Response(200, "Deleted", null));
    })
    .catch(()=>{
        return res.send(Response(500, "Something Went Wrong With Diary", null));    
    })
})

module.exports = router;
