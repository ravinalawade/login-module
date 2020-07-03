const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'name can\'t be empty'
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    phone_no: {
        type: String,
        required: 'Phone no can\'t be empty',
        minlength: [10, 'Password must be atleast 10 character long'],
        unique: true
    },
    age: {
        type: Number,
        required: 'Age can\'t be empty',
    },
    country: {
        type: String,
        required: 'Country can\'t be empty',
    },
    city: {
        type: String,
        required: 'City can\'t be empty',
    },
    profession: {
        type: String,
        required: 'Profession can\'t be empty',
    },
});

var visit=new mongoose.Schema({
    phone_no: {
        type: String,
        required: 'Phone no can\'t be empty',
        minlength: [10, 'Password must be atleast 10 character long']
    },
    name: {
        type: String,
        required: 'name can\'t be empty'
    },
    booth_id:{
        type:String,
        required:'Booth id is required'
    },
    time_spent:{
        type:Number,
        required:'time_spent is required'
    },
    pic_clicks:{
        type:Number,
        required:'pic_clicks is required'
    },
    vid_clicks:{
        type:Number,
        required:'vid_clicks is required'
    },
    sim_clicks:{
        type:Number,
        required:'sim_clicks is required'
    },
})

var booth=mongoose.Schema({
    booth_id:{
        type:String,
        required:'Booth id is required'
    },
    vendor:{
        type:String,
        required:'Vendor name is required'
    },
    count_user:{
        type:Number,
        default:0
    }
})

var feedback=mongoose.Schema({
    booth_id:{
        type:String,
        required:'Booth id is required'
    },
    phone_no: {
        type: String,
        required: 'Phone no can\'t be empty',
        minlength: [10, 'Password must be atleast 10 character long']
    },
    feedback:{
        type:String,
        required:"feedback cant be empty"
    }
})

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

mongoose.model('User', userSchema);
mongoose.model('Visit', visit);
mongoose.model('Feedback', feedback);