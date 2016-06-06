#!/bin/bash


if [[ "$1" == "production" ]]; then
	export NODE_ENV=production
	browserify -x vue -x vue-resource src/vue-table.js  \
	|  node_modules/uglify-js/bin/uglifyjs -c --screw-ie8 > dist/vue-table.min.js
elif [[ "$1" == "watch" ]]; then
	
	watchify -x vue -x vue-resource src/vue-table.js -o dist/vue-table.js
else
	browserify -x vue -x vue-resource src/vue-table.js -o dist/vue-table.js
fi