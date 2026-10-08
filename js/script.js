document.addEventListener("DOMContentLoaded", displayNotes);

function getNotes() {
    return JSON.parse(localStorage.getItem("sticky_notes")) || [
        {
            id: 1,
            title: "Welcome Note",
            content: "This is your first sticky note deployed on GitHub Pages!",
            date: new Date().toLocaleDateString()
        }
    ];
}

function displayNotes() {
    const notes = getNotes();
    const container = document.getElementById("notesContainer");
    if (!container) return;
    
    container.innerHTML = "";

    if (notes.length === 0) {
        container.innerHTML = '<p class="text-center text-muted col-12">No sticky notes yet. Click "New Note" to create one!</p>';
        return;
    }

    notes.forEach(note => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        
        col.innerHTML = `
            <div class="card sticky-note h-100">
                <div class="card-body">
                    <h5 class="card-title">${note.title}</h5>
                    <p class="card-text">${note.content}</p>
                    <p class="text-muted small">${note.date}</p>
                    <button class="btn btn-sm btn-secondary me-1" onclick="editNote('${note.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteNote('${note.id'})">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function saveNote() {
    const id = document.getElementById("noteId").value;
    const title = document.getElementById("noteTitleInput").value.trim();
    const content = document.getElementById("noteContentInput").value.trim();

    if (!title || !content) {
        alert("Please fill in both the title and content.");
        return;
    }

    let notes = getNotes();

    if (id) {
        notes = notes.map(n => n.id == id ? { ...n, title, content } : n);
    } else {
        const newNote = {
            id: Date.now(),
            title: title,
            content: content,
            date: new Date().toLocaleDateString()
        };
        notes.unshift(newNote);
    }

    localStorage.setItem("sticky_notes", JSON.stringify(notes));
    displayNotes();

    const modalElement = document.getElementById("noteModal");
    if (modalElement && window.bootstrap) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();
    }
}

function editNote(id) {
    const notes = getNotes();
    const note = notes.find(n => String(n.id) === String(id));
    if (!note) return;

    document.getElementById("noteId").value = note.id;
    document.getElementById("noteTitleInput").value = note.title;
    document.getElementById("noteContentInput").value = note.content;
    document.getElementById("modalTitle").innerText = "Edit Note";

    const modalElement = document.getElementById("noteModal");
    if (modalElement && window.bootstrap) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    } else {
        alert("Bootstrap library failed to load. Please refresh the page.");
    }
}

function deleteNote(id) {
    if (confirm("Are you sure you want to delete this note?")) {
        let notes = getNotes();
        notes = notes.filter(n => String(n.id) !== String(id));
        localStorage.setItem("sticky_notes", JSON.stringify(notes));
        displayNotes();
    }
}

function clearForm() {
    document.getElementById("noteId").value = "";
    document.getElementById("noteTitleInput").value = "";
    document.getElementById("noteContentInput").value = "";
    document.getElementById("modalTitle").innerText = "New Note";
}
