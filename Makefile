.PHONY: run install link on off status auto restart logs

NODE_ENV ?= production

run:
	NODE_ENV=$(NODE_ENV) yarn start

install:
	yarn global add @tuyapi/cli

link:
	~/.yarn/bin/tuya-cli link --ssid $$(jq .wifi.ssid -r config/$(NODE_ENV).json) --password $$(jq .wifi.password -r config/$(NODE_ENV).json) --api-key $$(jq .api.key -r config/$(NODE_ENV).json) --api-secret $$(jq .api.secret -r config/$(NODE_ENV).json) --schema smartbatteryplug

on:
	systemctl --user stop smart-plug
	~/.yarn/bin/tuya-cli set --id $$(jq .plug.id -r config/$(NODE_ENV).json) --key $$(jq .plug.key -r config/$(NODE_ENV).json) --set "true"

off:
	systemctl --user stop smart-plug
	~/.yarn/bin/tuya-cli set --id $$(jq .plug.id -r config/$(NODE_ENV).json) --key $$(jq .plug.key -r config/$(NODE_ENV).json) --set "false"

status:
	~/.yarn/bin/tuya-cli get --id $$(jq .plug.id -r config/$(NODE_ENV).json) --key $$(jq .plug.key -r config/$(NODE_ENV).json)

auto:
	systemctl --user start smart-plug

restart:
	systemctl --user restart smart-plug

logs:
	journalctl -o cat --follow --user --unit smart-plug.service | yarn run pino-pretty -t
