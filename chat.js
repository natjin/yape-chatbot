/* ============================
   YAPE CHATBOT — CHAT LOGIC
   ============================ */

(function() {
  'use strict';

  // === DOM ELEMENTS ===
  const messagesEl = document.getElementById('chatMessages');
  const quickRepliesEl = document.getElementById('quickReplies');
  const inputEl = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');

  // === YAPITO AVATAR SVG (inline for messages) ===
  const YAPITO_AVATAR_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="#00BFA5"/>
    <circle cx="24" cy="24" r="22" fill="url(#yg-msg)"/>
    <ellipse cx="24" cy="26" rx="14" ry="13" fill="white"/>
    <circle cx="18.5" cy="23" r="3.5" fill="#4A1A5E"/>
    <circle cx="29.5" cy="23" r="3.5" fill="#4A1A5E"/>
    <circle cx="19.5" cy="21.8" r="1.2" fill="white"/>
    <circle cx="30.5" cy="21.8" r="1.2" fill="white"/>
    <path d="M18 29.5C18 29.5 21 33 24 33C27 33 30 29.5 30 29.5" stroke="#4A1A5E" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="15" cy="28" rx="2.5" ry="1.5" fill="#FFB3C1" opacity="0.6"/>
    <ellipse cx="33" cy="28" rx="2.5" ry="1.5" fill="#FFB3C1" opacity="0.6"/>
    <line x1="24" y1="13" x2="24" y2="7" stroke="#00BFA5" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="24" cy="5.5" r="3" fill="#00BFA5"/>
    <circle cx="24" cy="5.5" r="1.5" fill="white"/>
    <defs><linearGradient id="yg-msg" x1="2" y1="2" x2="46" y2="46"><stop offset="0%" stop-color="#9B59B6"/><stop offset="100%" stop-color="#722B8C"/></linearGradient></defs>
  </svg>`;

  // === FAQ DATABASE ===
  const faqs = [
    {
      keywords: ['send money', 'send', 'transfer money', 'pay someone', 'how to pay', 'send cash', 'make payment', 'pagar'],
      response: "Sending money with Yape is easier than ordering ceviche! You've got two options:\n\n📱 <b>By phone number</b> — just enter the number and the amount. Done in 3 taps.\n\n📸 <b>By QR code</b> — scan their QR and the money flies over like magic.\n\nEither way, it's instant. Like, blink-and-it's-there instant. ¡Yapea!",
      followUps: ['Is Yape free?', 'Transfer limits?', 'Is it safe?']
    },
    {
      keywords: ['free', 'cost', 'charge', 'fee', 'how much', 'precio', 'gratis'],
      response: "For you, dear user? Yape is <b>100% free</b>. Zero. Nada. Cero soles.\n\nNo fees for sending money, receiving money, or paying at stores. We don't even charge you for the good vibes.\n\nBusinesses pay a small fee for Yape Promos and some services, but that's between us and them. You just enjoy the ride. ¡Eso es todo!",
      followUps: ['How do I send money?', 'Transfer limits?', 'What is Yape Tienda?']
    },
    {
      keywords: ['limit', 'maximum', 'how much can i', 'transfer limit', 'daily limit', 'límite'],
      response: "Ah, a big spender! I like your energy. Here are the limits:\n\n💰 <b>Per transaction:</b> S/ 500\n💰 <b>Daily:</b> S/ 1,500\n💰 <b>Monthly:</b> S/ 5,000\n\nIf you're hitting those limits regularly... I'm not judging, but maybe check your shopping habits? Just kidding. Mostly. 😄\n\nFor BCP account holders, limits can be higher — check with your bank!",
      followUps: ['Is Yape free?', 'How do I send money?', 'Is it safe?']
    },
    {
      keywords: ['create account', 'sign up', 'register', 'join', 'new account', 'get started', 'start', 'download', 'registrar', 'crear'],
      response: "Welcome to the family! Getting started is super simple:\n\n<b>1.</b> Download Yape from the App Store or Google Play\n<b>2.</b> Enter your phone number\n<b>3.</b> Verify with the code we send you\n<b>4.</b> Set up your security PIN\n<b>5.</b> Link your BCP account (or use Yape without one!)\n\nThe whole thing takes about 2 minutes. Less time than microwaving popcorn. 🍿\n\n¡Bienvenido a Yape!",
      followUps: ['Is Yape free?', 'Is it safe?', 'Transfer limits?']
    },
    {
      keywords: ['safe', 'secure', 'security', 'hack', 'scam', 'protect', 'seguro', 'seguridad', 'fraud'],
      response: "Your money is safer than a llama in the Andes! Here's why:\n\n🔒 <b>End-to-end encryption</b> — your data is locked up tight\n🔐 <b>Personal PIN</b> — only you can authorize transactions\n📱 <b>Biometric auth</b> — fingerprint or face recognition\n🛡️ <b>BCP backing</b> — Peru's largest bank has your back\n🚨 <b>Real-time alerts</b> — we notify you of every transaction\n\nWe take security as seriously as Peruvians take their lomo saltado. And that's very, VERY seriously.",
      followUps: ['How do I send money?', 'Who made Yape?', 'Create account']
    },
    {
      keywords: ['abroad', 'international', 'other country', 'remittance', 'overseas', 'outside peru', 'exterior', 'otro país', 'remesas'],
      response: "Going global! 🌎 Yape now receives remittances from <b>37 countries</b>!\n\nYour family and friends abroad can send money directly to your Yape account. No need to visit an exchange house or stand in line.\n\nSupported from the US, Spain, Chile, Argentina, and 33 more countries. It's like having a worldwide yapeo network.\n\nFor sending money OUT of Peru... we're working on it. Stay tuned! 🚀",
      followUps: ['Is Yape free?', 'Transfer limits?', 'What is Yape Tienda?']
    },
    {
      keywords: ['tienda', 'store', 'shop', 'marketplace', 'buy', 'purchase', 'comprar', 'shopping'],
      response: "<b>Yape Tienda</b> is basically a shopping paradise inside your Yape app! 🛒✨\n\nBrowse products from thousands of stores, pay with one tap, and get great deals. From electronics to groceries, fashion to food delivery — it's all there.\n\nThink of it as your favorite mall, but you never have to find parking. And you can shop in your pajamas. Which is what I'd do if I wore clothes. 😅\n\n¡A yapear las compras!",
      followUps: ['Is Yape free?', 'How do I send money?', 'Is it safe?']
    },
    {
      keywords: ['invest', 'stock', 'crypto', 'bitcoin', 'trading', 'financial advice', 'investment', 'portfolio', 'savings', 'interest rate', 'inversión'],
      response: "Oh, you want investment advice? I'm flattered that you trust a chatbot with your financial future, but... <b>my lawyers said absolutely not</b>. 😅\n\nI'm great at helping you send S/ 20 to your friend for lunch. Portfolio management? Not so much.\n\nFor real financial advice, please talk to a certified financial advisor or check with BCP's investment services. They actually went to school for this stuff.\n\n¡Suerte con tus inversiones!",
      followUps: ['What is Yape Tienda?', 'Is Yape free?', 'Who made Yape?']
    },
    {
      keywords: ['not working', 'error', 'bug', 'crash', 'problem', 'issue', 'help', 'broken', 'fail', "can't", "won't", 'no funciona', 'problema'],
      response: "Ugh, tech problems are the worst. I feel you. Let's fix this together:\n\n<b>Quick fixes to try:</b>\n🔄 Close and reopen the app\n📶 Check your internet connection\n🔄 Update to the latest version\n📱 Restart your phone (the classic)\n🗑️ Clear the app cache\n\nIf it's still being stubborn, contact our support team at the <b>Help Center</b> inside the app.\n\nRemember: even the best apps have bad days. We're probably already working on it! 💪",
      followUps: ['Is it safe?', 'Create account', 'How do I send money?']
    },
    {
      keywords: ['who made', 'creator', 'company', 'bcp', 'banco', 'origin', 'history', 'founded', 'quién creó'],
      response: "Yape was created by <b>Banco de Crédito del Perú (BCP)</b> — Peru's oldest and largest bank, founded way back in 1889. That's over 135 years of financial know-how! 🏦\n\nYape launched in 2016 and has grown to <b>over 15 million users</b>. We've also expanded to Bolivia, and recently launched remittances from 37 countries.\n\nFrom a simple P2P payment app to a full financial ecosystem — not bad for a little purple app from Peru, right?\n\n¡Orgullosamente peruano! 🇵🇪",
      followUps: ['Is Yape free?', 'What is Yape Tienda?', 'Can I use Yape abroad?']
    }
  ];

  // === FALLBACK RESPONSES ===
  const fallbacks = [
    "Hmm, that's a new one! I'm not sure I have an answer for that. Try asking about sending money, account setup, or Yape features — that's where I really shine! ✨",
    "My brain cells (all three of them) can't figure that one out. Could you rephrase? Or try one of the suggested topics below! 😄",
    "I appreciate the creativity, but I'm stumped! I'm best at answering questions about Yape features and payments. Give me a Yape question and watch me go! 🚀",
    "¿Qué? I didn't quite catch that. I speak fluent Yape but sometimes struggle with other topics. Try asking me about transfers, payments, or account help!",
    "That one's above my pay grade! (Not that I get paid... I work for yapeos.) Try a Yape-related question and I'll hook you up! 💜"
  ];

  let fallbackIndex = 0;

  // === INITIAL SUGGESTED QUESTIONS ===
  const initialChips = [
    'How do I send money?',
    'Is Yape free?',
    'Transfer limits?',
    'Create account',
    'Is it safe?'
  ];

  // === UTILITIES ===
  function getTimeString() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
  }

  // === MESSAGE RENDERING ===
  function addDayDivider() {
    const div = document.createElement('div');
    div.className = 'day-divider';
    div.innerHTML = '<span>Today</span>';
    messagesEl.appendChild(div);
  }

  function addBotMessage(text, showAvatar = true) {
    // Convert newlines to <br> for display
    text = text.replace(/\n/g, '<br>');
    const row = document.createElement('div');
    row.className = 'message-row bot';

    const avatarHtml = showAvatar
      ? `<div class="message-avatar">${YAPITO_AVATAR_SVG}</div>`
      : '<div class="message-avatar" style="visibility:hidden;"></div>';

    row.innerHTML = `
      ${avatarHtml}
      <div class="message-content">
        <div class="bubble">${text}</div>
        <span class="message-time">${getTimeString()}</span>
      </div>
    `;

    messagesEl.appendChild(row);
    scrollToBottom();
  }

  function addUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'message-row user';

    row.innerHTML = `
      <div class="message-content">
        <div class="bubble">${escapeHtml(text)}</div>
        <span class="message-time">${getTimeString()}</span>
      </div>
    `;

    messagesEl.appendChild(row);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'message-row bot';
    row.id = 'typingIndicator';

    row.innerHTML = `
      <div class="message-avatar">${YAPITO_AVATAR_SVG}</div>
      <div class="message-content">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;

    messagesEl.appendChild(row);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  function setQuickReplies(chips) {
    quickRepliesEl.innerHTML = '';
    if (!chips || chips.length === 0) return;

    chips.forEach((text) => {
      const btn = document.createElement('button');
      btn.className = 'quick-chip';
      btn.textContent = text;
      btn.addEventListener('click', () => handleQuickReply(text));
      quickRepliesEl.appendChild(btn);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // === FAQ MATCHING ===
  function findResponse(input) {
    const lower = input.toLowerCase().trim();

    for (const faq of faqs) {
      for (const keyword of faq.keywords) {
        if (lower.includes(keyword.toLowerCase())) {
          return faq;
        }
      }
    }

    return null;
  }

  function getFallbackResponse() {
    const response = fallbacks[fallbackIndex % fallbacks.length];
    fallbackIndex++;
    return {
      response: response,
      followUps: ['How do I send money?', 'Is Yape free?', 'What is Yape Tienda?']
    };
  }

  // === INTERACTION HANDLERS ===
  let isProcessing = false;

  function handleSend() {
    const text = inputEl.value.trim();
    if (!text || isProcessing) return;

    isProcessing = true;
    inputEl.value = '';
    sendBtn.disabled = true;

    // Add user message
    addUserMessage(text);

    // Clear quick replies
    setQuickReplies([]);

    // Show typing indicator
    const typingDelay = 400 + Math.random() * 600;
    setTimeout(() => {
      showTypingIndicator();
    }, typingDelay);

    // Find and display response
    const responseDelay = typingDelay + 800 + Math.random() * 800;
    setTimeout(() => {
      removeTypingIndicator();

      const match = findResponse(text);
      const result = match || getFallbackResponse();

      addBotMessage(result.response);

      // Show follow-up chips after a brief delay
      setTimeout(() => {
        setQuickReplies(result.followUps);
        isProcessing = false;
      }, 300);
    }, responseDelay);
  }

  function handleQuickReply(text) {
    if (isProcessing) return;
    inputEl.value = text;
    handleSend();
  }

  // === INPUT HANDLING ===
  inputEl.addEventListener('input', () => {
    sendBtn.disabled = !inputEl.value.trim();
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn.addEventListener('click', handleSend);

  // === INITIALIZE ===
  function init() {
    // Day divider
    addDayDivider();

    // Welcome message with a short delay for natural feel
    setTimeout(() => {
      addBotMessage(
        "¡Hola! I'm <b>Yapito</b>, your friendly Yape assistant! 💜<br><br>I can help you with payments, account questions, and all things Yape. What would you like to know?"
      );

      setTimeout(() => {
        setQuickReplies(initialChips);
      }, 350);
    }, 500);
  }

  // Start
  init();
  inputEl.focus();

})();
