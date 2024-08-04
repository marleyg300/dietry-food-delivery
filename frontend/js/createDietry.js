document.addEventListener('DOMContentLoaded', () => {
    const foodForm = document.getElementById('food-form');
    const dietriesList = document.querySelector('.dietries-list');

    const fetchDietries = async () => {
        try {
            const response = await fetch('/api/dietries/adminDietries');
            const dietries = await response.json();
            dietriesList.innerHTML = '';
            dietries.forEach(dietry => {
                const dietryDiv = document.createElement('div');
                dietryDiv.className = 'dietry-item';
                dietryDiv.innerHTML = `
                    <h3>${dietry.name}</h3>
                    <img src="${dietry.image}" alt="${dietry.name}">
                    <p>${dietry.description}</p>
                    <p>Price: $${dietry.price}</p>
                    <p>Dietary Restrictions: ${dietry.dietary_restrictions}</p>
                    <p>Type: ${dietry.type}</p>
                `;
                dietriesList.appendChild(dietryDiv);
            });
        } catch (error) {
            console.error('Error fetching dietries:', error);
        }
    };

    foodForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(foodForm);

        try {
            const response = await fetch('/api/dietries/create', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                fetchDietries();
                foodForm.reset();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error adding dietry:', error);
        }
    });

    fetchDietries();
});
