const items = {
  '1': {
    name: "SALAMI SALAD",
    price: 12.50,
  },
  '2': {
    name: "BALSAMIC BRUSCHETTA",
    price: 9.75,
  },
  '3': {
    name: "LASAGNA PUTTANESCA",
    price: 12.50,
  },
  '4': {
    name: "MEAT SAUCE PASTA",
    price: 11.40,
  },
  '5': {
    name: "CHERRY TOMATO PASTA",
    price: 10.25,
  },
  '6': {
    name: "GARLIC SHRMIP PASTA",
    price: 17.25,
  },
  '7': {
    name: "CREAM SAUCE PASTA",
    price: 16.20,
  },
  '8': {
    name: "MARGHERITA PIZZA",
    price: 20.15,
  },
  '9': {
    name: "EGGPLANT SALAD PIZZA",
    price: 18.15,
  },
}

$(function () {
  // components
  const form = $('#form-login');
  const email = $('#input-email');
  const password = $('#input-password');

  const modal = $('#login-modal');

  const loginButton = $('#btn-login');

  const navBar = $('.navbar-nav');

  const addToCartButton = $('.btn-add-cart');
  const orders = $('.order-table');
  const subTotal = $('#order-subtotal');
  const tax = $('#order-tax');
  const total = $('#order-total');
  const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

  // functions
  function doLogin(e) {
    e.preventDefault();

    const emailValue = email.val();
    const passwordValue = password.val();

    if (!emailValue || !passwordValue) {
      return alert('email or password is empty!');
    }

    const nextMinutes = new Date();
    nextMinutes.setMinutes(nextMinutes.getMinutes() + 10);

    // emailValue.split('@') => ['abc', 'email.com']
    document.cookie = `username=${emailValue.split('@')[0]}; expires=${nextMinutes.toUTCString()};`

    // close login modal
    $('body').removeClass('modal-open');
    modal.removeClass('show');
    $('.modal-backdrop').remove();

    showUsername();
  }

  // show username if it has in cookie
  function showUsername() {
    const cookies = decodeURIComponent(document.cookie).split(';');

    if (cookies.length < 1 || cookies[0] === "") {
      // if theres no cookie, do nothing
      return;
    }

    const username = cookies[0].split('=')[1];

    loginButton.hide();

    navBar.append(`
      <li class="nav-item">
        <a class="nav-link text-success" href="#">Welcome, ${username}</a>
      </li>
    `);
  }

  function addToCart(event) {
    // get item's id from clicked button
    const target = event.target;
    const id = target.dataset['menuId'];
    const item = items[id];

    // if we have same item in cart, just increase quantity
    // if not, add new item in the cart
    const cartItemIndex = cart.findIndex((cartItem) => cartItem.name === item.name);

    if (cartItemIndex > -1) {
      // if item exsists, increase quantity
      cart[cartItemIndex].quantity += 1;
    } else {
      // if item not exsists, add new item inside of cart
      cart.push({
        name: item.name,
        price: item.price,
        quantity: 1
      });
    }

    // render items in cart
    renderCartItems();

    // save cart items to localstorage
    saveItems();
  }

  function renderCartItems() {
    if (cart.length < 1) return;

    // remove all elements inside of orders table
    orders.empty();

    // same with .innerHTML = 
    orders.html(`<tr>
      <th scope="col">Item</th>
      <th scope="col">Quantity</th>
      <th scope="col">Subtotal</th>
    </tr>`);

    cart.forEach(cartItem => {
      orders.append(`
        <tr>
          <td>${cartItem.name}</td>
          <td>${cartItem.quantity}</td>
          <td>${cartItem.price * cartItem.quantity}</td>
        </tr>
        `)
    });

    // sum of item's subtotals
    const subtotalValue = cart.reduce((sum, currentItem) => {
      return sum + currentItem.price * currentItem.quantity
    }, 0)

    subTotal.text(`$${subtotalValue}`);

    const taxValue = new Intl.NumberFormat('en-In', { maximumFractionDigits: 2}).format(subtotalValue * 0.12);
    tax.text(`$${taxValue}`);

    const totalValue = new Intl.NumberFormat('en-In', { maximumFractionDigits: 2}).format(subtotalValue + parseFloat(taxValue));
    total.text(`$${totalValue}`)
  }

  function saveItems() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  renderCartItems();

  // event listeners
  form.on('submit', doLogin);
  showUsername();

  addToCartButton.on('click', addToCart);
})