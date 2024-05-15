async function fetchSuggestions(query) {
    const response = await fetch(`/suggest?q=${encodeURIComponent(query)}`);
    const suggestions = await response.json();
    return suggestions;
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

async function onInputChange(event) {
    const query = event.target.value;
    const suggestionList = document.getElementById('suggestions');
    suggestionList.innerHTML = '';
    if (query.length > 0) {
        const suggestions = await fetchSuggestions(query);
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.addEventListener('click', () => {
                document.getElementById('keyword-input').value = suggestion;
                suggestionList.innerHTML = '';
            });
            suggestionList.appendChild(li);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('keyword-input');
    input.addEventListener('input', debounce(onInputChange, 300));
});
