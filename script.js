// List of Apex Legends characters
const legends = [
    'Ash', 'Ballistic', 'Bangalore', 'Bloodhound', 'Catalyst', 'Caustic',
    'Conduit', 'Crypto', 'Fuse', 'Gibraltar', 'Horizon', 'Lifeline',
    'Loba', 'Mad Maggie', 'Mirage', 'Newcastle', 'Octane', 'Pathfinder',
    'Rampart', 'Revenant', 'Seer', 'Valkyrie', 'Vantage', 'Wattson', 'Wraith'
];

// Squad member names
const squadMembers = ['NOAHHH', 'NINO', 'CRASHY'];

// Store DOM elements
let slotReels;
let leverContainer;
let isSpinning = false;

// Function to get character image URL
function getCharacterImageUrl(character) {
    const formattedName = character.toLowerCase();
    return `images/${formattedName}.webp`;
}

// Function to create a reel item
function createReelItem(character) {
    const item = document.createElement('div');
    item.className = 'reel-item';
    
    const img = document.createElement('img');
    img.src = getCharacterImageUrl(character);
    img.alt = character;
    
    item.appendChild(img);
    return item;
}

// Function to populate reel
function populateReel(reel, characters) {
    const container = reel.querySelector('.reel-container');
    container.innerHTML = '';
    
    // Add extra items for smooth scrolling
    const totalItems = characters.length;
    const extraItems = 10; // Increased for smoother spinning
    
    // Add items before
    for (let i = 0; i < extraItems; i++) {
        container.appendChild(createReelItem(characters[(totalItems - extraItems + i) % totalItems]));
    }
    
    // Add main items
    characters.forEach(character => {
        container.appendChild(createReelItem(character));
    });
    
    // Add items after
    for (let i = 0; i < extraItems; i++) {
        container.appendChild(createReelItem(characters[i % totalItems]));
    }
}

// Function to calculate final position for center alignment
function calculateFinalPosition(itemHeight, finalIndex, extraItems) {
    return -(itemHeight * (extraItems + finalIndex));
}

// Function to spin a single reel
function spinReel(reel, finalCharacter, duration) {
    return new Promise(resolve => {
        const container = reel.querySelector('.reel-container');
        const itemHeight = 150; // Height of each reel item
        const extraItems = 10;
        
        // Calculate spins
        const spins = 2 + Math.random(); // 2-3 full spins
        const totalTravel = (container.children.length * itemHeight) * spins;
        
        // Calculate final position
        const finalPosition = calculateFinalPosition(itemHeight, finalCharacter.index, extraItems);
        
        // Start spinning
        container.style.transition = 'none';
        container.style.transform = 'translateY(0)';
        container.offsetHeight; // Force reflow
        
        // Add spinning transition
        container.style.transition = `transform ${duration}ms cubic-bezier(0.1, 0.5, 0.5, 1)`;
        container.style.transform = `translateY(${finalPosition}px)`;
        
        // Update the result box after spinning
        setTimeout(() => {
            const resultBox = reel.parentElement.querySelector('.result-box');
            resultBox.textContent = finalCharacter.name;
            resolve();
        }, duration);
    });
}

// Function to simulate slot machine spinning
function spinSlotMachine() {
    if (isSpinning) return;
    isSpinning = true;

    // Pull the lever
    leverContainer.classList.add('pulled');

    // Keep track of selected final characters
    const usedFinalCharacters = new Set();

    // Generate random characters for each reel
    const reelCharacters = Array.from(slotReels).map(() => {
        // Get 10 random characters for the reel
        const characters = getRandomCharacters(10);
        
        // Find a final character that hasn't been used
        let finalIndex;
        do {
            finalIndex = Math.floor(Math.random() * characters.length);
        } while (usedFinalCharacters.has(characters[finalIndex]));

        // Add the final character to used set
        usedFinalCharacters.add(characters[finalIndex]);

        return {
            characters,
            final: {
                name: characters[finalIndex],
                index: finalIndex
            }
        };
    });

    // Populate all reels
    slotReels.forEach((reel, index) => {
        populateReel(reel, reelCharacters[index].characters);
    });

    // Start all reels spinning simultaneously with different durations
    slotReels.forEach((reel, index) => {
        const duration = (index + 1) * 1000; // 1s, 2s, 3s
        spinReel(reel, reelCharacters[index].final, duration);
    });

    // Reset lever after all reels stop
    setTimeout(() => {
        leverContainer.classList.remove('pulled');
        isSpinning = false;
    }, 3500); // Wait for the longest reel (3s) plus some buffer
}

// Function to get random characters
function getRandomCharacters(count) {
    const shuffled = [...legends].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize reels
function initializeReels() {
    slotReels = document.querySelectorAll('.slot-reel');
    leverContainer = document.querySelector('.slot-lever-container');
    
    // Randomize squad member names
    const shuffledNames = shuffleArray([...squadMembers]);
    const playerNameElements = document.querySelectorAll('.player-name');
    
    playerNameElements.forEach((element, index) => {
        element.textContent = shuffledNames[index];
    });
    
    // Initialize reels
    slotReels.forEach(reel => {
        const characters = getRandomCharacters(10);
        populateReel(reel, characters);
        
        const resultBox = reel.parentElement.querySelector('.result-box');
        resultBox.textContent = '???';
    });

    // Add click event listener
    if (leverContainer) {
        leverContainer.addEventListener('click', () => {
            if (!isSpinning) {
                spinSlotMachine();
            }
        });
    }
}

// Handle image loading errors
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'question-mark.png';
        e.target.classList.add('default-image');
    }
}, true);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeReels); 