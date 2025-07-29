# DC256 Website

**Official Site of DEF CON Group 256 – Huntsville, Alabama**

Welcome to the [DC256](https://dc256.org) web portal! This project is a hacker-themed static website featuring a custom retro terminal, event info, community resources, and digital flair inspired by DEF CON and classic hacker culture.

---

## 🗂 Project Structure

<details>
  <summary>Directory Tree</summary>

  ```text
  dc256-website/
  │
  ├── index.html          # Main landing page with terminal
  ├── about.html          # About DC256
  ├── events.html         # Event info and meetups
  ├── contact.html        # Contact & location details
  ├── images/             # Logos, mascot, and backgrounds
  │   ├── DC256_Text.png
  │   ├── racoon.webp
  │   └── (other graphics)
  ├── shop/               # Optional: merch/shop section or redirect
  ├── styles/             # Optional: external CSS (if split out)
  ├── scripts/            # Optional: JS (if split out)
  ├── README.md           # You are here!
  └── (other static assets)

</details>```

---

## 💻 Local Development

This project is a **static site**—no build step required.

1. **Clone the repo:**
    ```bash
    git clone https://github.com/YOUR-USERNAME/dc256-website.git
    cd dc256-website
    ```

2. **Open `index.html` in your browser.**
   - All features should work locally without a server.
   - If you use advanced features (like service workers), you may want to run a simple server:
     ```bash
     python3 -m http.server
     ```
     Then visit [http://localhost:8000](http://localhost:8000)

---

## 🖥 Terminal Commands

The web terminal supports commands like:
whoami, uptime, ls, pwd, cd, cat flag.txt, date, clear, help, dc256,
sudo, motd, fortune, banner, echo, nmap, hacktheplanet, rm -rf /,
contact, coffee, helpme, quote

Type `help` in the terminal for the full list. New Easter eggs are added regularly!

---

## 🌐 Connect & Contribute

- **Discord:** [Join the DC256 Discord](https://discord.gg/7DgPkkJyCH)
- **Twitter/X:** [@defcon256](https://x.com/defcon256)
- **Email:** info@dc256.org

**Meetups:**  
Every 3rd Friday @ 6PM  
GigaParts, 6123 University Dr, Huntsville, AL 35806

---

## 🤝 Contributing

Pull requests and issues are welcome!

**Want to help edit or improve the website?**  
Please request access by DMing one of the admins on the [DC256 Discord](https://discord.gg/7DgPkkJyCH).  
For security and community reasons, we only grant direct repo access to trusted members.

- Found a bug or have an idea? Open an issue or pull request on GitHub.
- Want to add a new terminal command or feature? Come chat with us on Discord first!

---

## 📝 License

MIT License  
Feel free to fork, remix, and reuse for your own hacker or DEF CON group—just keep a credit to DC256!

---

## 📸 Screenshots

![DC256 Terminal](images/DC256_Text.png)

---

## 🚧 Future Project Ideas

- **Events Calendar** – Interactive calendar for upcoming workshops and meetups
- Member authentication and profile pages
- Interactive hacker puzzles or mini-CTFs
- More advanced terminal emulation and "shell" games

---

*Built by hackers, for hackers. See you at the next meetup!*
