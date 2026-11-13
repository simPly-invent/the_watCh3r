# the_watCh3r

An autonomous surveillance drone for the home, and the website of its
Kickstarter campaign.

Live site: https://simply-invent.github.io/the_watCh3r/

## The project

the_watCh3r is a small drone that patrols a house while its owners are
away, without relying on a paid security service. The hardware stack is a
quadcopter frame with motors and ESCs, a flight controller running INAV,
a Raspberry Pi for the autonomy and camera, and an ELRS receiver as a
manual fallback. The second phase adds a charging base so the drone can
land, recharge and take off again on its own.

The site presents the idea, the technical layers, a gallery of the build
and a contact page, and links to the campaign.

## Repository layout

```
.
├── index.html            landing page
├── html/
│   ├── tech.html         hardware and software stack
│   ├── gallery.html      photos of the build
│   └── contact.html
├── assets/
│   ├── css/  js/  img/   site assets (images also in webp)
│   └── data/
├── 3d_model/             printable parts (landing gear, enclosures)
├── README/
│   ├── BUDGET.md         public budget of the campaign
│   ├── SUPPORTERS.md     backers list
│   └── UPDATES.md        monthly changelog
└── text_oral.txt         pitch script
```

## Running the site locally

The site is static, so any file server works:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

It is published with GitHub Pages from the `master` branch (the
`.nojekyll` file disables Jekyll processing).

## Transparency documents

- [Budget](README/BUDGET.md): planned allocation and actual spending
- [Updates](README/UPDATES.md): monthly progress log
- [Supporters](README/SUPPORTERS.md): people backing the campaign
