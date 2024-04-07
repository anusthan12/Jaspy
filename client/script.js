// Importing images for bot and user avatars
import bot from './assets/bot.svg'
import user from './assets/user.svg'

// Selecting form and chat container elements
const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

// Declaring variables for loader and load interval
let loadInterval

// Function to display loader animation
function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

// Function to generate a unique ID for chat messages
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

// Function to generate HTML markup for chat messages
function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

// Event handler for form submission
const handleSubmit = async (e) => {
    console.log("Submit button clicked");
    e.preventDefault()

    // Getting user input from form
    const data = new FormData(form)

    // Creating JSON data object with user prompt
    const jsonData = {
        prompt: data.get('prompt')
    }

    // Fetching conversation history from Communications.json
    let communicationsData = [];
    try {
        const response = await fetch('Communications.json');
        if (response.ok) {
            communicationsData = await response.json();
        }
    } catch (error) {
        console.error('Error fetching Communications.json:', error);
    }

    // Adding user's prompt to conversation history
    communicationsData.push({ userPrompt: jsonData.prompt });

    // Displaying user's prompt
    chatContainer.innerHTML += chatStripe(false, jsonData.prompt);

    // Finding the last bot reply from conversation history
    const lastBotReply = communicationsData
        .filter(entry => entry.botReply) // Filter out entries without bot replies
        .slice(-1) // Get the last entry
        .map(entry => entry.botReply)[0]; // Extract the bot's reply

    // Displaying the last bot reply (if available)
    if (lastBotReply) {
        chatContainer.innerHTML += chatStripe(true, lastBotReply);
    }

    // Resetting the form
    form.reset();

    // Scrolling to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Adding event listener for form submission
form.addEventListener('submit', handleSubmit)
