# glare

Monitor [CloudFlare][] domains, remove bad servers from the pool.

![Sunlight][]


## Status

This project is currently in development.  This status field will be updated
when this project is safe to use in production.


## Purpose

[CloudFlare][] is a great service, but one of the few things they *don't* do is
monitor your servers with health checks, and remove failing servers from the DNS
pool :(

`glare` is a small service, written in node, which performs health checks
against your [CloudFlare][] domains, and automatically removes servers who fail
health checks from the DNS pool.  This prevents scenarios where you have
[CloudFlare][] routing requests to multiple servers, one goes down, and the
downed server keeps receiving user traffic.

This service is something we needed internally at [Stormpath][], so naturally,
we figured we'd build it and throw it up for anyone else who wants it :)


## How it Works

`glare` works simply:

- Run it locally.
- Visit the web interface and create an account.
- Follow the onboarding instructions (it'll prompt you for your [CloudFlare][]
  email address and API key).
- Configure health check information / frequency.
- Configure alert preferences.
- That's it!

`glare` will then start monitoring your [CloudFlare][] domains, and send you
alerts if one of your servers goes down and gets removed from the DNS pool.
**Magic!**


## Health Checks

Performing health checks is at the core of what `glare` does -- health checks in
`glare` are extremely simple.

- You specify a URL you'd like to health check, this could be something like
  `/glare`.
- For each [CloudFlare][] domain that is managed, `glare` will hit `<your_ip or
  domain>/glare` with an `HTTP GET` request.  If `glare` sees an `HTTP 200`
  response, everything will be considered GOOD.  If `glare` gets anything else,
  the server will considered bad and removed from the [CloudFlare][] DNS pool.


  [CloudFlare]: https://www.cloudflare.com/ "CloudFlare"
  [Stormpath]: https://www.stormpath.com/ "Stormpath"
  [Sunlight]: https://github.com/stormpath/glare/raw/master/assets/images/sunlight.jpg "Sunlight Sketch"
