/* contact.js — contact form → Discord webhook
   ⚠ SECURITY NOTE: this endpoint is public (anyone reading the source can post
   to it or delete the webhook). Before going live, replace it with a relay that
   keeps the real webhook secret — e.g. a free Cloudflare Worker or Formspree —
   and only change ENDPOINT below. */
const ENDPOINT = 'https://discord.com/api/webhooks/1511326177669808128/IVYtqMsL9meF_5tJxbxiiv8vvziJ_ATtI5wGb3OCe0NTfCl07I_T6doStT876tgzQ_9x';

document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Honeypot filled → bot. Pretend success, send nothing.
  const honeypot = document.getElementById('website');
  const btn = this.querySelector('button[type="submit"]');
  if (honeypot && honeypot.value) {
    btn.textContent = 'Message sent ✓';
    this.reset();
    setTimeout(() => { btn.textContent = 'Send Message →'; }, 3000);
    return;
  }

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  const payload = {
    embeds: [{
      title: subject || 'New message — The Watcher',
      color: 0x05CE78,
      fields: [
        { name: 'Name',    value: name,    inline: true },
        { name: 'Email',   value: email,   inline: true },
        { name: 'Message', value: message || '—' }
      ],
      timestamp: new Date().toISOString(),
      footer: { text: 'The Watcher · contact form' }
    }]
  };

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      btn.textContent = 'Message sent ✓';
      this.reset();
      setTimeout(() => { btn.textContent = 'Send Message →'; btn.disabled = false; }, 3000);
    } else {
      throw new Error();
    }
  } catch {
    btn.textContent = 'Error — try again';
    btn.disabled = false;
  }
});
