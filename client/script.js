import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;


function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';
    // Reset once it exceeds 3 dots
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300); // repeat every 300 ms.
}


function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20); // Output like ChatGPT is typing out the response, outputting a character every 20 ms.
}


function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}


function chatStripe(isAi, value, uniqueId) {
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div className="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
            <div class="message" id=${uniqueId}>${value}</div>
          </div>
        </div>
      </div>
    `
  );
}


const handleSubmit = async(e) => {
  // Default browser behavior when a form is submitted is to reload the browser, disable this reload
  e.preventDefault();

  const data = new FormData(form);

  // Generate user's chat stripe based on input user submitted
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  // Clear the user input
  form.reset();

  // Create the bot's stripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // As the user types, we want to keep scrolling down to see the message; put the new message in view
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Get the message div tag and turn on the loader to display the three loading dots
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  // See index.html for the value, it uses localhost on workstation, and detects the process env variable on the remote environment
  const backend_url = __BACKEND_URL__ || process.env.BACKEND_URL;
  console.log("backend_url: ", backend_url);
  
  // Fetch the data from the server
  const response = await fetch(backend_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  });

  // No longer loading
  clearInterval(loadInterval);

  // Clear the dots (if any)
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong!";
  }
}


// Register the event handler for the submit event by clicking the button
form.addEventListener('submit', handleSubmit);

// Register the event handler for the submit event from hitting the Enter key instead of using the mouse
form.addEventListener('keyup', (e) => {
  if (e.key === "Enter") {
    handleSubmit(e);
  }
});