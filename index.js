import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import fs from "fs";

const port=3300;
const app= express();
let adhar="user_";
let pass="user@";
mongoose.connect('mongodb://localhost:27017/YOJNA')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

let chatList = ["Hello i am here to help you"]
const chatResponses = {
  "What government schemes are available?": "There are various government schemes available such as PM Kisan Yojana, Ayushman Bharat Yojana, PM SVANidhi Yojana, etc.",
  "Can you give me updates about new yojnas?": "Sure, the government recently launched the Atmanirbhar Bharat Rozgar Yojana to boost employment.",
  "How do I apply for PM Kisan Yojana?": "You can apply for PM Kisan Yojana online through the official website of PM Kisan or visit your nearest Common Service Centre.",
  "Tell me about Ayushman Bharat Yojana.": "Ayushman Bharat Yojana provides health insurance coverage to economically vulnerable families. It aims to cover more than 10 crore poor families.",
  "What is the eligibility for PM SVANidhi Yojana?": "PM SVANidhi Yojana is for street vendors. To be eligible, the vendor should be in possession of a Certificate of Vending, and the vendor's business should be in the urban area as per the 2011 Census.",
  "Give me details about Atal Pension Yojana.": "Atal Pension Yojana is a pension scheme for the unorganized sector. The age of the subscriber should be between 18 and 40 years. The subscriber receives a fixed minimum pension ranging from Rs. 1000 to Rs. 5000 per month after the age of 60.",
  "What are the benefits of Pradhan Mantri Awas Yojana?": "Pradhan Mantri Awas Yojana provides affordable housing to urban poor. The benefits include interest subsidy on home loans, assistance for construction, and enhancement of housing stock.",
  "How can I check the status of my PM Jan Dhan Yojana account?": "You can check the status of your PM Jan Dhan Yojana account by visiting the official website or contacting your bank. You can also use the mobile app or SMS facility provided by the bank.",
};
// Create a schema for your user model
const userSchema = new mongoose.Schema({
  Aadhar_no: String,
  Password: String
}, { collection: 'AADHAR_INFO'});

// Create a model based on the schema
const User = mongoose.model('AADHAR_INFO', userSchema);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

const schemes = JSON.parse(fs.readFileSync('Aadhar_data.json'))

app.post('/login', async (req, res) => {
  const { Aadhar_no, Password } = req.body;
  adhar = Aadhar_no;
  pass = Password;
  try {
    console.log("Attempting to log in with Aadhar_no:", Aadhar_no);
    
    // Find the user in the database by Aadhar_no
    const user = await User.findOne({ Aadhar_no }).exec();
    
    console.log("Retrieved user from the database:", user);
    
    // If user found, check password
    if (user) {
      console.log("User found, checking password...");
      if (user.Password === Password) {
        console.log("Login successful!");
        // Render index page with user's information
        res.render("landing.ejs", { userName: user.Aadhar_no});
      } else {
        console.log("Invalid password!");
        res.send('Invalid password');
      }
    } else {
      console.log("User not found!");
      res.send('User not found');
    }
  } catch (error) {
    console.error('Error finding user:', error);
    res.send('Error finding user');
  }
});

app.get("/login",(req,res)=>{
    res.render("index.ejs",{userName:"username"});
})
app.get("/logout",(req,res)=>{
    username="user";
    res.redirect("/login");
})
// app.get("/profile",(req,res)=>{
//     res.render("profile.ejs");
// })
app.get("/schemes",(req,res)=>{
    res.render("schemes.ejs");
})
app.get("/notifications",(req,res)=>{
    res.render("notification.ejs");
})
app.get("/feedback",(req,res)=>{
    res.render("feedback.ejs");
})

app.post("/feedback",(req,res)=>{
    
    res.redirect("/");
})



app.get("/",(req,res)=>{
    if (adhar == "user") {
        res.redirect("/login");
    } else {
        res.render("landing.ejs", {chatList: chatList});
    }
})
app.get("/reset",(req,res)=>{
    res.render("setpass.ejs");
})
app.get("/profile",(req,res)=>{
    res.render("reportpage.ejs");
})
app.post("/newMessage", (req, res) => {
  const msg = req.body.msg;
  const currResponse = chatResponses[msg] || " I'm sorry, I don't understand that question.";
  chatList.push(msg)
  chatList.push(currResponse)
  res.redirect("/#chatBot")
})


app.listen(port,()=>{
    console.log(`your running port is : ${port}`);
})