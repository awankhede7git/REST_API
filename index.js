const express = require('express');
//const users = require('./users.json');
const fs = require('fs');
const { send } = require('process');
const { json } = require('stream/consumers');

const app = express();

// middleware
app.use(express.urlencoded({ extended: false })); // For form data
app.use(express.json());//for json data

//Routes - 

app.get("/users", (req, res) => {
    //return res.json(users);
    fs.readFile('./users.json', 'utf-8', (err, data) => {
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
        
    });
});

app.get('/users/:id', (req,res)=>{
    const id = Number(req.params.id); //params == parameters in the request route.
    fs.readFile('./users.json', 'utf-8', (err, data)=>{
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
            </style>
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
        `;

        res.send(htmlUser);
    });
});

app.post('/users', (req,res)=>{
    fs.readFile('./users.json', 'utf-8', (err, data)=>{
      if(err){
        return res.status(500).send("Error while reading file!");
      }
      const users = JSON.parse(data);

      const body = req.body;
      users.push({...body, id: users.length+1});
      fs.writeFile('./users.json', JSON.stringify(users), (err,data)=>{
        return res.json({status: "success", id: users.length });
      });
      
    })

});

app.patch('/users/:id', (req,res)=>{
  const id = Number(req.params.id);
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


  });

});

app.delete('/users/:id', (req, res)=>{
  const id = Number(req.params.id);
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
        
        return res.status(500).send("Content could not be written back to json filw:(");

      }

      return res.json({
        status:"success",
        message: `User with ID ${id} has been deleted successfully!`
      });
    });
  });
});


app.listen(8000, () => {
    console.log('Server has started! <3');
}); 
