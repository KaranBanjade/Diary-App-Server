const mongoose = require('mongoose');
const validator = require('validator');

const diarySchema = new mongoose.Schema({
    title: {
        type: 'string',
        require: true
    },
    body: {
        type: 'string',
        require: true
    },
    tags: {
        type: 'array',
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    created_at: {
         type: Date, 
         required: true, 
         default: Date.now 
    },
    updated_at: {
        type:Date,
        required: true, 
        default: Date.now
    }
});
let diary;
if (mongoose.models.diary) {
    diary = mongoose.model('diary');}
else {
    diary = mongoose.model("diary", diarySchema)}
module.exports = diary;
