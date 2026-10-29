document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("user-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});

function appendMessage(sender, message, isHTML = false) {
    const chatMessages = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message-content");

    if (isHTML) {
        contentDiv.innerHTML = message; // Proper HTML formatting ke liye
    } else {
        contentDiv.textContent = message;
    }

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    let symptoms = inputField.value.trim().toLowerCase().split(",");

    if (!symptoms.length || symptoms[0] === "") return;

    appendMessage("user", inputField.value);
    inputField.value = ""; // Input clear karein

    try {
        const response = await fetch("http://localhost:5000/get_suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms })
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        let botResponse = `
            <strong>🩺 Possible Disease:</strong> ${data.disease || "Not Found"}<br>
            <strong>💊 Suggested Medicine:</strong> ${data.medicine || "No Suggestion"}<br>
            <strong>✨ Health Tip:</strong> ${data.healthTip || "Stay Healthy!"}<br>
            <strong>👨‍⚕️ Consult:</strong> ${data.doctorType || "General Physician"}
        `;

        appendMessage("bot", botResponse, true);
    } catch (error) {
        console.error("Error:", error);
        appendMessage("bot", "❌ Error fetching health data. Please try again!");
    }
}
