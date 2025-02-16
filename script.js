// Baldwin Clock - Web Version
// This script fetches news, analyzes urgency, and updates the clock dynamically

const clockElement = document.getElementById("baldwinClock");
const newsElement = document.getElementById("newsUpdates");

// Set initial clock time at 01:05
let clockTime = new Date();
clockTime.setHours(1, 5, 0, 0);

// Urgency Levels for Time Advancement
const URGENCY_LEVELS = {
    "low": 0,       // No change
    "moderate": 1,  // +1 min per hour
    "high": 10,     // +10 min per hour
    "critical": 60  // +1 hour per hour
};

// Function to update the clock display
function updateClock() {
    clockElement.textContent = clockTime.toLocaleTimeString("en-US", { hour12: false });
}

// Function to fetch news and analyze urgency
async function fetchNews() {
    const API_URL = "https://newsapi.org/v2/top-headlines?country=us&apiKey=f4a2df548827422e9db14cb901566da7";
    
    try {
        let response = await fetch(API_URL);
        let data = await response.json();
        let headlines = data.articles.map(article => article.title).join(". ");
        
        let urgency = analyzeUrgency(headlines);
        adjustClock(urgency);
        
        newsElement.innerHTML = `<b>Latest News:</b> ${data.articles[0]?.title || "No news available"}`;
    } catch (error) {
        newsElement.innerHTML = "Error fetching news.";
        console.error("News Fetch Error:", error);
    }
}

// Function to analyze news urgency using basic sentiment detection
function analyzeUrgency(text) {
    const negativeWords = ["shooting", "murder", "racist", "attack", "police brutality", "violence"];
    
    let urgency = "low";
    let count = 0;
    
    negativeWords.forEach(word => {
        if (text.toLowerCase().includes(word)) count++;
    });

    if (count >= 5) urgency = "critical";
    else if (count >= 3) urgency = "high";
    else if (count >= 1) urgency = "moderate";

    return urgency;
}

// Function to adjust clock based on urgency
function adjustClock(urgency) {
    let minutesToAdd = URGENCY_LEVELS[urgency];
    clockTime.setMinutes(clockTime.getMinutes() + minutesToAdd);
}

// Auto-update the clock every second
setInterval(updateClock, 1000);

// Fetch news and adjust clock every hour
setInterval(fetchNews, 3600000); // 1 hour (3600000 ms)

// Initial News Fetch
fetchNews();
