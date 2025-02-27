document.addEventListener("DOMContentLoaded", function () {
    // Hämta alla navigeringslänkar
    const links = document.querySelectorAll(".nav a");

    // Hämta nuvarande filnamn utan domän
    const currentPage = window.location.pathname.split("/").pop();

    // Loopa igenom länkar och markera den aktiva sidan
    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active"); // Lägg till aktiv klass
        }
    });

    // Förhindra högerklick på bilder
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    });

    // Ladda CV-data om vi är på cv.html
    if (currentPage === "cv.html") {
        loadCVData();
    }
});

// Funktion för att öppna/stänga menyn
function toggleMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('open');
}

// Funktion för att hämta CV-data och generera innehållet
async function loadCVData() {
    try {
        const response = await fetch('../DATA/cv-data.json'); // Se till att sökvägen är korrekt
        const data = await response.json();

        // Hitta sektionerna
        const workSection = document.querySelector('.cv-section.work-experience .cv-table');
        const educationSection = document.querySelector('.cv-section.education .cv-table');

        // Rensa befintligt innehåll innan ny data läggs till
        workSection.innerHTML = "";
        educationSection.innerHTML = "";

        // Fyll i arbetslivserfarenhet
        data.work_experience.forEach(work => {
            const workRow = document.createElement('div');
            workRow.classList.add('cv-row');
            workRow.innerHTML = `
                <div class="cv-left">
                    <h4>${work.position}</h4>
                    <p><strong>${work.company}</strong>, ${work.location}</p>
                    <span class="date">${work.duration}</span>
                </div>
                <div class="cv-right">
                    <p>${work.description}</p>
                </div>
            `;
            workSection.appendChild(workRow);
        });

        // Fyll i utbildning
        data.education.forEach(education => {
            const educationRow = document.createElement('div');
            educationRow.classList.add('cv-row');
            educationRow.innerHTML = `
                <div class="cv-left">
                    <h4>${education.degree}</h4>
                    <p><strong>${education.institution}</strong></p>
                    <span class="date">${education.duration}</span>
                </div>
                <div class="cv-right">
                    <p>${education.description}</p>
                </div>
            `;
            educationSection.appendChild(educationRow);
        });

    } catch (error) {
        console.error('Fel vid inläsning av CV-data:', error);
    }
}
