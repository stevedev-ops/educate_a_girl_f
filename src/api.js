const API_URL = 'https://eduacate-a-girl-b.onrender.com/api';

export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};


const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Request failed');
    }
    const json = await response.json();
    return json.data || json; // Some endpoints return data, some just success message
};

// PRODUCTS
export const fetchProducts = async () => handleResponse(await fetch(`${API_URL}/products`));
export const fetchProductById = async (id) => handleResponse(await fetch(`${API_URL}/products/${id}`));
export const createProduct = async (product) => {
    return handleResponse(await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    }));
};
export const updateProduct = async (product) => {
    return handleResponse(await fetch(`${API_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    }));
};
export const deleteProduct = async (id) => {
    return handleResponse(await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' }));
};

// GALLERY
export const fetchGallery = async () => handleResponse(await fetch(`${API_URL}/gallery`));
export const addToGallery = async (item) => {
    return handleResponse(await fetch(`${API_URL}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    }));
};
export const deleteFromGallery = async (id) => {
    return handleResponse(await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' }));
};

// STORIES
export const fetchStories = async () => handleResponse(await fetch(`${API_URL}/stories`));
export const createStory = async (story) => {
    return handleResponse(await fetch(`${API_URL}/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story)
    }));
};
export const updateStory = async (story) => {
    return handleResponse(await fetch(`${API_URL}/stories/${story.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story)
    }));
};
export const deleteStory = async (id) => {
    return handleResponse(await fetch(`${API_URL}/stories/${id}`, { method: 'DELETE' }));
};

// TEAM
export const fetchTeam = async () => handleResponse(await fetch(`${API_URL}/team`));
export const updateTeamMember = async (member) => {
    return handleResponse(await fetch(`${API_URL}/team/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
    }));
};
export const createTeamMember = async (member) => {
    return handleResponse(await fetch(`${API_URL}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
    }));
};
export const deleteTeamMember = async (id) => {
    return handleResponse(await fetch(`${API_URL}/team/${id}`, { method: 'DELETE' }));
};

// JOURNEY
export const fetchJourney = async () => handleResponse(await fetch(`${API_URL}/journey`));
export const updateJourneyMilestone = async (milestone) => {
    return handleResponse(await fetch(`${API_URL}/journey/${milestone.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(milestone)
    }));
};
export const createJourney = async (milestone) => {
    return handleResponse(await fetch(`${API_URL}/journey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(milestone)
    }));
};
export const deleteJourney = async (id) => {
    return handleResponse(await fetch(`${API_URL}/journey/${id}`, { method: 'DELETE' }));
};

// SETTINGS (Home Products)
export const fetchHomeProductIds = async () => handleResponse(await fetch(`${API_URL}/settings/home_products`));
export const updateHomeProductIds = async (ids) => {
    return handleResponse(await fetch(`${API_URL}/settings/home_products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
    }));
};

// SETTINGS (Categories)
export const fetchCategories = async () => handleResponse(await fetch(`${API_URL}/settings/categories`));
export const updateCategories = async (categories) => {
    return handleResponse(await fetch(`${API_URL}/settings/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories })
    }));
};

// SETTINGS (Generic: Contact, Stats, Hero)
export const fetchSettings = async (key) => handleResponse(await fetch(`${API_URL}/settings/${key}`));
export const updateSettings = async (key, value) => {
    return handleResponse(await fetch(`${API_URL}/settings/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
    }));
};

// PROGRAMS
export const fetchPrograms = async () => handleResponse(await fetch(`${API_URL}/programs`));
export const createProgram = async (program) => {
    return handleResponse(await fetch(`${API_URL}/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(program)
    }));
};
export const updateProgram = async (program) => {
    return handleResponse(await fetch(`${API_URL}/programs/${program.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(program)
    }));
};
export const deleteProgram = async (id) => {
    return handleResponse(await fetch(`${API_URL}/programs/${id}`, { method: 'DELETE' }));
};

// MESSAGES (Contact)
export const sendMessage = async (msg) => {
    return handleResponse(await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
    }));
};
export const fetchMessages = async () => handleResponse(await fetch(`${API_URL}/messages`));
export const updateMessageRead = async (id, read) => {
    return handleResponse(await fetch(`${API_URL}/messages/${id}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read })
    }));
};
export const deleteMessage = async (id) => {
    return handleResponse(await fetch(`${API_URL}/messages/${id}`, { method: 'DELETE' }));
};

// REVIEWS
export const submitReview = async (reviewData) => {
    return handleResponse(await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
    }));
};
export const fetchProductReviews = async (productId) => handleResponse(await fetch(`${API_URL}/reviews/product/${productId}`));
export const fetchPendingReviews = async () => handleResponse(await fetch(`${API_URL}/reviews/pending`));
export const approveReview = async (id) => {
    return handleResponse(await fetch(`${API_URL}/reviews/${id}/approve`, {
        method: 'PUT'
    }));
};
export const deleteReview = async (id) => {
    return handleResponse(await fetch(`${API_URL}/reviews/${id}`, { method: 'DELETE' }));
};

// UPLOAD
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return handleResponse(await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
    }));
};

// CHECKOUT
export const checkout = async (items) => {
    return handleResponse(await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
    }));
};

export const createOrder = async (orderData) => {
    return handleResponse(await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    }));
};
