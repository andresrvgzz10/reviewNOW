//import what it is in express library
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { DATABASE_URL, PORT, SECRET_TOKEN } = require( './config' );
const { Users } = require('./models/usersModel')
const { Content } = require('./models/contentModel')
const { Review } = require('./models/reviewsModel')
const { ToWatch } = require('./models/toWatchModel')
const { AlreadyWatch } = require('./models/alreadyWatchModel')
const mongoose = require('mongoose');
const cors = require( './middleware/cors' );
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const app = express();
const jsonParser = bodyParser.json();

app.use( cors );
app.use( morgan('dev'));
app.use(express.static("public"))

//NEW



app.get('/api/users/validate-token', (req, res) => {

    let token = req.headers.sessiontoken;

    console.log(token);

    jsonwebtoken.verify(token, SECRET_TOKEN, (err, decoded) => {
        console.log("entra");
       if(err)
       {
           res.statusMessage = "Your session has expired, LOGIN AGAIN";
           return res.status(409).end();
       }

        console.log(decoded);
        return res.status(200).json({
            name: decoded.name,
            email : decoded.email,
            status: decoded.status
       });

       
    });

});

//Login User
app.post('/user/loginUser',jsonParser,(req,res) => {

    const {email, password} = req.body;

    if(!email || !password)
    {
        res.statusMessage = "Need to put all the params";
        return res.status( 400 ).end();
    }

    Users
        .getUserByEmail(email)
        .then(user => {
            
            console.log(user)
            bcrypt.compare(password, user.password)
            .then( result => {
                console.log(result)
                if(result)
                {
                    let userData = {
                        name: user.name,
                        email : user.email,
                        password: user.password,
                        status: user.status
                    }

                    console.log(userData)
                    //what do we want to save in this token
                    /*
                        userData = la info que se guardara,
                        secret_token = el que nosotros ponemos en cofig que revisa que si sea ese
                    */
                    jsonwebtoken.sign(userData,SECRET_TOKEN, {expiresIn : '30m'},(err, token) => {
                            console.log(token)
                            if(err){
                                res.statusMessage = err.message;
                                return res.status( 400 ).end(); 
                            }
                            return res.status(200).json({
                                token,
                                userStatus: user.status
                            });
                            
                    });
                }
                else{
                    res.statusMessage = "Something went wrong with email or password";
                    return res.status( 400 ).end(); 
                }
                    

        })
    })
        .catch( err => {
            res.statusMessage = "Something went wrong login the user";
            return res.status( 400 ).end();
        })

})


//Get All Users
app.get('/allUsers', (req,res) =>{

    Users
        .getAllUsers()
        .then(users => {
            return res.status(200).json(users);
        })
        .catch( err => {
            res.statusMessage = "Something went wrong creating User";
            return res.status( 400 ).end();
        })


})

//Create User
app.post('/user/createUser', jsonParser, (req,res) =>{

    let { name, email, password,status} = req.body;

    if(!name || !email || !password || !status)
    {
        res.statusMessage = "Need to put all the params";
        return res.status( 400 ).end();
    }

    bcrypt.hash(password, 10)
        .then( hashedPassword => {
            let newUser = { 
                name, 
                email, 
                password : hashedPassword, 
                status 
            };

            Users
                .createUser( newUser )
                .then( result => {
                    return res.status( 201 ).json( result ); 
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                });
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
})




//Create Content with status 0 it means approve is pending
app.post('/createContent',jsonParser, (req,res) =>{

    const {title, description, type,image,status,email} = req.body;
   
    if(!title || !description || !image || !status || !email || !type)
    {
        res.statusMessage = "Need to put all the params";
        return res.status( 400 ).end();
    }
    
    Users
        .userByEmail(email)
        .then(user => {

            const newContent = {
                title,
                description,
                type,
                image,
                status,
                creator: user._id   
            } 
            console.log(newContent )
            
                Content
                .createContent(newContent)
                .then(content => {
                    return res.status(200).json(content);
                })
                .catch( err => {
                    res.statusMessage = err.message
                    //res.statusMessage = "Something went wrong Content";
                    return res.status( 400 ).end();
                })

        })
        .catch( err => {
            res.statusMessage = "Something went wrong finding User";
            return res.status( 400 ).end();
        })

    

})

// Get al the content that is in the website
app.get('/allContent', (req,res) => {
    Content
        .getAllContent()
        .then(allContent => {
            return res.status(200).json(allContent);
        })
        .catch( err => {
            res.statusMessage = "Something whent wrong";
            return res.status( 400 ).end();
        })

})

//Create review with status 0 it means approve is pending
app.post('/createReview', jsonParser, (req,res) => {

    const {comment, email, title, status} = req.body;

    if(!comment || !email || !title || !status)
    {
        res.statusMessage = "Need to put all the params";
        return res.status( 400 ).end();
    }

    Users
    .userByEmail(email)
    .then(user => {

        Content
            .getContentByTitle(title)
            .then( content => {

                const newReview = {
                    user: user._id,
                    content: content._id,
                    comment,
                    status
                }

                Review
                    .createReview(newReview)
                    .then(reviewCreated => {
                        return res.status(200).json(reviewCreated);
                    })
                    .catch( err => {
                        res.statusMessage = "Something whent wrong";
                        return res.status( 400 ).end();
                    })



            })
            

    })
    .catch( err => {
        res.statusMessage = "Something went wrong finding User";
        return res.status( 400 ).end();
    })


})

//Get All Reviews
app.get('/getAllReviews', (req,res) => {
    Review
        .getAllReviews()
        .then(reviews => {
            return res.status(200).json(reviews);
        })
        .catch( err => {
            res.statusMessage = "Something whent wrong";
            return res.status( 400 ).end();
        })
})

//Get All Reviews
app.get('/getReviewByUserandContent', (req,res) => {

    let title = req.query.title;

    let email = req.query.email;

    if( !email || !title )
    {
        res.statusMessage = "Need to enter all the params";
        return res.status( 400 ).end();
    }

    Content
        .getContentByTitle(title)
        .then(content => {
            console.log(content)
            Users
                .getUserByEmail(email)
                .then(user => {

                    Review
                        .getReviewByUserAndContent(user._id,content._id)
                        .then(found => {
                            return res.status(200).json(found);
                        })
                        .catch( err => {
                            res.statusMessage = err.message;
                            return res.status( 400 ).end();
                        })
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                })
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })
})



//Change content from 0 to 1 THIS IS APPROVED (UPDATE)
app.patch('/approveContent' , jsonParser, (req,res) => {

    let title = req.body.title;
    let id = req.body._id;

    if( !title || !id )
    {
        res.statusMessage = "Need to put all the params";
        return res.status( 400 ).end();
    }

    Content
        .approveContent(title, id)
        .then(contentApproved => {
            return res.status(200).json(contentApproved);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

})

//delete content
app.patch('/deleteContent' , jsonParser, (req,res) => {

    let id = req.body._id;

    if(!id )
    {
        res.statusMessage = "Need to put all the params";
        return res.status( 400 ).end();
    }

    Content
        .deleteContent(id)
        .then(contentDelete => {
            return res.status(200).json(contentDelete);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

})

//approve review
app.patch('/approveReview' , jsonParser, (req,res) => {

    let id = req.body._id;

    if( !id )
    {
        res.statusMessage = "Need to put all the params";
        return res.status( 400 ).end();
    }

    Review
        .approveReview(id)
        .then(reviewApproved => {
            console.log(reviewApproved)
            return res.status(200).json(reviewApproved);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

})

//delete review
app.patch('/deleteReview' , jsonParser, (req,res) => {

    let id = req.body._id;

    if( !id )
    {
        res.statusMessage = "Need to put all the params";
        return res.status( 400 ).end();
    }

    Review
        .deleteReview(id)
        .then(reviewDeleted => {
            return res.status(200).json(reviewDeleted);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

})



//Change review from 0 to 1 THIS IS APPROVED (UPDATE)
app.patch('/approveReviewByID',jsonParser,(req,res) => {

    let id= req.body._id;

    Review
        .approveReview(id)
        .then(reviewApproved => {
            return res.status(200).json(reviewApproved);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

})

app.get('/allNotApproveReviews', (req,res) => {

    Review
        .getAllNotApproveReviews()
        .then(allNotApproveReviews => {
            return res.status(200).json(allNotApproveReviews);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })


})

app.get('/allApproveContent', (req, res) => {

    Content
        .getAllApproveContent()
        .then(allApproveContent => {
            return res.status(200).json(allApproveContent);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })


})

app.get('/allNotApproveContent', (req, res) => {

    Content
        .getAllNotApproveContent()
        .then(allNotApproveContent => {
            return res.status(200).json(allNotApproveContent);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })


})

app.post('/getContentByTitle', jsonParser, (req, res) => {

    const { title} = req.body;

    if( !title )
    {
        res.statusMessage = "Need to enter title";
        return res.status( 400 ).end();
    }

    Content
        .getContentByTitle(title)
        .then(content => {
            return res.status(200).json(content);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })


})


app.get('/getReviewsByTitleContent', jsonParser, (req, res) => {

    const { title} = req.body;

    if( !title )
    {
        res.statusMessage = "Need to enter title";
        return res.status( 400 ).end();
    }
        
    Content
        .getContentByTitle(title)
        .then(content => {

            Review
                .getReviewsByIdContent(content._id)
                .then(reviews => {
                    return res.status(200).json(reviews);
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                })
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })


})

app.get('/getReviewsApprovedByTitleContent', (req, res) => {

    //const { title} = req.body;
    let title = req.query.title

    if( !title )
    {
        res.statusMessage = "Need to enter title";
        return res.status( 400 ).end();
    }
        
    Content
        .getContentByTitle(title)
        .then(content => {

            console.log(content)
            Review
                .getReviewsByIdContentApproved(content._id)
                .then(reviews => {
                    return res.status(200).json(reviews);
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                })
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })


})

app.get('/contentByUserEmail', (req,res) => {

    let email = req.query.email;

    if( !email )
    {
        res.statusMessage = "Need to enter email";
        return res.status( 400 ).end();
    }
        
    Users
        .getUserByEmail(email)
        .then(user => {
            
            Content
                .getContentByCreator(user._id)
                .then(allContent => {
                    return res.status(200).json(allContent);
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                })
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })


})


app.get('/reviewsByUser', (req,res) => {

    let email = req.query.email;

    if( !email )
    {
        res.statusMessage = "Need to enter email";
        return res.status( 400 ).end();
    }
        
    Users
        .getUserByEmail(email)
        .then(user => {
            
            Review
                .getAllReviewsByUser(user._id)
                .then(allReviews => {
                    return res.status(200).json(allReviews);
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                })
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

})

app.get('/userGetInformation', (req,res) => {

    let email = req.query.email;

    if( !email )
    {
        res.statusMessage = "Need to enter email";
        return res.status( 400 ).end();
    }

    Users
        .getUserByEmail(email)
        .then(user => {
            return res.status(200).json(user);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

})

app.get('/getContentToWatchByEmailUser', (req,res) => {

    let email = req.query.email;

    if( !email )
    {
        res.statusMessage = "Need to enter email";
        return res.status( 400 ).end();
    }
       
    Users
        .getUserByEmail(email)
        .then(user => {
            ToWatch
                .getAllToWatchByUser(user._id)
                .then(allContent => {
                    return res.status(200).json(allContent);
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                })
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

    
})

app.get('/getContentAlreadyWatchByEmailUser', (req,res) => {

    let email = req.query.email;

    if( !email )
    {
        res.statusMessage = "Need to enter email";
        return res.status( 400 ).end();
    }
       
    Users
        .getUserByEmail(email)
        .then(user => {
            AlreadyWatch
                .getAlreadyWatchByUser(user._id)
                .then(allContent => {
                    return res.status(200).json(allContent);
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                })
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

    
})

app.post('/addContentToWatch', jsonParser, (req,res) => {

    const {title, email} = req.body;

    if( !email || !title )
    {
        res.statusMessage = "Need to enter email";
        return res.status( 400 ).end();
    }

    Content
        .getContentByTitle(title)
        .then(content => {
            console.log(content)
            Users
                .getUserByEmail(email)
                .then(user => {

                    const newContentToWatch = {
                        user: user._id,
                        content: content._id,
                    }
                    console.log(newContentToWatch)
                    ToWatch
                        .insertToWatch(newContentToWatch)
                        .then(newContentAdded => {
                            return res.status(200).json(newContentAdded);
                        })
                        .catch( err => {
                            res.statusMessage = err.message;
                            return res.status( 400 ).end();
                        })
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                })
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

})

app.post('/addContentToAlreadyWatch', jsonParser, (req,res) => {
    
    const { title, email} = req.body;

    if( !email || !title )
    {
        res.statusMessage = "Need to enter email";
        return res.status( 400 ).end();
    }

    Content
        .getContentByTitle(title)
        .then(content => {
            console.log(content._id)
            Users
                .getUserByEmail(email)
                .then(user => {

                    console.log(user._id)

                    const newContentAlreadyWatch = {
                        user: user._id,
                        content: content._id,
                    }
                    AlreadyWatch
                        .insertAlreadyWatch(newContentAlreadyWatch)
                        .then(newContentAdded => {
                            return res.status(200).json(newContentAdded);
                        })
                        .catch( err => {
                            res.statusMessage = err.message;
                            return res.status( 400 ).end();
                        })
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                })
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

})

app.delete('/deleteToWatchByID', (req,res) => {

    let id = req.query.id;

    ToWatch
        .deleteFromToWatch(id)
        .then(deleted => {
            return res.status(200).json(deleted);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })


})

app.delete('/deleteAlreadyWatchByID', (req,res) => {

    let id = req.query.id;

    AlreadyWatch
        .deleteFromAlreadyWatch(id)
        .then(deleted => {
            return res.status(200).json(deleted);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })


})

app.get('/getAlreadyWatchContentByUser', (req,res) => {

    let title = req.query.title;
    let email = req.query.email;

    if( !email || !title )
    {
        res.statusMessage = "Need to enter email";
        return res.status( 400 ).end();
    }

    Content
        .getContentByTitle(title)
        .then(content => {


            Users
                .getUserByEmail(email)
                .then(user => {


                    AlreadyWatch
                        .boolAlreadyWatchContentAndUser(user._id,content._id)
                        .then(newContentAdded => {
                            return res.status(200).json(newContentAdded);
                        })
                        .catch( err => {
                            res.statusMessage = err.message;
                            return res.status( 400 ).end();
                        })
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                })
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })


})

app.get('/getToWatchContentByUser', (req,res) => {

    let title = req.query.title;
    let email = req.query.email;

    if( !email || !title )
    {
        res.statusMessage = "Need to enter email";
        return res.status( 400 ).end();
    }

    Content
        .getContentByTitle(title)
        .then(content => {
            console.log(content)
            Users
                .getUserByEmail(email)
                .then(user => {

                    ToWatch
                        .boolToWatchContentAndUser(user._id,content._id)
                        .then(newContentAdded => {
                            return res.status(200).json(newContentAdded);
                        })
                        .catch( err => {
                            res.statusMessage = err.message;
                            return res.status( 400 ).end();
                        })
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                })
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

})

app.listen(PORT, () => {

    console.log( "This server is running on port 8080" );

    new Promise( ( resolve, reject ) => {
        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };
        mongoose.connect(DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });


});