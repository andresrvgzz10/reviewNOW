const mongoose = require('mongoose');

//specify our collection schema
//building the structure od the table
const reviewsCollectionSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true
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


const reviewCollection = mongoose.model( 'reviews' , reviewsCollectionSchema);

const Review = {
    createReview : function( newReview ){
        return reviewCollection
                .create( newReview )
                .then( createdReview => {
                    console.log(createdReview)
                    return createdReview;
                })
                .catch( err => {
                    console.log(err)
                    throw new Error( err );
                });
    },
    getAllReviews : function(){
        return reviewCollection
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
        return reviewCollection
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
        return reviewCollection
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
        return reviewCollection
                .updateOne({"user": user, "content":content },{$set: {status:"1"}})
                .then( reviewAprroved => {
                    return reviewAprroved;
                })
                .catch( err => {
                    throw new Error( err );
                });

    },
    getReviewsByIdContent : function(id){
        return reviewCollection
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
        return reviewCollection
                .find({"content": id,"status":"1"})
                .populate( 'user' , ['name'])
                .populate( 'content' , ['title'])
                .then( reviews => {
                    return reviews;
                })
                .catch( err => {
                    throw new Error( err );
                });

    },
    approveReview : function(id){
        return reviewCollection
                .updateOne({"_id": id},{$set: {status:"1"}})
                .populate( 'user' , ['name'])
                .populate( 'content' , ['title'])
                .then( reviews => {
                    return reviews;
                })
                .catch( err => {
                    throw new Error( err );
                });

    },
    deleteReview : function(id){
        return reviewCollection
                .updateOne({"_id": id},{$set: {status:"3"}})
                .populate( 'user' , ['name'])
                .populate( 'content' , ['title'])
                .then( reviews => {
                    return reviews;
                })
                .catch( err => {
                    throw new Error( err );
                });

    },
    getReviewByUserAndContent: function(userID,ContentID){
        return reviewCollection
                .findOne({"user": userID, "content":ContentID})
                .then( found => {
                    return found;
                })
                .catch( err => {
                    throw new Error( err );
                });
    }

    
}

module.exports = {
    Review
};