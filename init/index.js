const express = require("express");
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/RentVista');
}

main()
.then((res)=> console.log("Connected to DB!"))
.catch((err)=> console.log("Unable to Connect to DB!"));

const initDb = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: "66c1e6499f980426c1112df2"}));
    await Listing.insertMany(initData.data);
    console.log("Data re-Initialisation Successful!");
}
initDb();
