[![npm](https://img.shields.io/npm/v/vuetable.svg)](https://www.npmjs.com/package/vuetable)
[![npm](https://img.shields.io/npm/l/vuetable.svg?maxAge=2592000)]()

vuetable - data table simplify!
========

- No need to render the table yourself
- One simple `vuetable` tag
- Display data retrieved from server with sort options
- Support multi-column sorting (v1.2.0) by @balping
- Pagination component included, swap-able and extensible
- Define fields to map your JSON data structure
- Define row actions and capture the click event to do whatever you want
- Field display customizable via callback function inside Vue.js instance
- Programmatically show/hide any field via reactivity of fields definition
- Use your favorite CSS framework classes to nicely format your table and dispalyed data
- Events to allow control from Vue.js instance programmatically
- Capture events from `vuetable` to manipulate your table and your data
- Should work with any pre-defined JSON data structure
- Should work with any CSS Framework, e.g. Semantic UI, Twitter's Bootstrap
- Optional detail row to display additional data (v.1.2.0)

##Breaking Changes
####v1.5.0
  - deprecated props
      + `row-detail-callback`: use `row-detail-component` instead

####v1.3.0
  - deprecated props 
      - `paginateConfig`: use `paginateConfigCallback` instead
      - `detail-row`: use `detail-row-callback` instead


####v1.2.0
-  `sort-order` option type was changed from `Object` to `Array` to support `multi-sort`, therefore it should be declared as array. [#36](https://github.com/ratiw/vue-table/pull/36)

    ```
    <vuetable 
      //...
      :sort-order="[{ field: 'name', direction: 'asc' }]"
    ></vuetable>
    ```

---

##Live Demo
- [JSON data structure](http://vuetable.ratiw.net/api/users)
- [Semantic UI example](http://vuetable.ratiw.net/examples/semantic.html)
- [Bootstrap UI example](http://vuetable.ratiw.net/examples/bootstrap.html)

---

## What is `vuetable`?
`vuetable` is a Vue.js component that will automatically request (JSON) data
from the server and display them nicely in html table with swappable/extensible
pagination sub-component. You can also add buttons to each row and hook an event
to it

![image](https://i.imgsafe.org/d46e5e1.gif)

> Please note that all the examples show in here are styling using Semantic UI CSS Framework,
> but `vuetable` should be able to work with any CSS framwork including Twitter's Bootstrap.
> Please read through and see more info [below](#bootstrap).

You do this:
```html
    <div id="app" class="ui vertical stripe segment">
        <div class="ui container">
            <div id="content" class="ui basic segment">
                <h3 class="ui header">List of Users</h3>
                <vuetable
                    api-url="http://example.app:8000/api/users"
                    table-wrapper="#content"
                    :fields="columns"
                    :item-actions="itemActions"
                ></vuetable>
            </div>
        </div>
    </div>
```

```javascript
	<script>
	    new Vue({
	        el: '#app',
	        data: {
	            columns: [
	                'name',
	                'nickname',
	                'email',
	                'birthdate',
	                'gender',
	                '__actions'
				],
	            itemActions: [
	                { name: 'view-item', label: '', icon: 'zoom icon', class: 'ui teal button' },
	                { name: 'edit-item', label: '', icon: 'edit icon', class: 'ui orange button'},
	                { name: 'delete-item', label: '', icon: 'delete icon', class: 'ui red button' }
	            ]
	        },
	        methods: {
	            viewProfile: function(id) {
	                console.log('view profile with id:', id)
	            }
	        },
	        events: {
	            'vuetable:action': function(action, data) {
	                console.log('vuetable:action', action, data)
	                if (action == 'view-item') {
	                    this.viewProfile(data.id)
	                }
	            },
	            'vuetable:load-error': function(response) {
	                console.log('Load Error: ', response)
	            }
	        }
        })
	</script>
```

And you get this!
![image](https://i.imgsafe.org/af08442.jpg)

Since I'm mainly using [Semantic UI](http://semantic-ui.com) as my default CSS Framework, all the css
styles in `vuetable` are based on Semantic UI. If you're using Twitter's [Bootstrap](http://getbootstrap.com)
css framework, please see [documentation in the Wiki pages](https://github.com/ratiw/vue-table/wiki/Using-%60vuetable%60-with-Twitter's-Bootstrap).

## Usage

### Bower

```
$ bower install vuetable
```

### NPM

```
$ npm install vuetable
```

### Vueify version for Browserify and Webpack

Just `import` or `require` like so,

```javascript
//
// firstly, require or import vue and vue-resource
//
var Vue = require('vue');
var VueResource = require('vue-resource');
Vue.use(VueResource);

//
// secondly, require or import Vuetable and optional VuetablePagination component
//
import Vuetable from 'vuetable/src/components/Vuetable.vue';
import VuetablePagination from 'vuetable/src/components/VuetablePagination.vue';
import VuetablePaginationDropdown  from 'vuetable/src/components/VuetablePaginationDropdown.vue';

//
// thirdly, register components to Vue
//
Vue.component('vuetable', Vuetable);
Vue.component('vuetable-pagination', VuetablePagination)
Vue.component('vuetable-pagination-dropdown', VuetablePaginationDropdown)

```
You can combine the second and third steps into one if you like.

You need to explicitly register the pagination components using `Vue.component()` (instead of just declaring them through the `components:` section); otherwise, the pagination component will not work or swappable or extensible. I *guess* this is because it is embedded inside `vuetable` component.

### Direct include

Just import the `vue-table.js` after `vue.js` and `vue-resource.js` library in your page like so.
```html
	<script src="js/vue.js"></script>
	<script src="js/vue-resource.js"></script>
	<script src="js/vue-table.js"></script>
```

Then, reference the vuetable via `<vuetable>` tag as following

```html
	<div id="app">
	    <vuetable
	        api-url="/api/users"
	        :fields="columns"
	    ></vuetable>
    </div>

	<script>
		new Vue({
			el: '#app',
			data: {
				columns: [
					'firstname',
					'lastname',
					'nickname',
					'birthdate',
					'group.name_en'
					'gender',
					'last_login',
					'__actions'
				]
			}
		})
	</script>
```
- `api-url` is the url of the api that `vuetable` should request data from.
The returned data must be in the form of JSON formatted with at least the number of fields
defined in `fields` property.
- `fields` is the fields mapping that will be used to display data in the table.
You can provide only the name of the fields to be used. But if you would like to get
the true power of `vuetable`, you must provide some more information.
Please see [Field Definition](https://github.com/ratiw/vue-table/wiki/Fields-Definition)
section for more detail.

For more detail, please see [documentation in the Wiki pages](https://github.com/ratiw/vue-table/wiki).

### Building

Run `npm install`

Then make sure, you have installed browserify:

```
# npm install browserify -g
```

You might need root access for running the above command.

Then you can simply run the build script included in the root folder:

```
$ ./build.sh
```

This will compile the vue components in the `src` directory to one file in the `dist` folder.

You might want to get a minified version, in this case run this:

```
$ ./build.sh production
```

For developement it's useful when it's not needed to recompile manually each time you make a change. If you want this convenience first install watchify globally:

```
# npm install watchify -g
```

then run

```
$ ./build.sh watch
```

Now each time you make a change, the source will be recompiled automatically.



<a id="license"></a>
## License
`vuetable` is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
