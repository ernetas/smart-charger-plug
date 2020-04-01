Back in December, I bought a few smart plugs online. At first, I used them to remotely control Christmas lights. In January I was left with a bunch of smart plugs that I had to figure out where to use. At first, I used a few of them to remotely control my TV, stereo. Then I realized my laptop is used as a desktop for most of the time - plugged in. So it would make sense to keep it optimally charged at the capacity which is "most healthy" for my battery.

For Windows, there are lots of applications that can do this, assuming your laptop supports it. E.g. Asus has [Battery Health Charging](https://www.asus.com/us/support/FAQ/1032726/), Lenovo has [Power Manager](https://support.lenovo.com/lt/en/solutions/ht078208) and etc. I use a Xiaomi Notebook Pro, so it doesn't any tools like that. However, I'm using Linux, so I decided to take a look at how my smart plugs operate.

Although I bought smart plugs from multiple manufacturers and used different apps to control them, they all seemed to use similarly designed apps and they were all using the same Espressif chips (you can see that from `ip neigh` or `nmap -sP` your network). After some investigation, I found out they are all using [Tuya API](auth.tuya.com). Then I started looking at how to control that with Home Assistant, etc., and eventually ended up at finding out about [codetheweb/tuyapi](https://github.com/codetheweb/tuyapi) NPM package and the [TuyaAPI CLI](https://github.com/TuyaAPI/cli) (which is not affiliated to Tuya Inc. or official CLI, by the way). So this is how this mini project started out.

I don't know how much this will impact my life in reality versus the time spent on it, so I'm doing this mostly for fun and not really for increasing battery lifespan. If someone has any ideas/suggestions, they are welcome on issues section.

# Setup
I'm building this on ArchLinux - feel free to add other OS support, I'm fairly open about it.

You need yarn, node, make installed.

Run `make install` to install the project.

Then create a `config/production.json` based on `config/production.json.example` and run `make link` to link your smart plug (needs to be in pairing mode).

Verify setup by running `make status`. This should output `true` (socket is on) or `false` (socket is off).

# Usage
Run `make help` to find out of all possible commands. E.g. `make on` turns on the socket, `make off` turns off the socket and `make auto` switches the socket automatically based on battery charge level and location.
