"""Regenerate the shared static navigation: python3 scripts/update-navigation.py."""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parent.parent
PAGES = ['index.html', 'about.html', 'events.html', 'contact.html', 'wardrive2026.html', 'tt/linux.html', 'tt/wireshark.html', 'tt/dissectors.html']
LINKS = [('Home','index.html'),('About','about.html'),('Events','events.html'),('Contact','contact.html'),('Wardrive 2026','wardrive2026.html')]
for name in PAGES:
    path = ROOT / name
    prefix = '../' if '/' in name else ''
    links = ''.join(f'<a href="{prefix}{url}"'+(' aria-current="page"' if url == name else '')+f'>{label}</a>' for label,url in LINKS)
    header = f'''<header class="site-header"><a class="site-brand" href="{prefix}index.html" aria-label="DC256 home"><img src="{prefix}images/DC256_Text.png" alt="DC256"></a><nav aria-label="Main navigation">{links}<a href="https://huntsvillehtb.org/" target="_blank" rel="noopener noreferrer">HuntsvilleHTB</a><a href="{prefix}bsides.html">BSides</a><a href="https://shop.dc256.org/" target="_blank" rel="noopener noreferrer">Shop</a></nav></header>'''
    text = re.sub(r'<header\b.*?</header>', header, path.read_text(), count=1, flags=re.S)
    path.write_text(text)
