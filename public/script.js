// عند إرسال الطعام
const giveFoodForm = document.getElementById("giveFoodForm");
if (giveFoodForm) {
    giveFoodForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const foodName = document.getElementById("foodName").value;
        const foodPhoto = document.getElementById("foodPhoto").value;

        await fetch("/add-food", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: foodName, photo: foodPhoto }),
        });

        alert("Food added successfully!");
        window.location.href = "index.html";
    });
}

// عرض الطعام
const foodList = document.getElementById("foodList");
if (foodList) {
    (async () => {
        const response = await fetch("/get-food");
        const foods = await response.json();
        foods.forEach((food) => {
            const div = document.createElement("div");
            div.innerHTML = `<h3>${food.name}</h3><img src="${food.photo}" alt="${food.name}" width="200">`;
            foodList.appendChild(div);
        });
    })();
}
// Check if dark mode is stored in localStorage
if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
} else {
    document.body.classList.remove('dark-theme');
}

// Toggle dark and light theme
const toggleButton = document.getElementById("toggleTheme");

toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    // Store the theme preference in localStorage
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// تحديد الموقع لرؤية الأطعمة
document.getElementById('locateMe')?.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch('/get-food')
                .then(res => res.json())
                .then(foods => {
                    const foodList = document.getElementById('foodList');
                    foodList.innerHTML = '';
                    foods.forEach(food => {
                        // حساب المسافة (مبدأي)
                        const foodDiv = document.createElement('div');
                        foodDiv.innerHTML = `
                            <h3>${food.name}</h3>
                            <p>الموقع: ${food.location}</p>
                            <p>رقم التواصل: <a href="tel:${food.contact}">${food.contact}</a></p>
                        `;
                        foodList.appendChild(foodDiv);
                    });
                });
        });
    } else {
        alert('المتصفح لا يدعم تحديد الموقع.');
    }
});
