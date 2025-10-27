document.addEventListener("DOMContentLoaded", () => {
    const footer = document.getElementById('footer');
    if (footer) {
        footer.classList.add("mt-auto", "w-full");
        footer.innerHTML = `
        <div class=" bg-gray-300 p-3 flex flex-col justify-end items-center">
          <p>&copy; 2025 Finance App. All rights reserved.</p>
        </div>`;
    }
});