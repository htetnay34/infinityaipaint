import React, { useState, useEffect } from "react";

const samplePrompts = [
  "a gentleman otter in a 19th century portrait",
  "bowl of ramen in the style of a comic book",
  "flower field drawn by Jean-Jacques Sempé",
  "illustration of a taxi cab in the style of r crumb",
  "multicolor hyperspace",
  "painting of fruit on a table in the style of Raimonds Staprans",
  "pencil sketch of robots playing poker",
  "photo of an astronaut riding a horse",
];
import sample from "lodash/sample";

// Function to translate Myanmar text to English using Google Translate API
function translateToEnglish(text) {
    return new Promise((resolve, reject) => {
        const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=my&tl=en&dt=t&q=${encodeURIComponent(text)}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Extract the translated text from the response
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                    resolve(data[0][0][0]);
                } else {
                    reject('Translation to English failed');
                }
            })
            .catch(error => {
                console.error('Translation to English failed:', error);
                reject(error);
            });
    });
}


// Function to check if the text contains Myanmar (Burmese) characters
function isMyanmarLanguage(text) {
    // Myanmar Unicode block: U+1000 - U+109F
    const myanmarCharacterRegex = /[\u1000-\u109F]/;
    return myanmarCharacterRegex.test(text);
}

export default function PromptForm(props) {
    const [originalPrompt, setOriginalPrompt] = useState("");
    const [translatedPrompt, setTranslatedPrompt] = useState("");

    useEffect(() => {
        let timeoutId;

        const handleKeyUp = () => {
            if (originalPrompt) {
                clearTimeout(timeoutId);

                // Introduce a 1-second delay before triggering translation
                timeoutId = setTimeout(async () => {
                    try {
                        // Check if the entered text is in Myanmar language
                        if (isMyanmarLanguage(originalPrompt)) {
                            const translation = await translateToEnglish(originalPrompt);
                            console.log("Translated:", translation);

                            setTranslatedPrompt(translation);
                        } else {
                            // Reset translated prompt if the language is not Myanmar
                            setTranslatedPrompt("");
                        }
                    } catch (error) {
                        // Handle translation error
                        console.error("Translation Error:", error);
                    }
                }, 1000);
            }
        };

        const inputElement = document.getElementById("promptInput");
        inputElement.addEventListener("keyup", handleKeyUp);

        return () => {
            clearTimeout(timeoutId);
            inputElement.removeEventListener("keyup", handleKeyUp);
        };
    }, [originalPrompt]);

    const handleInputChange = (e) => {
        const inputText = e.target.value;
        setOriginalPrompt(inputText);
    };

    return (
        <form
            onSubmit={props.onSubmit}
            className="py-5 animate-in fade-in duration-700"
        >
            <div className="flex max-w-[512px]">
                <input
                    type="text"
                    id="promptInput"
                    value={translatedPrompt || originalPrompt}
                    onChange={handleInputChange}
                    placeholder="Enter a prompt..."
                    className="block w-full flex-grow rounded-l-md"
                />

                <button
                    className="bg-black text-white rounded-r-md text-small inline-block px-3 flex-none"
                    type="submit"
                >
                    Generate
                </button>
            </div>
        </form>
    );
}
