.PHONY: run install-tuya-cli-globally

NODE_ENV ?= production

run:
	NODE_ENV=$(NODE_ENV) yarn start

install-tuya:
	yarn global add @tuyapi/cli

link-tuya:
	~/.yarn/bin/tuya-cli link --ssid $$(jq .wifi.ssid -r config/$(NODE_ENV).json) --password $$(jq .wifi.password -r config/$(NODE_ENV).json) --api-key $$(jq .api.key -r config/$(NODE_ENV).json) --api-secret $$(jq .api.secret -r config/$(NODE_ENV).json) --schema smartbatteryplug

socket-on:
	systemctl --user stop smart-plug
	~/.yarn/bin/tuya-cli set --id $$(jq .plug.id -r config/$(NODE_ENV).json) --key $$(jq .plug.key -r config/$(NODE_ENV).json) --set "true"

socket-off:
	systemctl --user stop smart-plug
	~/.yarn/bin/tuya-cli set --id $$(jq .plug.id -r config/$(NODE_ENV).json) --key $$(jq .plug.key -r config/$(NODE_ENV).json) --set "false"

socket-status:
	~/.yarn/bin/tuya-cli get --id $$(jq .plug.id -r config/$(NODE_ENV).json) --key $$(jq .plug.key -r config/$(NODE_ENV).json)

socket-auto:
	systemctl --user start smart-plug

restart:
	systemctl --user restart smart-plug

logs:
	journalctl --follow --user --unit smart-plug.service
