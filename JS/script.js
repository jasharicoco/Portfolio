document.addEventListener("DOMContentLoaded", async function () {
    // Hämta alla navigeringslänkar
    const links = document.querySelectorAll(".nav a");
    const currentPage = window.location.pathname.split("/").pop();

    // Markera den aktiva sidan
    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    // Förhindra högerklick på bilder
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
    });

    // Ladda CV-data om vi är på cv.html
    if (currentPage === "cv.html") {
        loadCVData();
    }

    // Ladda GitHub-projekt
    await loadGitHubProjects();
});

function toggleMenu() {
    document.querySelector('.nav').classList.toggle('open');
}

// Ladda CV-data från JSON-fil
async function loadCVData() {
    try {
        const response = await fetch('../DATA/cv-data.json');
        const data = await response.json();

        const workSection = document.querySelector('.cv-section.work-experience .cv-table');
        const educationSection = document.querySelector('.cv-section.education .cv-table');

        workSection.innerHTML = "";
        educationSection.innerHTML = "";

        data.work_experience.forEach(work => {
            workSection.innerHTML += `
                <div class="cv-row">
                    <div class="cv-left">
                        <h4>${work.position}</h4>
                        <p><strong>${work.company}</strong>, ${work.location}</p>
                        <span class="date">${work.duration}</span>
                    </div>
                    <div class="cv-right">
                        <p>${work.description}</p>
                    </div>
                </div>
            `;
        });

        data.education.forEach(education => {
            educationSection.innerHTML += `
                <div class="cv-row">
                    <div class="cv-left">
                        <h4>${education.degree}</h4>
                        <p><strong>${education.institution}</strong>, ${education.location}</p>
                        <span class="date">${education.duration}</span>
                    </div>
                    <div class="cv-right">
                        <p>${education.description}</p>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Fel vid inläsning av CV-data:', error);
    }
}

// Ladda GitHub-projekt från GitHub API
async function loadGitHubProjects() {
    const projectContainer = document.querySelector(".project-list");
    projectContainer.innerHTML = "<p>Laddar projekt...</p>";

    try {
        const response = await fetch("https://api.github.com/users/jasharicoco/repos");
        const repos = await response.json();
        projectContainer.innerHTML = "";

        repos.forEach(repo => {
            projectContainer.innerHTML += `
                <article class="project-container">
                    <h3>${repo.name}</h3>
                    <div class="project-content">
                    <p>${repo.description || "Ingen beskrivning tillgänglig."}</p>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="btn">Mer info</a>
                </article>
            `;
        });
    } catch (error) {
        projectContainer.innerHTML = "<p>Kunde inte ladda projekt. Försök igen senare.</p>";
        console.error("Fel vid hämtning av GitHub-projekt:", error);
    }
}

// EASTER EGGS

// Konfetti-effekt vid inmatning av Konami-koden
// Konami-koden i tangentkodformat
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let inputSequence = [];

// Lyssna på tangenttryckningar
document.addEventListener("keydown", (event) => {
    inputSequence.push(event.keyCode);

    // Håll bara den senaste sekvensen i minnet
    if (inputSequence.length > konamiCode.length) {
        inputSequence.shift();
    }

    // Kolla om användaren skrev in hela Konami-koden
    if (JSON.stringify(inputSequence) === JSON.stringify(konamiCode)) {
        triggerConfetti();
        inputSequence = []; // Nollställ sekvensen efter aktivering
    }
});

// Funktion för att trigga konfetti 🎉
function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 } // Starta lite högre upp på skärmen
    });
}