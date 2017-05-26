MOCHA=./node_modules/.bin/mocha

.PHONY: test setup

test:
	${MOCHA} test/*.js

setup:
	npm install
