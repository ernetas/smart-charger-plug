.PHONY: run connected

run:
	NODE_ENV=production yarn start

connected:
	iwctl station wlan0 get-networks | grep '>'  | grep 'sun\ '
