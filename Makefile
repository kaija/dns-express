MOCHA=./node_modules/.bin/mocha

.PHONY: test setup run

test:
	${MOCHA} test/*.js

setup:
	npm install

run:
	node examples/app.js

