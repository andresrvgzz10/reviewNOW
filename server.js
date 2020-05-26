//import what it is in express library
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { DATABASE_URL, PORT, SECRET_TOKEN } = require( './config' );
const { Users } = require('./models/usersModel')
const { Content } = require('./models/contentModel')
const { Review } = require('./models/reviewsModel')
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
        return res.status(200).end().json({
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



//Change content from 0 to 1 THIS IS APPROVED (UPDATE)
app.patch('/approveContent' , jsonParser, (req,res) => {

    let title = req.body.title;

    if( !title)
    {
        res.statusMessage = "Need to put all the params";
        return res.status( 400 ).end();
    }

    Content
        .approveContent(title)
        .then(reviewApproved => {
            return res.status(200).json(reviewApproved);
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        })

})

//Change review from 0 to 1 THIS IS APPROVED (UPDATE)
app.patch('/approveReview' , jsonParser, (req,res) => {

    const { title, email} = req.body;
    if( !title || !email)
    {
        res.statusMessage = "Need to put all the params";
        return res.status( 400 ).end();
    }

    Users
        .userByEmail(email)
        .then(user => {

            if(user == null)
            {
                res.statusMessage = "No user found";
                return res.status( 400 ).end();
            }
            Content
                .getContentByTitle(title)
                .then(content => {

                    if(content == null)
                    {
                        res.statusMessage = "No content found";
                        return res.status( 400 ).end();
                    }

                    Review
                        .approveReview(user._id,content._id)
                        .then(approvedReview => {
                            if(approvedReview == null)
                            {
                                res.statusMessage = "No content found";
                                return res.status( 400 ).end();
                            }

                            return res.status(200).json(approvedReview);
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