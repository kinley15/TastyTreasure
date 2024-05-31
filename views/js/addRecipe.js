import { showAlert } from "./alert.js";

var obj;
if (document.cookie) {
    obj = JSON.parse(document.cookie.substring(6));
} else {
    obj = JSON.parse('{}');
}

var el = document.querySelector('.nav.nav--user');
if (obj._id) {
    el.innerHTML =
        '<a href="/" class="nav__el">Home</a>' +
        '<a href="addrecipe" class="nav__el">Add Recipes</a>' +
        '<a href="/me" class="nav__el">' +
        '<img src="' + obj.photo + '" alt="Photo of ' + obj.name + '" class="nav__user-img" />' +
        '<span>' + obj.name + '</span></a>';
} else {
    el.innerHTML =
        '<a class="nav__el nav__el--cta" href="/login">Log in</a>' +
        '<a class="nav__el nav__el--cta" href="/signup">Sign up</a>';
}

const addrecipe = async (userId, publishedBy,recipeName, dishType, difficulty, image, ingredients, directions, rating, voteCount) => {
    try {
        const formData = new FormData();
        formData.append('publishedBy', publishedBy);
        formData.append('recipeName', recipeName);
        formData.append('dishType', dishType);
        formData.append('difficulty', difficulty);
        formData.append('image', image);
        formData.append('ingredients', ingredients);
        formData.append('directions', directions);
        formData.append('rating', rating);
        formData.append('voteCount', voteCount);
        formData.append('userId',userId);

        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4001/api/v1/recipes/post',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Recipe added successfully');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    } catch (err) {
        showAlert('error', 'Failed to add recipe');
    }
};

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = obj._id;
    const publishedBy= obj.name;
    const recipeName = document.getElementById('recipeName').value;
    const dishType = document.getElementById('dishType').value;
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const image = document.getElementById('image').files[0];
    const ingredients = document.getElementById('ingredients').value;
    const directions = document.getElementById('directions').value;
    
    const rating = 0; // Default value, can be updated based on requirements
    const voteCount = 0; // Default value, can be updated based on requirements
    addrecipe(userId, publishedBy,recipeName, dishType, difficulty, image, ingredients, directions, rating, voteCount);
});
