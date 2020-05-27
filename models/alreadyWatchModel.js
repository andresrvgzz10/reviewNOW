const mongoose = require('mongoose');

//specify our collection schema
//building the structure od the table
const alreadyWatchCollectionSchema = mongoose.Schema({
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

const alreadyWatchCollection = mongoose.model( 'alreadyWatch' , alreadyWatchCollectionSchema);

const AlreadyWatch = {
    getAlreadyWatchByUser: function(id)
    {
        return alreadyWatchCollection
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
    insertAlreadyWatch : function(newContentAlreadyWatch)
    {
        return alreadyWatchCollection
            .create(newContentAlreadyWatch)
            .then(newContent => {
                return newContent;
            })
            //error of any kind
            .catch( error => {
                return error
            });
    },
    deleteFromAlreadyWatch : function(id)
    {
        return alreadyWatchCollection
            .remove({_id:id})
            .then(newContent => {
                return newContent;
            })
            //error of any kind
            .catch( error => {
                return error
            });
    },
    boolAlreadyWatchContentAndUser : function(userID,contentID)
    {
        return alreadyWatchCollection
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
    AlreadyWatch
};