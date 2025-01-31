const express = require('express');
const axios = require('axios');
const { authMiddleware } = require('../middlewares/authMiddleware');

const textRoute = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");


const API_KEY = process.env.API_KEY || 'Gemini-API';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

textRoute.post('/', authMiddleware, async (req, res) =>{
  try{
    const {text} = req.body;
    if(!text){
      return res.statusMessage(400).json({
        error: "Invalid Request.",
        message: "Text is required for summarization"
      })
    }
    const result = await model.generateContent(`Summarize the following text in concise prargrah:\n\n ${text}. Provide only the summary without any introductory words or explanations`);
    
    if(!result || !result.response || !result.response.candidates || !result.response.candidates[0]){
      return res.status(500).json({
        error:"Processing error ",
        message: "Failed to generate summary. Please try again later",
      })
    }

  
    res.status(200).json({
      response: result.response.candidates[0].content.parts[0].text
    });


  }catch(error){
    console.log("Error generating content: ", error);
    res.status(500).json({
      error:"Internal server Error",
      message: " An error occured while processing the request"
    })

  }
});

module.exports = {textRoute};
