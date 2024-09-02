// TRANSLATION

let buttonTranslate = document.getElementById("button-translate");
/*buttonTranslate.addEventListener("click", () => {
  let inputWord = document.getElementById("inputWord").value;

});*/

const apiEndpoint = "https://rapid-translate-multi-traduction.p.rapidapi.com/t";
const apiKey = "7c57acf053mshb0364180de44f0dp1b8babjsn49ffbb83c43d"; // Temporarily hardcoded, will be removed later

async function translateText() {
  const wordToTranslate = document.getElementById("inputWord").value; // Fetch text from input
  const selectedLanguage = document.getElementById("select-language").value; // Fetch selected language

  if (wordToTranslate && selectedLanguage) {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "rapid-translate-multi-traduction.p.rapidapi.com",
        "x-rapidapi-key": apiKey, // Temporarily hardcoded
      },
      body: JSON.stringify({
        from: "en", // Assuming 'en' (English) is the source language
        to: selectedLanguage,
        text: wordToTranslate,
      }),
    };

    console.log(
      "Request Payload",
      JSON.stringify({
        from: "en",
        to: selectedLanguage,
        text: wordToTranslate,
      })
    );

    try {
      const response = await fetch(apiEndpoint, options);
      const result = await response.json();

      console.log("Response Status", response.status);
      console.log("Response", result);

      if (result && result.translation) {
        document.querySelector(".translation-container").textContent =
          result.translation;
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

buttonTranslate.addEventListener("click", translateText);
