const express = require("express");
const app = express();
const fetch = require("node-fetch");
const pool = require("./dbPool.js")

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", async function(req, res){
    let url = `https://api.unsplash.com/photos/random/?&client_id=4Z7MM8IhVtjgawtYZzhPC_FM1jLRT4obypgMJ5coM1I`;
    let response = await fetch(url);
    let data = await response.json();
    res.render("index", {"imageUrl": data.urls.small});
})

app.get("/search", async function(req, res){
    let keyword = "";
    if (req.query.keyword){
        keyword = req.query.keyword;
    }
    let url = `https://api.unsplash.com/photos/random/?count=9&client_id=4Z7MM8IhVtjgawtYZzhPC_FM1jLRT4obypgMJ5coM1I`;
    let response = await fetch(url);
    let data = await response.json();
    
    let imageUrlArray = [];
    for (let i = 0; i < data.length; i++){
        imageUrlArray.push(data[i].urls.small);
    }
    res.render("results", {"imageUrl": data[0].urls.small, "imageUrlArray": imageUrlArray});
})

app.get("/api/updateFavorites", function(req, res){
  let sql;
  let sqlParams;
  switch (req.query.action) {
    case "add": sql = "INSERT INTO favorites (imageUrl, keyword) VALUES (?,?)";
                sqlParams = [req.query.imageUrl, req.query.keyword];
                break;
    case "delete": sql = "DELETE FROM favorites WHERE imageUrl = ?";
                sqlParams = [req.query.imageUrl];
                break;
  }//switch
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows.affectedRows.toString());
  });
    
});//api/updateFavorites

app.get("/getKeywords",  function(req, res) {
  let sql = "SELECT DISTINCT keyword FROM favorites ORDER BY keyword";
  let imageUrl = ["img/favorite.png"];
  pool.query(sql, function (err, rows, fields) {
     if (err) throw err;
     console.log(rows);
     res.render("favorites", {"imageUrl": imageUrl, "rows":rows});
  });  
});//getKeywords

app.get("/api/getFavorites", function(req, res){
  let sql = "SELECT imageURL FROM favorites WHERE keyword = ?";
  let sqlParams = [req.query.keyword];  
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows);
  });
});

// Start server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running...");
});