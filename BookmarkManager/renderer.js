const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../MarkdownToSqlite/urls.db');

const bookmarkGrid = document.getElementById('bookmarkGrid');

function loadBookmarks() {
    db.all('SELECT * FROM url LIMIT 10', (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }

        rows.forEach(bookmark => {
            const bookmarkElement = document.createElement('div');
            bookmarkElement.classList.add('bookmark');

            // Convert WebP image data to data URL
            const blob = new Blob([bookmark.image], { type: 'image/webp' });
            const reader = new FileReader();
            reader.onloadend = function () {
                const dataUrl = reader.result;
                bookmarkElement.innerHTML = `
          <img src="${dataUrl}" alt="${bookmark.title}">
          <input type="text" value="${bookmark.url}" data-id="${bookmark.id}" readonly>
          <input type="text" value="${bookmark.domain}" data-id="${bookmark.id}">
          <input type="text" value="${bookmark.title}" data-id="${bookmark.id}">
          <button class="deleteButton" data-id="${bookmark.id}">Delete</button>
        `;
                bookmarkGrid.appendChild(bookmarkElement);
            };
            reader.readAsDataURL(blob);
        });
    });
}

function updateBookmark(id, field, value) {
    db.run(`UPDATE url SET ${field} = ? WHERE id = ?`, [value, id], (err) => {
        if (err) {
            console.error(err);
        }
    });
}

function deleteBookmark(id) {
    db.run('DELETE FROM url WHERE id = ?', [id], (err) => {
        if (err) {
            console.error(err);
        }
    });
}

bookmarkGrid.addEventListener('input', (event) => {
    if (event.target.tagName === 'INPUT' && !event.target.hasAttribute('readonly')) {
        const id = event.target.dataset.id;
        const field = event.target.previousElementSibling.value;
        const value = event.target.value;
        updateBookmark(id, field, value);
    }
});

bookmarkGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('deleteButton')) {
        const id = event.target.dataset.id;
        deleteBookmark(id);
        event.target.parentElement.remove();
    }
});

loadBookmarks();