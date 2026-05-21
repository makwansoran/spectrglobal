(function () {
  "use strict";

  var messages = document.getElementById("support-chat-messages");
  var form = document.getElementById("support-chat-form");
  var input = document.getElementById("support-chat-input");
  var promptButtons = document.querySelectorAll("[data-support-prompt]");

  if (!messages || !form || !input) return;

  var replies = [
    {
      test: /part|fit|fits|compatible|vin|vehicle|car|model|brake|tire|oil|engine/i,
      text: "Absolutely. Send me your car brand, model, year, engine, or VIN, plus the part you are looking for. I can narrow the match, explain fitment notes, and point you to the right catalog area."
    },
    {
      test: /order|tracking|delivery|shipping|shipped|receipt/i,
      text: "I can help with that. Share your order number or the email used at checkout. If you do not have it nearby, tell me what you ordered and I will guide you through the next best step."
    },
    {
      test: /checkout|payment|pay|stripe|klarna|visa|mastercard|paypal|card/i,
      text: "For checkout help, first confirm the cart total and payment method. If payment fails, try a fresh checkout session, verify billing details, and avoid refreshing during redirect. I can also help you recover your cart."
    },
    {
      test: /return|refund|exchange|cancel/i,
      text: "Returns are easiest when we have the order number, item condition, and reason for return. Tell me those details and I will prepare the support handoff with the right refund or exchange path."
    },
    {
      test: /human|person|agent|representative|specialist|customer support|support/i,
      text: "I can prepare a human handoff. Please send your name, email, order number if available, and a short description of what you need. A support specialist will have the context ready."
    },
    {
      test: /warranty|guarantee|defect|broken|damage|damaged/i,
      text: "For warranty or damage cases, send the order number, photos if available, and when the issue appeared. I will help structure the claim so support can act quickly."
    },
    {
      test: /price|discount|deal|offer|coupon|promo/i,
      text: "I can help check pricing questions. Tell me the product name or SKU and whether you are asking about a current offer, bulk order, or a checkout discount."
    }
  ];

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function timeLabel() {
    return new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(new Date());
  }

  function scrollToEnd() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(role, text) {
    var item = document.createElement("article");
    item.className = "support-message support-message-" + role;
    item.innerHTML =
      '<div class="support-message-bubble">' + escapeHtml(text) + '</div>' +
      '<div class="support-message-meta">' + (role === "user" ? "You" : "Spectr Assistant") + " - " + timeLabel() + '</div>';
    messages.appendChild(item);
    scrollToEnd();
  }

  function addTyping() {
    var item = document.createElement("article");
    item.className = "support-message support-message-assistant support-typing";
    item.setAttribute("aria-label", "Spectr Assistant is typing");
    item.innerHTML = '<div class="support-message-bubble"><i></i><i></i><i></i></div>';
    messages.appendChild(item);
    scrollToEnd();
    return item;
  }

  function chooseReply(text) {
    var match = replies.find(function (reply) {
      return reply.test.test(text);
    });

    if (match) return match.text;

    return "I can help with product questions, fitment, checkout, orders, returns, warranty, and customer support. Tell me what you are trying to do, and include any order number, SKU, VIN, or product name if you have it.";
  }

  function send(text) {
    var clean = String(text || "").trim();
    if (!clean) return;

    addMessage("user", clean);
    input.value = "";
    input.style.height = "";

    var typing = addTyping();
    window.setTimeout(function () {
      typing.remove();
      addMessage("assistant", chooseReply(clean));
    }, Math.min(900 + clean.length * 8, 1600));
  }

  input.addEventListener("input", function () {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 128) + "px";
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    send(input.value);
  });

  promptButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      send(button.getAttribute("data-support-prompt"));
    });
  });

  addMessage(
    "assistant",
    "Hi, I am Spectr Assistant. Ask me about product fitment, orders, checkout, returns, warranty, or anything you need from support."
  );
})();
