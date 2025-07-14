const tabContent = document.querySelector(".tab_content");
const orderList = document.getElementById("orderList");
const subtotalEl = document.getElementById("subtotal");
const tabBtn = document.querySelector(".tab_btn");

let currentCategory = "hot";
let page = 1;

let orders = JSON.parse(localStorage.getItem("orders")) || [];
renderOrders();

fetchProducts(currentCategory);
setTimeout(() => {
  tabs.forEach((t) => {
    const tabText = t.textContent.toLowerCase().split(" ")[0];
    const categoryMap = {
      hot: "hot",
      cold: "cool",
      soup: "sushi",
      grill: "lunch",
      appetizer: "salats",
      dessert: "salats",
    };
    const mapped = categoryMap[tabText];
    if (mapped === currentCategory) {
      t.classList.add("active-tab");
    } else {
      t.classList.remove("active-tab");
    }
  });
}, 0);
const tabs = document.querySelectorAll(".hero__list a");
tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();

    tabs.forEach((t) => t.classList.remove("active-tab"));
    tab.classList.add("active-tab");
    const categoryName = tab.textContent.toLowerCase().split(" ")[0];
    const validCategories = {
      hot: "hot",
      cold: "cool",
      soup: "sushi",
      grill: "lunch",
      appetizer: "salats",
      dessert: "salats",
    };
    currentCategory = validCategories[categoryName] || "hot";
    page = 1;
    fetchProducts(currentCategory);
  });
});

function fetchProducts(category) {
  fetch(
    `https://admin-json-server.vercel.app/${category}?_page=${page}&_limit=8`
  )
    .then((res) => res.json())
    .then((data) => {
      tabContent.innerHTML = "";
      data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "tab_cards";
        card.innerHTML = `
          <img src="${item.img}" alt="" class="tab_imgs" />
          <h4 style="color:white;">${item.title}</h4>
          <p style="color:gray;">$${item.price}</p>
          <button class="add-btn" data-id="${item.id}" data-title="${item.title}" data-price="${item.price}" data-img="${item.img}">Qo'shish</button>
        `;
        tabContent.appendChild(card);
      });
      addToCartListeners();
    })
    .catch((err) => {
      tabContent.innerHTML = `<p style="color:red;">Xatolik: ${err.message}</p>`;
    });
}

tabBtn.addEventListener("click", () => {
  page++;
  fetch(
    `https://admin-json-server.vercel.app/${currentCategory}?_page=${page}&_limit=3`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        page = 1;
        return;
      }
      data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "tab_cards";
        card.innerHTML = `
          <img src="${item.img}" alt="" class="tab_imgs" />
          <h4 style="color:white;">${item.title}</h4>
          <p style="color:gray;">$${item.price}</p>
          <button class="add-btn" data-id="${item.id}" data-title="${item.title}" data-price="${item.price}" data-img="${item.img}">Qo'shish</button>
        `;
        tabContent.appendChild(card);
      });
      addToCartListeners();
    });
});

function addToCartListeners() {
  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const price = parseFloat(btn.dataset.price);
      const img = btn.dataset.img;

      const existing = orders.find((item) => item.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        orders.push({ id, title, price, qty: 1, img });
      }

      localStorage.setItem("orders", JSON.stringify(orders));
      renderOrders();
    });
  });
}

function renderOrders() {
  orderList.innerHTML = "";
  let total = 0;

  orders.forEach((item, index) => {
    total += item.price * item.qty;

    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = "10px";
    li.innerHTML = `
      <img src="${item.img}" alt="${item.title}" class="tab_imgs"/>
      <span style="flex: 1; color: white;">${item.title} x${item.qty}</span>
      <span style="color: gray;">$${(item.price * item.qty).toFixed(2)}</span>
      <button data-index="${index}" style="color:red;background:none;border:none;font-size:18px;">O'chirish</button>
    `;
    orderList.appendChild(li);
  });

  subtotalEl.textContent = total.toFixed(2);

  orderList.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.index);
      orders.splice(i, 1);
      localStorage.setItem("orders", JSON.stringify(orders));
      renderOrders();
    });
  });
}
