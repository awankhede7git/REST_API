//This is implementing the rest api using mongodb.

//The purpose is to note the differences.

const express = require('express');
//const users = require('./users.json');
const fs = require('fs');
const { send, allowedNodeEnvironmentFlags } = require('process');
const { json } = require('stream/consumers');

const app = express();

const mongoose = require('mongoose');
//const users = require('./users.json');

//connection
mongoose.connect('mongodb://127.0.0.1:27017/rest_api') //name of databse is rest_api
    .then(() => console.log("MongoDB connected<3"))
    .catch((err)=> console.log("Mongodb error", err));

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
        type : String,
        required : true
    }
});

//passing the schema userSchema to a model.
const User = mongoose.model('user', userSchema);


// middleware
app.use(express.urlencoded({ extended: false })); // For form data
app.use(express.json());//for json data

//Routes - 

app.get("/users", async(req, res) => {
    //return res.json(users);
    /*fs.readFile('./users.json', 'utf-8', (err, data) => {
        if(err){
            res.status(500).send("Error while reading the file!:(");
            return;
        }

        const users = JSON.parse(data);
        let htmlContent = `<html>
      <head>
        <title>User List</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <h1>User List</h1>
        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>`;

          users.forEach(user => {
            htmlContent += `
              <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.address}</td>
              </tr>`;
          });
      
          htmlContent += `
              </table>
            </body>
            </html>`;
          res.send(htmlContent);
        
    });*/

    const AllUsers = await User.find({});
    const html = `
    <ul>
        ${AllUsers
            .map((user) => `<li>${user.name} - ${user.email}</li>`)
            .join("")
        }
    </ul>`

    res.send(html);
});

app.get('/users/:id', async(req,res)=>{
    const id = req.params.id; //params == parameters in the request route.
    /*fs.readFile('./users.json', 'utf-8', (err, data)=>{
        if(err){
            res.status(500).send("Error while reading file:(");
        }
        const users = JSON.parse(data);

        const user = users.find((user) => user.id === id);

        let htmlUser = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <title>User Information</title>
            <style>
              /* Include the same CSS as above */
            /*</style>
          </head>
          <body>
            <div class="user-container">
              <h1>User Information</h1>
              <div class="user-details">
                <p><span>ID:</span> ${user.id}</p>
                <p><span>Name:</span> ${user.name}</p>
                <p><span>Email:</span> ${user.email}</p>
                <p><span>Phone:</span> ${user.phone}</p>
                <p><span>Address:</span> ${user.address}</p>
              </div>
            </div>
          </body>
          </html>
        `*/

        //res.send(htmlUser);
        const IdUser = await User.findById(id);
        if(!IdUser){
          return res.status(404).json("User not found!");
        }

        res.json(IdUser);
          
});


app.post('/users', async(req,res)=>{
    /*fs.readFile('./users.json', 'utf-8', (err, data)=>{
      if(err){
        return res.status(500).send("Error while reading file!");
      }
      const users = JSON.parse(data);

      const body = req.body;
      users.push({...body, id: users.length+1});
      fs.writeFile('./users.json', JSON.stringify(users), (err,data)=>{
        return res.json({status: "success", id: users.length });
      });
      
    })*/

    const body = req.body;

    if(
        !body.name||
        !body.email||
        !body.phone||
        !body.address
    ){
        return res.status(400).json("Certain fields are missing!");
    }

    
    const newUser = await User.create({
        name : body.name,
        email : body.email,
        phone : body.phone,
        address : body.address,
    });

    res.status(201).json({
        status : "success",
        data : newUser
    });

});//here new user isnt added in the users.json file, obviously.
//commands for viewing data-
//show dbs
//use rest_api
//show collections
//db.users.find({})

app.patch('/users/:id', async(req,res)=>{
  /*const id = Number(req.params.id);
  fs.readFile('./users.json', 'utf-8', (err, data)=>{
    if(err){
      return res.status(500).send("Error while reading file!");
    }
    const users = JSON.parse(data);
    const UserIndex = users.findIndex(user=> user.id===id);
     
    const body = req.body;
    users[UserIndex] = {...users[UserIndex],...body};
    fs.writeFile('./users.json', JSON.stringify(users, null, 2), (writeErr)=>{
      if(writeErr){
        return res.status(500).send("Error while writing to file!");
      }
      res.json({
        status : "success",
        user: users[UserIndex]
      });
    });
  });*/
  const id = req.params.id //we will keep this as string and not number as we are using mongoose.
  const updated_body = req.body;

  if(!id){
    return res.status(404).json("user not found!");
  }

  const updating_user = await User.findByIdAndUpdate(id,updated_body);

  const changed_user = await User.findById(id);

  res.status(200).json(changed_user);

});

app.delete('/users/:id', async(req, res)=>{
  /*const id = Number(req.params.id);
  fs.readFile('./users.json', 'utf-8', (err, data)=>{
    if(err){
      return res.status(500).send("The file could not be read!");
    }

    const users = JSON.parse(data);
    const UserIndex = users.findIndex(user => user.id === id); //users is an array and ' user ' is an element of that array.
    
    users.splice(UserIndex, 1); //remove one entry from particualr index.

    //writing the array contents back into json format.
    fs.writeFile('./users.json', JSON.stringify(users, null, 2), (writeErr)=>{
      if(writeErr){
        
        return res.status(500).send("Content could not be written back to json file:(");

      }

      return res.json({
        status:"success",
        message: `User with ID ${id} has been deleted successfully!`
      });
    });
  });*/

  const id = req.params.id;

  if(!id){
    res.status(404).json({ "error" : "Id not found!"});
  }

  const deleted_user = await User.findByIdAndDelete(id);

  const temp = deleted_user;

  res.status(201).json({
    status : "success",
    data : temp
  });
});


app.listen(8000, () => {
    console.log('Server has started! <3');
}); 


