const mongoose = require('mongoose');

//specify our collection schema
//building the structure od the table
const toWatchCollectionSchema = mongoose.Schema({
    content : {
        require: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contents'
    },
    user : {
        require: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

const toWatchCollection = mongoose.model( 'toWatch' , toWatchCollectionSchema);

const ToWatch = {
    getAllToWatchByUser: function(id)
    {
        return toWatchCollection
            .find({"user": id})
            .populate( 'user' , ['name'])
            .populate( 'content' , ['title','image','type'])
            .then(allContent => {
                return allContent;
            })
            //error of any kind
            .catch( error => {
                return error
            });
    },
    insertToWatch : function(newContentToWatch)
    {
        return toWatchCollection
            .create(newContentToWatch)
            .then(newContent => {
                return newContent;
            })
            //error of any kind
            .catch( error => {
                return error
            });
    },
    deleteFromToWatch : function(id)
    {
        return toWatchCollection
            .remove({_id:id})
            .then(deletedContent => {
                return deletedContent;
            })
            //error of any kind
            .catch( error => {
                return error
            });
    },
    boolToWatchContentAndUser : function(userID,contentID)
    {
        return toWatchCollection
            .findOne({"user":userID, "content":contentID})
            .then(result => {
                return result;
            })
            //error of any kind
            .catch( error => {
                return error
            });
    }

};

module.exports = {
    ToWatch
};