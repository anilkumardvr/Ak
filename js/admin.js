// AK Photography — Upload/admin logic
// Queue holds files staged for publish; each gets title/category/caption
// before being merged into localStorage via akAddPhotos().

let queue = []; // { id, file, src(base64), title, category, caption }

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const queueList = document.getElementById("queueList");
const batchActions = document.getElementById("batchActions");
const statusMsg = document.getElementById("statusMsg");
const publishedList = document.getElementById("publishedList");

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleFiles(fileList) {
  const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
  for (const file of files) {
    try {
      const src = await fileToBase64(file);
      queue.push({
        id: "up-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
        src,
        title: file.name.replace(/\.[^.]+$/, ""),
        category: "Uncategorized",
        caption: "",
      });
    } catch (e) {
      console.error("Could not read file:", file.name, e);
      setStatus("Couldn't read " + file.name + " — try a different file.", true);
    }
  }
  renderQueue();
}

function renderQueue() {
  if (queue.length === 0) {
    queueList.innerHTML = "";
    batchActions.style.display = "none";
    return;
  }
  batchActions.style.display = "flex";
  queueList.innerHTML = queue.map((item) => `
    <div class="queue-item" data-id="${item.id}">
      <img src="${item.src}" alt="">
      <div>
        <input type="text" class="qi-title" value="${item.title}" placeholder="Title" style="font-family:var(--mono); font-size:12px; border:none; border-bottom:1px solid var(--line); background:transparent; width:100%; margin-bottom:6px; padding:4px 0;">
        <select class="qi-cat-select" style="font-family:var(--mono); font-size:11px; border:1px solid var(--line); background:transparent; padding:4px;">
          ${["Street", "Portrait", "Landscape", "Urban", "Editorial", "Uncategorized"].map(c => `<option ${c === item.category ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </div>
      <button class="qi-remove" data-remove="${item.id}">Remove</button>
    </div>
  `).join("");
}

function renderPublished() {
  const published = akGetUploadedOnly();
  if (published.length === 0) {
    publishedList.innerHTML = `<p style="color:var(--grey); font-family:var(--mono); font-size:12px;">No uploads published from this device yet.</p>`;
    return;
  }
  publishedList.innerHTML = published.map((p) => `
    <div class="queue-item" data-pub="${p.id}">
      <img src="${p.src}" alt="">
      <div>
        <div class="qi-name">${p.title}</div>
        <div class="qi-cat">${p.category}</div>
      </div>
      <button class="qi-remove" data-unpublish="${p.id}">Delete</button>
    </div>
  `).join("");
}

function setStatus(msg, isError = false) {
  statusMsg.textContent = msg;
  statusMsg.style.color = isError ? "#9c3b2e" : "var(--brass)";
}

// Drag & drop
["dragenter", "dragover"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("drag");
  })
);
["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag");
  })
);
dropzone.addEventListener("drop", (e) => handleFiles(e.dataTransfer.files));
fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

// Queue field edits
queueList.addEventListener("input", (e) => {
  const row = e.target.closest("[data-id]");
  if (!row) return;
  const item = queue.find((q) => q.id === row.dataset.id);
  if (!item) return;
  if (e.target.classList.contains("qi-title")) item.title = e.target.value;
});

queueList.addEventListener("change", (e) => {
  const row = e.target.closest("[data-id]");
  if (!row) return;
  const item = queue.find((q) => q.id === row.dataset.id);
  if (!item) return;
  if (e.target.classList.contains("qi-cat-select")) item.category = e.target.value;
});

queueList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;
  queue = queue.filter((q) => q.id !== btn.dataset.remove);
  renderQueue();
});

document.getElementById("clearQueueBtn").addEventListener("click", () => {
  queue = [];
  renderQueue();
  setStatus("Queue cleared.");
});

document.getElementById("publishBtn").addEventListener("click", () => {
  if (queue.length === 0) return;
  const toPublish = queue.map((q) => ({
    id: q.id,
    src: q.src,
    title: q.title || "Untitled",
    category: q.category || "Uncategorized",
    caption: q.caption || "",
    date: new Date().toISOString().slice(0, 10),
  }));
  const ok = akAddPhotos(toPublish);
  if (ok) {
    setStatus(`Published ${toPublish.length} photo(s) to the archive on this device.`);
    queue = [];
    renderQueue();
    renderPublished();
  } else {
    setStatus("Couldn't save — your browser storage may be full or disabled.", true);
  }
});

publishedList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-unpublish]");
  if (!btn) return;
  if (!confirm("Remove this photo from the published archive?")) return;
  akDeletePhoto(btn.dataset.unpublish);
  renderPublished();
  setStatus("Photo removed.");
});

renderPublished();
