class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();

        this.head = new Node("HEAD", null);
        this.tail = new Node("TAIL", null);

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    insertFront(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    get(key) {
        if (!this.map.has(key)) return -1;
        const node = this.map.get(key);
        this.remove(node);
        this.insertFront(node);
        return node.value;
    }

    put(key, value) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            node.value = value;
            this.remove(node);
            this.insertFront(node);
            return;
        }

        if (this.map.size === this.capacity) {
            const lru = this.tail.prev;
            animateRemove(lru.key);
            this.remove(lru);
            this.map.delete(lru.key);
        }

        const newNode = new Node(key, value);
        this.insertFront(newNode);
        this.map.set(key, newNode);
    }
}

let cache = null;
let lastTouched = null;

/* Set Capacity */
function setCapacity() {
    const cap = parseInt(document.getElementById("capacity").value);
    if (!cap || cap <= 0) {
        alert("Enter valid capacity");
        return;
    }
    cache = new LRUCache(cap);
    render();
}

/* Render DLL with arrows */
function render() {
    const container = document.getElementById("cache");
    container.innerHTML = "";

    if (!cache) return;

    let cur = cache.head.next;
    while (cur !== cache.tail) {
        const nodeDiv = document.createElement("div");
        nodeDiv.className = "node";
        nodeDiv.dataset.key = cur.key;
        nodeDiv.innerHTML = `<b>${cur.key}</b><br>${cur.value}`;

        if (cur.key === lastTouched) {
            nodeDiv.classList.add("move");
        }

        container.appendChild(nodeDiv);

        if (cur.next !== cache.tail) {
            const arrow = document.createElement("div");
            arrow.className = "arrow";
            arrow.innerHTML = "⇄";
            container.appendChild(arrow);
        }

        cur = cur.next;
    }

    if (container.firstChild) container.firstChild.classList.add("mru");
    if (container.lastChild && container.lastChild.classList.contains("node")) {
        container.lastChild.classList.add("lru");
    }

    lastTouched = null;
}

/* Animation for removal */
function animateRemove(key) {
    const node = document.querySelector(`[data-key='${key}']`);
    if (node) node.classList.add("remove");
}

/* PUT operation */
function put() {
    if (!cache) {
        alert("Set capacity first");
        return;
    }

    const k = document.getElementById("key").value;
    const v = document.getElementById("value").value;
    if (!k || !v) return;

    lastTouched = k;
    cache.put(k, v);
    setTimeout(render, 300);
}

/* GET operation */
function get() {
    if (!cache) {
        alert("Set capacity first");
        return;
    }

    const k = document.getElementById("getKey").value;
    const res = cache.get(k);

    alert(res === -1 ? "Key Not Found" : "Value = " + res);
    lastTouched = k;
    setTimeout(render, 200);
}
