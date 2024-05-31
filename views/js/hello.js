import { showAlert } from "./alert.js";

let obj;
if (document.cookie) {
    obj = JSON.parse(document.cookie.substring(6));
} else {
    obj = {};
}

// Get the recipeId from the URL query parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const recipeId = urlParams.get('id');

// Function to get user details
const getUserDetails = async (userId) => {
    try {
        const res = await axios.get(`http://localhost:4001/api/v1/users/${userId}`);
        return res.data.data;
    } catch (err) {
        showAlert('error','Error fetching user detailsr.');
    }
};

// Function to fetch recipe details and display them
const getDetailRecipes = async (recipeId) => {
    try {
        const res = await axios.get(`http://localhost:4001/api/v1/recipes/${recipeId}`);
        const recipe = res.data.data;
        
        document.getElementById('recipeName').textContent = recipe.recipeName;
        document.getElementById('recipeImage').src = recipe.image;
        document.getElementById('recipeIngredients').innerHTML = `<h2>Ingredients</h2><p>${recipe.ingredients.join(', ')}</p>`;
        document.getElementById('recipeDirections').innerHTML = `<h2>Directions</h2><p>${recipe.directions}</p>`;

        fetchComments(recipe.comments);
        fetchAverageRating(recipeId);
    } catch (err) {
        showAlert('error','Error fetching recipe details. Please try again later.');
    }
};

// Function to fetch and display average rating
const fetchAverageRating = async (recipeId) => {
    try {
        const res = await axios.get(`http://localhost:4001/api/v1/recipes/${recipeId}/averageRating`);
        const averageRating = res.data.data.averageRating;
        document.getElementById('averageRating').textContent = `Average Rating: ${averageRating.toFixed(1)}`;
    } catch (err) {
        showAlert('error','Error fetching average rating. Please try again later.');
    }
};

// Function to handle rating submission
const submitRating = async (rating) => {
    try {
        const userId = obj._id;
        const res = await axios.post('http://localhost:4001/api/v1/recipes/rate', {
            recipeId,
            rating,
            userId
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Rated successfully');
            fetchAverageRating(recipeId);
        }
    } catch (err) {
        showAlert('error', 'Failed to submit rating');
    }
};

// Event listener for rating submission
document.querySelectorAll('.smiley').forEach(smiley => {
    smiley.addEventListener('click', (e) => {
        const rating = e.target.getAttribute('data-rating');
        submitRating(rating);
    });
});

// Fetch recipe details on page load
getDetailRecipes(recipeId);

// Function to fetch and display comments
const fetchComments = async (comments) => {
    const timelineWrapper = document.querySelector('.timeline-item-wrapper');
    timelineWrapper.innerHTML = '';
    
    for (const comment of comments) {
        const userDetails = await getUserDetails(comment.userId); // Fetch user details
    
        // Create a new div element for the comment
        const commentCard = document.createElement('div');
        commentCard.classList.add('timeline-item-description');

        const commentCard1 = document.createElement('div');
        commentCard1.classList.add('comment');
    
        // Create HTML structure for the comment
        commentCard.innerHTML = `
            <i class="avatar | small">
                <img src="${userDetails.photo}" />
            </i>
            <span>${userDetails.name}</span>
        `;
        commentCard1.innerHTML = `<p>${comment.comments}</p>`
    
        // Append the comment card to the timeline wrapper
        timelineWrapper.appendChild(commentCard);
        timelineWrapper.appendChild(commentCard1);
    }
};
