document.addEventListener("DOMContentLoaded", () => {
    const footer = document.getElementById('footer');
    if (footer) {
        footer.innerHTML = `
        <div class=" bg-gray-300 p-3 flex flex-col justify-end items-center">
          <p>&copy; 2023 Finance App. All rights reserved.</p>
        </div>`;
    }
});

export default footer;