const mongoose = require('mongoose');

//specify our collection schema
//building the structure od the table
const reviewsCollectionSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true,
        unique: true
    },
    content : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contents',
        require: true
    },
    comment : {
        type: String,
        require: true
    },
    status : {
        type: String,
        require: true
    }
})


const contentCollection = mongoose.model( 'reviews' , reviewsCollectionSchema);

const Review = {
    createReview : function( newReview ){
        return contentCollection
                .create( newReview )
                .then( createdReview => {
                    return createdReview;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    getAllReviews : function(){
        return contentCollection
                .find()
                .populate( 'user' , ['name'])
                .populate( 'content' , ['title'])
                .then( allReviews => {
                    return allReviews;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    getAllReviewsByUser : function(id){
        return contentCollection
                .find({"user": id})
                .populate( 'user' , ['name'])
                .populate( 'content' , ['title'])
                .then( allReviews => {
                    return allReviews;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    getAllNotApproveReviews : function(){
        return contentCollection
                .find({"status":"0"})
                .populate( 'user' , ['name'])
                .populate( 'content' , ['title'])
                .then( allReviews => {
                    return allReviews;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    approveReview : function(user,content){
        return contentCollection
                .updateOne({"user": user, "content":content },{$set: {status:"1"}})
                .then( reviewAprroved => {
                    return reviewAprroved;
                })
                .catch( err => {
                    throw new Error( err );
                });

    },
    getReviewsByIdContent : function(id){
        return contentCollection
                .find({"content":id})
                .populate( 'user' , ['name'])
                .populate( 'content' , ['title'])
                .then( reviews => {
                    return reviews;
                })
                .catch( err => {
                    throw new Error( err );
                });

    },
    getReviewsByIdContentApproved : function(id){
        return contentCollection
                .find({"content": id,"status":"1"})
                .populate( 'user' , ['name'])
                .populate( 'content' , ['title'])
                .then( reviews => {
                    return reviews;
                })
                .catch( err => {
                    throw new Error( err );
                });

    }

    
}

module.exports = {
    Review
};