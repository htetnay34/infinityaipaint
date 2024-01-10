import { useState, useEffect } from "react";
import sample from "lodash/sample";
import axios from "axios";

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

async function translateToEnglish(text) {
  try {
    const apiUrl = `https://libretranslate.de/translate`;

    const response = await axios.post(apiUrl, {
      q: text,
      source: 'my',
      target: 'en',
    });

    if (response.data && response.data.translatedText) {
      return response.data.translatedText;
    } else {
      console.error('Translation response:', response.data);
      throw new Error('Translation to English failed');
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

export default function PromptForm(props) {
  const [inputText, setInputText] = useState('');
  const [translatedPrompt, setTranslatedPrompt] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const translation = await translateToEnglish(inputText);
        setTranslatedPrompt(translation);
      } catch (error) {
        setTranslatedPrompt('');
        // Handle translation error if needed
        console.error('Translation error:', error);
      }
    };

    fetchTranslation();
  }, [inputText]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Use translatedPrompt for further processing or submission
    props.onSubmit(translatedPrompt);
  };

  return (
    <form onSubmit={handleSubmit} className="py-5 animate-in fade-in duration-700">
      <div className="flex max-w-[512px]">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          name="prompt"
          placeholder="Enter a prompt in Myanmar..."
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
