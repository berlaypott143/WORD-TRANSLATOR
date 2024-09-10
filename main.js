import { API_ENDPOINT } from "./config.js";
import { API_KEY } from "./config.js";

let enunciateButton = document.getElementById("enunciate-btn");
let buttonTranslate = document.getElementById("button-translate");
let selectLanguage = document.getElementById("select-language");

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

// Function to load voices and filter them based on the selected language
const loadVoices = () => {
  //getting available voices
  voices = synth.getVoices();

  const selectedLanguage = document.getElementById("select-language").value; // Get selected language
  const filteredVoices = voices.filter((voice) =>
    voice.lang.startsWith(selectedLanguage)
  );

  // Assign voices to radio buttons
  if (filteredVoices.length >= 3) {
    document.getElementById("option-voice1").value = filteredVoices[0].name;
    document.getElementById("option-voice2").value = filteredVoices[1].name;
    document.getElementById("option-voice3").value = filteredVoices[2].name;

    document.querySelector("label[for='option-voice1']").textContent =
      filteredVoices[0].name;
    document.querySelector("label[for='option-voice2']").textContent =
      filteredVoices[1].name;
    document.querySelector("label[for='option-voice3']").textContent =
      filteredVoices[2].name;
  } else {
    console.log("Not enough voices available for the selected language.");
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

const speakText = () => {
  const selectedVoice = getSelectedVoice(); // Get the selected voice
  const translationText = document.getElementById("translation").innerText;
  const selectedLanguage = document.getElementById("select-language").value;

  console.log("Captured Translation text:", translationText);
  console.log("Selected voice:", selectedVoice);
  console.log("Selected language:", selectedLanguage);

  if (selectedVoice && translationText) {
    // Ensure the voice supports the language
    if (selectedVoice.lang.startsWith(selectedLanguage)) {
      const utterance = new SpeechSynthesisUtterance(translationText);
      utterance.voice = selectedVoice;
      utterance.lang = selectedLanguage; // Ensure the correct language is set

      console.log("Speaking the translated text in:", selectedLanguage);

      synth.cancel(); // Clear any ongoing speech
      synth.speak(utterance);
    } else {
      console.log(
        "Selected voice does not support the language:",
        selectedLanguage
      );
    }
  } else {
    console.log("No voice selected or no translation available.");
  }
};

// event listener
enunciateButton.addEventListener("click", () => {
  console.log("Enunciate button clicked!");
  speakText();
});
selectLanguage.addEventListener("change", loadVoices); // Listen for changes to the language dropdown and reload voices accordingly
buttonTranslate.addEventListener("click", translateText);
