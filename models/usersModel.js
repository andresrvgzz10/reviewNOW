const mongoose = require('mongoose');

//specify our collection schema
//building the structure od the table
const usersCollectionSchema = mongoose.Schema({
    name : {
        type: String,
        require: true
    },
    email : {
        type: String,
        require: true,
        unique: true
    },
    password : {
        type: String,
        require: true
    },
    toWatch : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'contents'
        }
    ],
    alreadyWatch : [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contents'
    }],
    status:{
        type: String,
        require: true
    }
})


const usersCollection = mongoose.model( 'users' , usersCollectionSchema);

const Users = {
    getUserByEmail : function(email){
        return usersCollection
                .findOne({email})
                .then(user => {
                    return user;
                })
                //error of any kind
                .catch( error => {
                    return error
                });

    },
    createUser : function( newUser ){
        return usersCollection
                .create( newUser )
                .then( createdUser => {
                    return createdUser;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    getAllUsers : function(){
        return usersCollection
                .find()
                .populate( 'toWatch' , ['title'])
                .populate( 'alreadyWatch' , ['title'])
                .then( allUsers => {
                    return allUsers;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    userByEmail: function(email)
    {
        return usersCollection
                .findOne({"email": email})
                .then(user => {
                    return user;
                })
                //error of any kind
                .catch( error => {
                    return error
                });
    },
    insertAlreadyWatch : function(user,content)
    {
    },
    insertToWatch : function(user,content)
    {

    },
    deleteFromAlreadyWatch : function(user,content)
    {

    },
    deleteFromToWatch : function(user,content)
    {

    }
}

module.exports = {
    Users
};