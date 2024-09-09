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

    // Checking if everything is working
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

      // More checking
      console.log("Response Status", response.status);
      console.log("Response", result);

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

let voices = [];

const loadVoices = () => {
  //getting available voices
  voices = synth.getVoices();

  // Assign voices to radio buttons
  if (voices.length >= 3) {
    document.getElementById("option-voice1").value = voices[0].name;
    document.getElementById("option-voice2").value = voices[1].name;
    document.getElementById("option-voice3").value = voices[2].name;

    document.querySelector("label[for='option-voice1']").textContent =
      voices[0].name;
    document.querySelector("label[for='option-voice2']").textContent =
      voices[1].name;
    document.querySelector("label[for='option-voice3']").textContent =
      voices[2].name;
  }
};

// Making sure everything is fully loaded
window.speechSynthesis.onvoiceschanged = loadVoices;

const getSelectedVoice = () => {
  let selectedVoiceName;
  const selectedRadio = document.querySelector('input[name="voice"]:checked'); // Find checked radio button

  if (selectedRadio) {
    selectedVoiceName = selectedRadio.value; // Setting value of radio button to selectedVoiceName
  }

  return voices.find((voice) => voice.name === selectedVoiceName); // Find the voice object with the selected name
};

const enunciateTranslation = () => {
  const selectedVoice = getSelectedVoice(); // Get the selected voice
  const translation = document.getElementById("translation").textContent; // Get the translated text
  console.log(translation);

  if (selectedVoice && translation) {
    const utterance = new SpeechSynthesisUtterance(translation); // Create speech object
    utterance.voice = selectedVoice; // Set the selected voice

    synth.speak(utterance); // Speak the text
  } else {
    console.log("No voice selected or no translation available.");
  }
};

// event listener
enunciateButton.addEventListener("click", enunciateTranslation);
buttonTranslate.addEventListener("click", translateText);
