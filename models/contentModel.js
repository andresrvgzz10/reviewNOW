const mongoose = require('mongoose');

//specify our collection schema
//building the structure od the table
const contentCollectionSchema = mongoose.Schema({
    title : {
        type: String,
        require: true
    },
    description : {
        type: String,
        require: true
    },
    type : {
        type: String,
        require: true
    },
    image : {
        type: String,
        require: true
    },
    status : {
        type: String,
        require: true
    },
    creator : {
        require: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})


const contentCollection = mongoose.model( 'contents' , contentCollectionSchema);

const Content = {
    createContent : function( newContent ){
        return contentCollection
                .create( newContent )
                .then( createdContent => {
                    return createdContent;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    getAllContent : function(){
        return contentCollection
                .find()
                .populate( 'creator' , ['name'])
                .then( allComments => {
                    return allComments;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    getContentByTitle : function(title){
        return contentCollection
                .findOne({"title":title})
                .then( content => {
                    return content;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    getContentByCreator : function(id){
        return contentCollection
                .find({"creator":id})
                .then( content => {
                    return content;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    approveContent : function(title,id){
        return contentCollection
                .updateOne({"title": title , "_id": id},{$set: {status:"1"}})
                .then( contentAprroved => {
                    return contentAprroved;
                })
                .catch( err => {
                    throw new Error( err );
                });

    },
    deleteContent : function(id){
        return contentCollection
                .updateOne({"_id": id},{$set: {status:"3"}})
                .then( contentAprroved => {
                    return contentAprroved;
                })
                .catch( err => {
                    throw new Error( err );
                });

    },
    getAllApproveContent : function(){
        return contentCollection
                .find({"status":"1"})
                .populate( 'creator' , ['name'])
                .then( content => {
                    return content;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    getAllNotApproveContent : function(){
        return contentCollection
                .find({"status":"0"})
                .populate( 'creator' , ['name'])
                .then( content => {
                    return content;
                })
                .catch( err => {
                    throw new Error( err );
                });
    }
}

module.exports = {
    Content
};