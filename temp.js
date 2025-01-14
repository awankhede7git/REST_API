//This is implementing the rest api using mongodb.

//The purpose is to note the differences.

const express = require('express');
const fs = require('fs');

const mongoose = require('mongoose');
//const users = require('./users.json');

//connection
mongoose.connect('mongodb://127.0.0.1:27017/rest_api'); //name of databse is rest_api
mongoose.then(() => console.log("MongoDB connected<3"));
mongoose.catch((err)=> console.log("Mongodb error", err));

//Building the schema-

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },

    email : {
        type : String,
        required: true,
        unique : true
    },

    phone : {
        type : Number,
        required : true,
    },

    address:{
        type : stringify,
        required : true
    }
});

//passing the schema userSchema to a model.
const User = mongoose.model('user', userSchema);