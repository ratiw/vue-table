vuetable
========

`vuetable` is a Vue.js component that will automatically request (JSON) data
from the server and display them nicely in html table with swappable/extensible
pagination sub-component. You can also add buttons to each row and hook an event
to it

![image](http://s20.postimg.org/lf470bkd7/vuetable_short.gif)

> Please note that all the examples show in here are styling using Semantic UI CSS Framework,
> but `vuetable` should be able to work with any CSS framwork including Twitter's Bootstrap.
> Please read through and see more info below.

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
![image](http://s16.postimg.org/gitalgeth/image.jpg)

Since I'm mainly using [Semantic UI](http://semantic-ui.com) as my default CSS Framework, all the css
styles in `vuetable` are based on Semantic UI. If you're using Twitter's [Bootstrap](http://getbootstrap.com)
css framework, please see [this section](#bootstrap) below.

## Usage
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
		})
	</script>
```
- `api-url` is the url of the api that `vuetable` should request data from.
The returned data must be in the form of JSON formatted with at least the number of fields
defined in `fields` property.
- `fields` is the fields mapping that will be used to display data in the table.
You can provide only the name of the fields to be used. But if you would like to get
the true power of `vuetable`, you must provide some more information.
Please see [Field Definition] section for more detail.

What it will look like?
![image](http://postimg.org/image/indnmjgg1/)

# Table of Content
- [Properties](#properties)
- [Fields Definition](#fieldsdef)
- [Special Field](#specialfield)
- [Callbacks](#callback)
- [Events](#events)
- [Data Format (JSON)](#dataformat)
- [Sorting, Paging, and Filtering of Data](#sorting)
- [Appending Other Parameters to the Query String](#appendparams)
- [Sample Data Using Laravel](#sampledata)
- [Customize the Pagination Info](#customize_pageinfo)
- [Pagination Components](#pagination_component)
- [CSS Styling](#styling)
- [Using `vuetable` with Twitter's Bootstrap](#bootstrap)
- [License](#license)

<a id="properties"></a>
## Properties
Here are the list of properties that will allow you to customize the `vuetable` functionality.
You are only required to provide 2 properties which are `api-url` and `fields`. The rest is optional.

Property | Type | Default | Description
--- | --- | --- | ---
`api-url` | String | (_required_) | The URL of the api that `vuetable` will interact with.
`fields` | Array | (_required_) | The array of fields that would be mapped to the structure of data returned from the server.
`sort-order` | Object | `{ field: '', direction: 'asc' }` | The default sort order that `vuetable` should use when the data get rendered.
`data-path` | String | `data` | The path into the JSON data structure that `vuetable` will use to refer to the actual data.
`pagination-path` | String | `links.pagination` | The path into the JSON data structure that `vuetable` will use to refer to the pagination information of the return data.
`ascendingIcon` | String | `blue chevron up icon` | The css class(es) that will be rendered as ascending icon on the table column header
`descendingIcon` | String | `blue chevron down icon` | The css class(es) that will be rendered as descending icon on the table column header
`item-actions` | Array | `[]` | The array of actions to be rendered as button inside special field named `actions`. See [Special Field](#specialfield).
`table-wrapper` | String | `null` | The parent DOM element that uses to wrap `vuetable` where the `loading` image should appear to cover the whole table while requesting data from the server.
`table-class` | String | `ui blue striped selectable celled stackable attached table` | The css class to be applied to the `table` element that `vuetable` will generate.
`loading-class` | String | `loading` | The css class to be applied during the request of data from server.
`show-pagination` | Boolean | `true` | Tells `vuetable` to display pagination or not.
`pagination-info-template` | String | `Displaying {from} to {to} of {total} items` | The pagination information to be shown. See [Customize the Pagination Info](#customize_pageinfo).
`pagination-component` | String | `vuetable-pagination` | PaginationInfo component that `vuetable` will use to render the pagination.
`pagination-class` | String | `ui bottom attached segment grid` | The css class to be applied to the pagination section.
`pagination-info-class` | String | `left floated left aligned six wide column` | The css class to be applied to the pagination info section.
`pagination-component-class` | String | `right floated right aligned six wide column` | The css class to be applied to the pagination component section.
`query-params` | Object | `{ sort: 'sort', page: 'page', perPage: 'per_page' }` | The text key to be used as query string that will be sent to the server. See [Sorting, Paging, and Filtering of Data](#sorting)
`append-params` | Array | `[]` | Additional parameters that `vuetable` should append to the query string when requesting data from the server. See [Appending Other Parameters to the Query String](#appendparams)

<a id="fieldsdef"></a>
## Fields Definition
Fields can be defined as simple string array, array of object, or the mix.

- Fields defined as simple array

	```javascript
		var columns = ['name', 'email', 'birthdate', 'gender']
	```

- Fields defined as array of object
	```javascript
		var columns = [
			{
				name: 'name',
				sortField: 'name',
			},
			{
				name: 'email',
			},
			{
				name: 'birthdate',
				sortField: 'birthdate',
	            titleClass: 'center aligned',
	            dataClass: 'center aligned',
	            callback: 'formatDate|D/MM/Y'
			},
	        {
	            name: 'gender',
	            sortField: 'gender',
	            titleClass: 'center aligned',
	            dataClass: 'center aligned',
	            callback: 'gender'
	        },
		]
	```

- Fields defined as array of the mix
	```javascript
		var columns = [
			'name',
			'email',
			{
				name: 'birthdate',
				sortField: 'birthdate',
	            titleClass: 'center aligned',
	            dataClass: 'center aligned',
	            callback: 'formatDate|D/MM/Y'
			},
	        {
	            name: 'gender',
	            sortField: 'gender',
	            titleClass: 'center aligned',
	            dataClass: 'center aligned',
	            callback: 'gender'
	        },
	```

	The difference is that if you defined a field as simple. `vuetable` will only display it as is
	without sorting or transforming options. `vuetable` will convert the simple field definition
	to field object with only `name` property.

	```javascript
        var columns = ['name']
        // will be converted to this
        // var columns = [ { name: 'name' } ]
	```

#### Field options
- `name`

	Name of the data field to be display.

- `sortField`

	Usually, it will be the same as `name` option. But you can specify different value if
	you use different field name when querying data on the serve side, e.g. firstname.

	If specified, the field will be marked as sortable. `vuetable` will display appropriate
	clickable icon after the field title. `vuetable` will also make a new request to the server
	with the `sort=<sortField>` query string appended.


- `titleClass`

	The css class you would like to apply for the title of this field.

- `dataClass`

	The css class you would like to apply for the data of this field.

- `callback`

	The name of the callback function to be called to allow any transformation of the value
	to be displayed. See [Callback](#callback) section for more info.

<a id="specialfield"></a>
## Special Field
- `__actions`

If you name one of your field as `__actions`, `vuetable` will automatically use the information
provided via `item-actions` property to generate array of buttons inside this table column.
And when the user click on any of these buttons, a `vuetable:action` event will be dispatched
with the `name` of the action as the event argument along with the data row currently in process.

You can capture this event in the parent Vue.js instance, and inspect the argument value to take
any appropriate action based on that value.

```javascript
	new Vue({
		el: '#app',
		methods: {
			viewProfile: function(email) {
				console.log('do something with email: ', email)
			}
		},
        events: {
            'vuetable:action': function(action, data) {
                console.log('vuetable:action', action, data)
                if (action == 'view-item') {
                    this.viewProfile(data.email)
                }
            },
		}
	})
```

<a id="callback"></a>
## Callbacks
Each field can have an associated callback function that will modify the content of the data
before it gets displayed by `vuetable`. You define the callback function inside the field
definition using the `callback` option by specifying the name of the function to be called.

The callbacks are defined inside the Vue.js instance where `vuetable` component is defined.

Here is the example of a field defines callback function.
```javascript
	{
		name: 'gender',
		callback: 'gender'
	}
```
In this case, the field named `gender` has a callback function, which is coincidently named `gender`
as well. `vuetable` will automatically look for this callback function in its parent Vue.js instance.

Let's look at the `gender` callback function.
```javascript
	new Vue({
		el: '#app',
		methods: {
			gender: function(value) {
                return value == 'M' ? 'Male' : 'Female'
			}
		}
	})
```
`vuetable` will automatically pass the value of that field to the callback function.
The callback function can then work on the value. The return value from the callback
will be used to display to the user.

In this case, if the `value` that gets passed to `gender` callback is `M`, it will
return `Male` and `vuetable` will display `Male` for this field instead of `M`,
otherwise, `Female` will be displayed.

#### Passing Additional Parameters to Callback function
Suppose you have a callback function to format the date value to be displayed in certain
date format, but you also would like to be able to override that default date format as
well. You can do so like this:
```javascript
	new Vue({
		el: '#app',
		columns: [
	        {
	            name: 'birthdate',
	            callback: 'formatDate|D/MM/Y'
	        }
		]
		methods: {
            formatDate: function(value, fmt) {
                if (value == null) return ''
                fmt = (typeof fmt == 'undefined') ? 'D MMM YYYY' : fmt
                return moment(value, 'YYYY-MM-DD').format(fmt)
            }
		}
	})
```
In this example, field `birthdate` has a callback named `formatDate`. The callback
defines additional parameter using `|` character follows the name of the callback
function.

When the `formatDate` callback is called the `value` of the field will be passed
as well as the additional parameters. So, the callback function can use that additional
parameters to decide what the return value should be based on those additional parameters.

<a id="events"></a>
## Events
`vuetable` uses events to communicate with its parent (Vue.js instance) and its pagination
child component. This allows the parent Vue.js instance and pagination component to tap into
those events to modify the behavior of `vuetable` with ease.

- **`vuetable:action`**

	This event will be dispatched up the parent chain when the user
	click on any item action defined in the 'item-actions' property.

	*arguments:* The action's `name` and the item data will be passed as the event arguments.

- **`vuetable:loading`**

	This event will be dispatched up the parent chain **before** `vuetable` starts
	to request the data from the server. This is useful for start displaying the loading image.

	*arguments:* This event does not pass any argument.

- **`vuetable:load-success`**

	This event will be dispatched up the parent chain *as well as* broadcast down the
	children chain when `vuetable` has successfully got the data back from the server.

	*arguments:*
	- When `load-success` event is _dispatched_, the table data and pagination will already
	be set. The whole `response` will be passed as the event argument.
	- When `load-success` event is _broadcasted_, table pagination info will be
	passed as the event argument.

- **`vuetable:load-error`**

	This event will be dispatched up the parent chain *as well as* broadcast down the
	children chain when `vuetable` has received failed response from the server.

	*arguments:*
	- When `load-error` event is _dispatched_ and _broadcasted_, the response from
	the server will be passed as the event argument.

- **`vuetable:loaded`**

	This event will be dispatched up the parent chain **after** `vuetable` got response
	back from the server. This event does not indicate whether the request was successful
	or failed. It just indicates that the request is fnished and it got the response back.

	This is useful for ending/hiding the loading image.

	*arguments:* This event does not pass any argument.

- **`vuetable-pagination:change-page`**

	This event will be dispatched up the chain **from** `vuetable-pagination` component
	**when** the user click on `vuetable-pagination` component to request for the page change.

	This allows `vuetable` to trigger a new data request from the server.

	If you make a new `vuetable-pagination` component, you must use this event to notify
	`vuetable` to allow it to handle the action.

	*arguments:* This event pass the new `page` number/phrase as the event argument.

<a id="dataformat"></a>
## Data Format (JSON)
The default data format is as follow, but you can always provide
the path to the `data` and `pagination` in your data structure instead
using `dataPath` and `paginationPath` option.
```json
{
	"links": {
		"pagination": {
			"total": 50,
			"per_page": 15,
			"current_page": 1,
			"last_page": 4,
			"from": 1,
			"to": 15,
		}
	},
	"data": [
		{
			"id": 1,
			"name": "xxxxxxxxx",
			"nickname": "xxxxxxx",
			"email": "xxx@xxx.xxx",
			"birthdate": "xxxx-xx-xx",
			"gender": "X",
			"group_id": 1,
		}
			.
			.
			.
		{
			"id": 50,
			"name": "xxxxxxxxx",
			"nickname": "xxxxxxx",
			"email": "xxx@xxx.xxx",
			"birthdate": "xxxx-xx-xx",
			"gender": "X",
			"group_id": 3,
		}
	]
}
```
If you're familiar with [Laravel](https://laravel.com), you would know that Laravel automatically
convert the query data to JSON format when Eloquent objects are returned from application's routes
or controllers. And if you use `paginate()` function, the result would look something like this.

```json
{
	"total": 50,
	"per_page": 15,
	"current_page": 1,
	"last_page": 4,
	"from": 1,
	"to": 15,
	"data": [
		{
			"id": 1,
			"name": "xxxxxxxxx",
			"nickname": "xxxxxxx",
			"email": "xxx@xxx.xxx",
			"birthdate": "xxxx-xx-xx",
			"gender": "X",
			"group_id": 1,
		}
			.
			.
			.
		{
			"id": 50,
			"name": "xxxxxxxxx",
			"nickname": "xxxxxxx",
			"email": "xxx@xxx.xxx",
			"birthdate": "xxxx-xx-xx",
			"gender": "X",
			"group_id": 3,
		}
	]
}
```
In this case, you just specify values for `dataPath` and `paginationPath` like following
```html
	<div id="app">
	    <vuetable
	        api-url="/api/users"
	        :fields="columns"
	        data-path="data"
	        pagination-path=""
	    ></vuetable>
    </div>
```
This tells `vuetable` that the data is in the path name `data` inside the JSON structure
returned from the server, and the pagination is in the root of the JSON structure.

<a id="sorting"></a>
## Sorting, Paging, and Filtering of Data
`vuetable` is just a view handling the display of the data returned from the server.
It doesn't do any real operation on sorting, paging, or filtering, but using those
available information to make the view shows appropriate states according to the
information.

`vuetable` will pass through those information via query string to the server for it
to process.

For sorting, it will pass `sort=` on the query string. The value of the sort key
will be constructed from the `sortOrder.sortField` and `sortOrder.direction`, separated
by `|` character.

For paging, `vuetable` will pass `page=` on the query string. The value of the page key
is from `currentPage` property.

For page size, ...

For filtering, ...

If you are using different keys for the purpose, you can change them via `queryParams`
property like so:
```html
	<div id="app">
	    <vuetable
	        api-url="/api/users"
	        :fields="columns"
	        :query-params="{ sort: 'sortorder', page: 'pageNo', perPage: 'pagesize'}"
	    ></vuetable>
    </div>
```

<a id="appendparams"></a>
## Appending Other Parameters to the Query String
If you have other information that you would like to pass to the server during the request
of data, you can do so by putting them in the `appendParams` property.
```html
	<div id="app">
	    <vuetable
	        api-url="/api/users"
	        :fields="columns"
	        :append-params="moreParams"
	    ></vuetable>
    </div>

    <script>
		new Vue({
			el: '#app',
			data: {
				moreParams: [
					'persist=true',
					'only=Supervisor'
				]
			}
		})
    </script>
```

<a id="sampledata"></a>
## Sample Data Using Laravel
- create a new laravel project. [See here](https://laravel.com/docs/5.2/installation)
- update the migration for users table in `database/migrations/` path to look like this:

	```php
	public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('nickname');
            $table->string('email')->unique();
            $table->string('password');
            $table->date('birthdate');
            $table->char('gender');
            $table->integer('group_id')->unsigned();
            $table->rememberToken();
            $table->timestamps();
        });
    }
	```

- then, modify `App\User` factory in `database/factories/ModelFactory.php` to look like this

	```php
	$factory->define(App\User::class, function (Faker\Generator $faker) {
	    return [
	        'name' => $faker->name,
	        'nickname' => $faker->word,
	        'email' => $faker->safeEmail,
	        'password' => bcrypt(str_random(10)),
	        'remember_token' => str_random(10),
	        'birthdate' => $faker->dateTimeBetween('-30 years', 'now'),
	        'gender' => $faker->randomElement(['M', 'F']),
	        'group_id' => $faker->randomElement([1, 2, 3, 4, 5])
	    ];
	});
	```

- from the command prompt, run the migration using this command

	```php
	php artisan migrate
	```

- and still in the command prompt, run `artisan tinker` command

	```php
	php artisan tinker
	```

- when you see the prompt `>>>`, enter this command to generate fake data

	```php
	factory(App\User::class, 50)->create()
	```

- now open `app\Http\routes.php` file and replace it with the following code

	```php
	<?php

	Route::get('/api/users', function() {
		// handle sort option
	    if (request()->has('sort')) {
	        list($sortCol, $sortDir) = explode('|', request()->sort);
	        $query = App\User::orderBy($sortCol, $sortDir);
	    } else {
	        $query = App\User::orderBy('id', 'asc');
	    }

		// The headers 'Access-Control-Allow-Origin' and 'Access-Control-Allow-Methods'
		// are to allow you to call this from any domain (see CORS for more info).
		// This is for local testing only. You should not do this in production server,
		// unless you know what it means.
	    return response()->json(
	    		$query->paginate()
    		)
	    	->header('Access-Control-Allow-Origin', '*')
	    	->header('Access-Control-Allow-Methods', 'GET');
	});
	```

<a id="customize_pageinfo"></a>
## Customize the Pagination Info
By default, the pagination information displays the text "Displaying {from} to {to} of {total} items"
where the information inside the curly bracket get replaced by the pagination information returned
from the server, which are
- the starting record shown
- the end of the record shown, and
- the total number of records available

You can replace the text with whatever you want or text in *other languagues*. If the `{from}`, `{to}`, and
`{total}` are included, they will be replaced with the appropriate number in-place accordingly.

```html
    <vue-table
        api-url=""
        :fields=""
        :sort-order""
        :pagination-info-template="Showing: {from} - {to} out of {total} records"
    ></vue-table>
```

<a id="pagination_component"></a>
## Pagination Component
`vuetable` comes with two `vuetable-pagination` components
- `vuetable-pagination` (_default_), which is suitable for a small number of pages as
all the pages will listed out horizontally.
- `vuetable-pagination-dropdown`, which does not take up much space as all the pages will
put inside a dropdown for the user to select.

If you want, you can make your own pagination component to display how the pagination
would look like and interact with the user. You can see a sample in
[Using vuetable with Twitter's Bootstrap](#bootstrap) section.

`vuetable` provides a `paginationMixin` to help creating custom pagination component
an easy task. Please see the source code as it is very straight forward, but you will
need some knowledge about Vue.js.

<a id="styling"></a>
## CSS Styling
- `.vuetable`
- `.vuetable th.sortable`
- `.vuetable th.actions`
- `.vuetable-actions`
- `.vuetable-pagination`
- `.vuetable-pagination-info`
- `.vuetable-pagination-component`

<a id="bootstrap"></a>
## Using `vuetable` with Twitter's Bootstrap
If you look at the source code, you'll see that `vuetable` uses normal
`table` and `div` tags primarily. And all css styles can be overridden
via properties.

So, all you need to do is to provide Bootstrap's css like so.

```html
	<body>
		<vuetable
			api-url="http://example.app:8000/api/users"
			:fields="fields"
			:sort-order="sortOrder"
			table-class="table table-bordered table-striped table-hover"
			ascending-icon="glyphicon glyphicon-chevron-up"
			descending-icon="glyphicon glyphicon-chevron-down"
			pagination-class=""
			pagination-info-class=""
			pagination-component-class=""
			pagination-component="vuetable-pagination-bootstrap"
			:item-actions="itemActions"
		></vuetable>

        <template id="vuetable-pagination-bootstrap-template">
            <nav>
                <ul class="pagination">
                    <li class="{{isOnFirstPage ? disabledClass : ''}}">
                        <a @click="loadPage('prev')"><i class="glyphicon glyphicon-chevron-left"></i></a>
                    </li>
                    <template v-for="n in totalPage">
                        <li class="{{isCurrentPage(n+1) ? ' active' : ''}}">
                            <a @click="loadPage(n+1)"> {{ n+1 }}</a>
                        </li>
                    </template>
                    <li class="{{isOnLastPage ? disabledClass : ''}}">
                        <a @click="loadPage('next')"><i class="glyphicon glyphicon-chevron-right"></i></a>
                    </li>
                </ul>
            </nav>
        </template>
    </body>
```
In this example, we also create a new pagination component `vuetable-pagination-bootstrap` to display the
pagination in Bootstrap's style using `nav` and tells `vuetable` to use this new pagination component,
instead of the default one.

_main.js_
```javascript
	// fields definition
    var tableColumns = [
        'name',
        'email',
        {
            name: 'nickname',
            callback: 'allCap'
        },
        {
            name: 'birthdate',
            callback: 'formatDate|D/MM/Y'
        },
        {
            name: 'gender',
            sortField: 'gender',
            titleClass: 'center aligned',
            dataClass: 'center aligned',
            callback: 'gender'
        },
        {
            name: '__actions',
            dataClass: 'center aligned',
            callback: null
        }
    ]

	// create pagination component using bootstrap styling
    Vue.component('vuetable-pagination-bootstrap', {
        template: '#vuetable-pagination-bootstrap-template',
        mixins: [paginationMixin],
        methods: {
            loadPage: function(page) {
                this.$dispatch('vuetable-pagination:change-page', page)
            },
        },
    })

    new Vue({
        el: '#app',
        data: {
            fields: tableColumns,
            paginationInfoTemplate: 'แสดง {from} ถึง {to} จากทั้งหมด {total} รายการ',
            itemActions: [
                { name: 'view-item', label: '', icon: 'glyphicon glyphicon-zoom-in', class: 'btn btn-info' },
                { name: 'edit-item', label: '', icon: 'glyphicon glyphicon-pencil', class: 'btn btn-warning'},
                { name: 'delete-item', label: '', icon: 'glyphicon glyphicon-remove', class: 'btn btn-danger' }
            ]
        },
        methods: {
            /**
             * Callback functions
             */
            allCap: function(value) {
                return value.toUpperCase()
            },
            gender: function(value) {
              return value == 'M'
                ? '<span class="label label-info"><i class="glyphicon glyphicon-star"></i> Male</span>'
                : '<span class="label label-success"><i class="glyphicon glyphicon-heart"></i> Female</span>'
            },
            formatDate: function(value, fmt) {
                if (value == null) return ''
                fmt = (typeof fmt == 'undefined') ? 'D MMM YYYY' : fmt
                return moment(value, 'YYYY-MM-DD').format(fmt)
            },
            /**
             * Other functions
             */
            viewProfile: function(id) {
                window.location.href = '/staffs/profile/'+id
            }
        },
        events: {
            'vuetable:action': function(action, data) {
                console.log('vuetable:action', action, data)
            },
            'vuetable:load-error': function(response) {
            	console.log('load-error: ', response)
            }
        }
    })
```

_main.css_
```css
	<style>
        .vuetable th.sortable:hover {
            color: #2185d0;
            cursor: pointer;
        }
        .vuetable-actions {
            width: 11%;
            padding: 12px 0px;
            text-align: center;
        }
        .vuetable-actions > button {
          padding: 3px 6px;
          margin-right: 4px;
        }
        .vuetable-pagination {
        }
        .vuetable-pagination-info {
            float: left;
            margin-top: auto;
            margin-bottom: auto;
        }
        ul.pagination {
          margin: 0px;
        }
        .vuetable-pagination-component {
          float: right;
        }
    </style>
```
![image](http://s27.postimg.org/nuhdrrkhv/bootstrap.jpg)

<a id="license"></a>
## License
`vuetable` is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).