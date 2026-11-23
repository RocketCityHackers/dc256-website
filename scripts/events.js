(() => {
  const root = new URL('../', document.currentScript.src);
  const formatDate = value => new Intl.DateTimeFormat('en-US', {timeZone:'America/Chicago', weekday:'long', year:'numeric', month:'long', day:'numeric'}).format(new Date(value));
  const formatTime = value => new Intl.DateTimeFormat('en-US', {timeZone:'America/Chicago', hour:'numeric', minute:'2-digit', timeZoneName:'short'}).format(new Date(value));
  const load = async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(new URL('data/events.json', root), {cache:'no-store', signal:controller.signal});
      if (!response.ok) throw new Error('Event data unavailable');
      const events = await response.json();
      if (!Array.isArray(events) || events.some(e => !e.id || !e.title || !e.location || !Number.isFinite(Date.parse(e.startsAt)))) throw new Error('Invalid event data');
      return events;
    } finally { clearTimeout(timer); }
  };
  const nextEvent = (events, now = Date.now()) => events.filter(e => Date.parse(e.startsAt) >= now).sort((a,b) => Date.parse(a.startsAt)-Date.parse(b.startsAt))[0];
  window.DC256Events = {
    load, nextEvent,
    async terminal() {
      try {
        const event = nextEvent(await load());
        if (!event) return 'No upcoming events announced.\nCheck Discord: https://discord.gg/7DgPkkJyCH\nPast meetups: ' + new URL('events.html', root).href;
        return ['NEXT EVENT', event.title, '', 'Date: ' + formatDate(event.startsAt), 'Time: ' + formatTime(event.startsAt), 'Location: ' + event.location, '', 'Details: ' + new URL('events.html#' + event.id, root).href].join('\n');
      } catch (_) { return 'Could not load the latest events. Please try again.\nEvent listings: ' + new URL('events.html', root).href; }
    }
  };
  const section = document.querySelector('[data-event-list]');
  if (!section) return;
  load().then(events => {
    const cards = events.slice().sort((a,b) => Date.parse(b.startsAt)-Date.parse(a.startsAt)).map(event => {
      const card = document.createElement('div'); card.className = 'event'; card.id = event.id;
      const append = (tag, text, cls) => { const node = document.createElement(tag); node.textContent = text; if (cls) node.className = cls; card.append(node); return node; };
      append('h2', event.title);
      const meta = append('p', ['Date: ' + formatDate(event.startsAt), 'Time: ' + formatTime(event.startsAt), 'Location: ' + event.location].join('\n')); meta.style.whiteSpace = 'pre-line';
      const sponsor = append('p', event.collaboration + '\nSponsored by: ' + event.sponsor + ' — ', 'sponsor'); sponsor.style.whiteSpace = 'pre-line';
      const link = document.createElement('a'); link.href = event.sponsorUrl; link.textContent = event.sponsorUrl; sponsor.append(link);
      append('p', event.description);
      const address = append('p', 'Venue Address:\n' + event.venueAddress); address.style.whiteSpace = 'pre-line';
      const image = document.createElement('img'); image.src = new URL(event.image, root); image.alt = event.imageAlt; image.loading = 'lazy'; card.append(image);
      return card;
    });
    section.querySelectorAll('.event').forEach(card => card.remove());
    section.append(...cards);
  }).catch(() => { /* Preserve the readable static event listing if offline. */ });
})();
