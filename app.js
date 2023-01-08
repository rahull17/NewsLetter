const express = require("express");
const bp = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");


const app = express();

app.use(express.static("public"));
app.use(bp.urlencoded({
  extended: true
}));

mailchimp.setConfig({
  apiKey: "e367efc511f620d57e4c931e5de45960-us8",
  server: "us8"
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", (req, res) => {
  const listId = "fe4b3c2817";
  const subscribingUser = {
    firstName: req.body.fn,
    lastName: req.body.ln,
    email: req.body.eml
  }

  async function run() {
    try {

      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id }.`
      );
      res.sendFile(__dirname + "/success.html");
    } catch (e) {
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();
});

app.post("/failure",function(req,res){
  res.redirect("/");
})



app.listen(process.env.PORT || 5000, () => {
  console.log("Server Is Started On Port 5000 ");
});

//e367efc511f620d57e4c931e5de45960-us8

//fe4b3c2817.
