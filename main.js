const baseUrl = "http://localhost:3600";

const getProducts = async (url, id = "") => {
    try {
        const res = await fetch(`${baseUrl}/${url}${id ? `/${id}` : ""}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);

    }
};

const tab_content = document.querySelector(".tab_content");
const tab_btn = document.querySelectorAll(".tab_btn");

const renderCategory = async (category) => {
    const data = await getProducts(category);
    tab_content.innerHTML = data.map((item) => `
    <div class="tab_cards">
        <img class="tab_imgs" src="${item.img}" alt="img"/>
        <h3 class="tab_card_title">${item.title}</h3>
        <p class="tab_price">${item.price}</p>
        <p class="tab_sale">${item.sale}</p>
        <button class="tab_buy_btn">BUY</button>
    </div>
    `).join("")
};

tab_btn.forEach((btn) => {
    btn.addEventListener("click", () => {
        const category = btn.dataset.tab;
        tab_btn.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderCategory(category);
    });
});

renderCategory("hot");
