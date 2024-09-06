import { API_ENDPOINT } from "./config.js";
import { API_KEY } from "./config.js";

let enunciateButton = document.getElementById("enunciate-btn");
let buttonTranslate = document.getElementById("button-translate");

// TRANSLATION
async function translateText() {
  const wordToTranslate = document.getElementById("inputWord").value; // Fetch text from input
  const selectedLanguage = document.getElementById("select-language").value; // Fetch selected language

  if (wordToTranslate && selectedLanguage) {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "rapid-translate-multi-traduction.p.rapidapi.com",
        "x-rapidapi-key": API_KEY,
      },
      body: JSON.stringify({
        from: "en", //Assuming 'en' (English) is the source language
        to: selectedLanguage, //target language
        e: "", // rapidAPI format check for API Docs
        q: wordToTranslate, //words on the input field
      }),
    };

    //checking if everything is working
    console.log(
      "Request Payload",
      JSON.stringify({
        from: "en",
        to: selectedLanguage,
        e: "",
        q: wordToTranslate,
      })
    );

    try {
      const response = await fetch(API_ENDPOINT, options);
      const result = await response.json();

      //more checking
      console.log("Response Status", response.status);
      console.log("Response", result);
      console.log(result);

      if (result) {
        document.getElementById("translation").textContent = result;
      } else {
        console.error("Translation not found:", result);
      }
    } catch (error) {
      console.error("Error with API call:", error);
    }
  } else {
    alert("Please enter text and select a language.");
  }
}

// Speech Synthesis Utterance
let synth = window.speechSynthesis;

let inputWord = document.getElementById("inputWord");
let dropdownLanguage = document.getElementById("select-language");
let voice = document.getElementById("voice");
let voices;

const loadVoices = () => {
  //getting available voices
  voices = synth.getVoices();

  let voice1 = document.getElementById("option-voice1");
  let voice2 = document.getElementById("option-voice2");
  let voice3 = document.getElementById("option-voice3");

  for (let i = 0; i < voices.length; i++) {}
};

enunciateButton.addEventListener("click", loadVoices);
buttonTranslate.addEventListener("click", translateText);
