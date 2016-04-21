/*
 * vue-table.js v1.0.6
 * (c) 2016 Rati Wannapanop
 * Released under the MIT License.
 */

/**
 * Pagination Mixin
 */
var paginationMixin = {
    props: {
        'wrapperClass': {
            type: String,
            default: function() {
                return 'ui right floated pagination menu'
            }
        },
        'disabledClass': {
            type: String,
            default: function() {
                return 'disabled'
            }
        },
        'pageClass': {
            type: String,
            default: function() {
                return 'item'
            }
        },
        'linkClass': {
            type: String,
            default: function() {
                return 'icon item'
            }
        },
        'icons': {
            type: Object,
            default: function() {
                return {
                    prev: 'left chevron icon',
                    next: 'right chevron icon'
                }
            }
        }
    },
    data: function() {
        return {
            tablePagination: null
        }
    },
    computed: {
        totalPage: function() {
            return this.tablePagination == null
                ? 0
                : this.tablePagination.last_page
        },
        isOnFirstPage: function() {
            return this.tablePagination == null
                ? false
                : this.tablePagination.current_page == 1
        },
        isOnLastPage: function() {
            return this.tablePagination == null
                ? false
                : this.tablePagination.current_page == this.tablePagination.last_page
        },
    },
    methods: {
        loadPage: function(page) {
            this.$dispatch('vuetable-pagination:change-page', page)
        },
        isCurrentPage: function(page) {
            return page == this.tablePagination.current_page
        }
    },
    events: {
        'vuetable:load-success': function(tablePagination) {
            this.tablePagination = tablePagination
        }
    },
}

/**
 * Vuejs component
 *  */
Vue.component('vuetable-pagination', {
    template:
        '<div class="{{wrapperClass}}">'
            + ' <a @click="loadPage(\'prev\')"'
                + ' class="{{linkClass}} {{isOnFirstPage ? disabledClass : \'\'}}">'
                    + ' <i :class="icons.prev"></i>'
            + ' </a>'
            + ' <template v-for="n in totalPage">'
                + ' <a @click="loadPage(n+1)"'
                   + ' class="{{pageClass}} {{isCurrentPage(n+1) ? disabledClass : \'\'}}">'
                        + ' {{ n+1 }}'
                + ' </a>'
            + ' </template>'
            + ' <a @click="loadPage(\'next\')"'
                + ' class="{{linkClass}} {{isOnLastPage ? disabledClass : \'\'}}">'
                + ' <i :class="icons.next"></i>'
            + ' </a>'
        + ' </div>',
    mixins: [paginationMixin],
})

Vue.component('vuetable-pagination-dropdown', {
    template:
        '<div class="{{wrapperClass}}">'
            + '<a @click="loadPage(\'prev\')"'
                + ' class="{{linkClass}} {{isOnFirstPage ? disabledClass : \'\'}}">'
                + '<i :class="icons.prev"></i>'
            + '</a>'
            + '<select id="vuetable-pagination-dropdown" class="ui search dropdown" @change="selectPage($event)">'
                + '<template v-for="n in totalPage">'
                    + '<option class="{{pageClass}}" value="{{n+1}}">'
                        + 'Page {{n+1}}'
                    + '</option>'
                + '</template>'
            + '</select>'
            + '<a @click="loadPage(\'next\')"'
                + ' class="{{linkClass}} {{isOnLastPage ? disabledClass : \'\'}}">'
                + '<i :class="icons.next"></i>'
            + '</a>'
        + '</div>',
    mixins: [paginationMixin],
    methods: {
        loadPage: function(page) {
            // update dropdown value
            if (page == 'prev' && !this.isOnFirstPage) {
                this.setDropdownToPage(this.tablePagination.current_page-1)
            } else if (page == 'next' && !this.isOnLastPage) {
                this.setDropdownToPage(this.tablePagination.current_page+1)
            }

            this.$dispatch('vuetable-pagination:change-page', page)
        },
        setDropdownToPage: function(page) {
            document.getElementById('vuetable-pagination-dropdown').value = page
        },
        selectPage: function(event) {
            this.$dispatch('vuetable-pagination:change-page', event.target.selectedIndex+1)
        },
    },
    events: {
        'vuetable:load-success': function(tablePagination) {
            this.tablePagination = tablePagination
            this.setDropdownToPage(tablePagination.current_page)
        }
    },
})

Vue.component('vuetable', {
    template:
        '<div class="{{wrapperClass}}">'
        + '<table class="vuetable {{tableClass}}">'
            + '<thead>'
                + '<tr>'
                    + '<template v-for="field in fields">'
                        + '<th v-if="isSpecialField(field.name)" class="{{field.titleClass || \'\'}}">'
                            + '{{field.title || \'\'}}'
                        + '</th>'
                        + '<th v-else'
                            + ' @click="orderBy(field)"'
                            + ' class="{{field.titleClass || \'\'}} {{isSortable(field) ? \'sortable\' : \'\'}}">'
                            + ' {{getTitle(field) | capitalize}} <i v-if="isCurrentSortField(field)" class="{{ sortIcon }}"></i>'
                        + '</th>'
                    + '</template>'
                + '</tr>'
            + '</thead>'
            + '<tbody v-cloak>'
                + '<tr v-for="item in tableData">'
                    + '<template v-for="field in fields">'
                        + '<template v-if="isSpecialField(field.name)">'
                            + '<td v-if="field.name == \'__actions\'" class="vuetable-actions {{field.dataClass}}">'
                                + '<template v-for="action in itemActions">'
                                    + '<button class="{{ action.class }}" @click="callAction(action.name, item)">'
                                        + '<i class="{{ action.icon }}"></i> {{ action.label }}'
                                    + '</button>'
                                + '</template>'
                            + '</td>'
                        + '</template>'
                        + '<template v-else>'
                            + '<td v-if="hasCallback(field)" class="{{field.dataClass}}">'
                                + '{{{ callCallback(field, item) }}}'
                            + '</td>'
                            + '<td v-else class="{{field.dataClass}}">'
                                + '{{ getObjectValue(item, field.name, "") }}'
                            + '</td>'
                        + '</template>'
                    + '</template>'
                + '</tr>'
            + '</tbody>'
        + '</table>'
        + '<div v-if="showPagination" class="vuetable-pagination {{paginationClass}}">'
            + '<div class="vuetable-pagination-info {{paginationInfoClass}}">'
                + '{{ paginationInfo }}'
            + '</div>'
            + '<div v-show="tablePagination && tablePagination.total > 0" class="vuetable-pagination-component {{paginationComponentClass}}">'
                + '<component :is="paginationComponent"/>'
            + '</div>'
        + '</div>'
        + '</div>',
    props: {
        'wrapperClass': {
            type: String,
            default: function() {
                return null
            }
        },
        'tableWrapper': {
            type: String,
            default: function() {
                return null
            }
        },
        'tableClass': {
            type: String,
            default: function() {
                return 'ui blue striped selectable celled stackable attached table'
            }
        },
        'loadingClass': {
            type: String,
            default: function() {
                return 'loading'
            }
        },
        'dataPath': {
            type: String,
            default: function() {
                return 'data'
            }
        },
        'paginationPath': {
            type: String,
            default: function() {
                return 'links.pagination'
            }
        },
        'fields': {
            type: Array,
            required: true
        },
        'apiUrl': {
            type: String,
            required: true
        },
        'sortOrder': {
            type: Object,
            default: function() {
                return {
                    field: '',
                    direction: 'asc'
                }
            }
        },
        'perPage': {
            type: Number,
            default: function() {
                return 10
            }
        },
        'ascendingIcon': {
            type: String,
            default: function() {
                return 'blue chevron up icon'
            }
        },
        'descendingIcon': {
            type: String,
            default: function() {
                return 'blue chevron down icon'
            }
        },
        'appendParams': {
            type: Array,
            default: function() {
                return []
            }
        },
        'showPagination': {
            type: Boolean,
            default: function() {
                return true
            }
        },
        'paginationComponent': {
            type: String,
            default: function() {
                return 'vuetable-pagination'
            }
        },
        'paginationInfoTemplate': {
            type: String,
            default: function() {
                return "Displaying {from} to {to} of {total} items"
            }
        },
        'paginationInfoNoDataTemplate': {
            type: String,
            default: function() {
                return 'No relevant data'
            }
        },
        'paginationClass': {
            type: String,
            default: function() {
                return 'ui bottom attached segment grid'
            }
        },
        'paginationInfoClass': {
            type: String,
            default: function() {
                return 'left floated left aligned six wide column'
            }
        },
        'paginationComponentClass': {
            type: String,
            default: function() {
                return 'right floated right aligned six wide column'
            }
        },
        itemActions: {
            type: Array,
            default: function() {
                return []
            }
        },
        queryParams: {
            type: Object,
            default: function() {
                return {
                    sort: 'sort',
                    page: 'page',
                    perPage: 'per_page'
                }
            }
        },
        loadOnStart: {
            type: String,
            default: function() {
                return 'true'
            }
        },
    },
    data: function() {
        return {
            eventPrefix: 'vuetable:',
            tableData: null,
            tablePagination: null,
            currentPage: 1
        }
    },
    computed: {
        sortIcon: function() {
            return this.sortOrder.direction == 'asc' ? this.ascendingIcon : this.descendingIcon
        },
        paginationInfo: function() {
            if (this.tablePagination == null || this.tablePagination.total == 0) {
                return this.paginationInfoNoDataTemplate
            }

            return this.paginationInfoTemplate
                .replace('{from}', this.tablePagination.from || 0)
                .replace('{to}', this.tablePagination.to || 0)
                .replace('{total}', this.tablePagination.total || 0)
        },
    },
    methods: {
        normalizeFields: function() {
            var normalized = []
            this.fields.forEach(function(field, i) {
                if (typeof (field) === 'string') {
                    normalized[i] = { name: field }
                } else {
                    normalized[i] = field
                }
            })
            this.fields = normalized
        },
        loadData: function() {
            var wrapper = document.querySelector(this.tableWrapper)
            this.showLoadingAnimation(wrapper)

            var params = [
                this.queryParams.sort+'='+ this.getSortParam(),
                this.queryParams.page+'='+this.currentPage,
                this.queryParams.perPage+'='+this.perPage
            ]
            var url = this.apiUrl + '?' + params.join('&')
            if (this.appendParams.length > 0) {
                url += '&'+this.appendParams.join('&')
            }
            this.$http.get(url)
                .then(function(response) {
                    this.tableData = this.getObjectValue(response.data, this.dataPath, null)
                    this.tablePagination = this.getObjectValue(response.data, this.paginationPath, null)
                    this.dispatchEvent('load-success', response)
                    this.broadcastEvent('load-success', this.tablePagination)

                    this.hideLoadingAnimation(wrapper)
                }, function(response) {
                    this.dispatchEvent('load-error', response)
                    this.broadcastEvent('load-error', response)

                    this.hideLoadingAnimation(wrapper)
                })
        },
        showLoadingAnimation: function(wrapper) {
            if (wrapper !== null) {
                this.addClass(wrapper, this.loadingClass)
            }
            this.dispatchEvent('loading')
        },
        hideLoadingAnimation: function(wrapper) {
            if (wrapper !== null) {
                this.removeClass(wrapper, this.loadingClass)
            }
            this.dispatchEvent('loaded')
        },
        getTitle: function(field) {
            if (typeof field.title === 'undefined') {
                return field.name.replace('.', ' ')
            }
            return field.title
        },
        getSortParam: function() {
            if (!this.sortOrder || this.sortOrder.field == '') {
                return ''
            }

            var fieldName = (typeof this.sortOrder.sortField === 'undefined')
                ? this.sortOrder.field
                : this.sortOrder.sortField

            return fieldName +'|' + this.sortOrder.direction
        },
        addClass: function(el, className) {
            if (el.classList)
              el.classList.add(className)
            else
              el.className += ' ' + className
        },
        removeClass: function(el, className) {
            if (el.classList)
              el.classList.remove(className)
            else
              el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
        },
        dispatchEvent: function(eventName, args) {
            this.$dispatch(this.eventPrefix + eventName, args)
        },
        broadcastEvent: function(eventName, args) {
            this.$broadcast(this.eventPrefix + eventName, args)
        },
        orderBy: function(field) {
            if ( ! this.isSortable(field)) {
                return
            }

            if (this.sortOrder.field == field.name) {
                // change sort direction
                this.sortOrder.direction = this.sortOrder.direction == 'asc' ? 'desc' : 'asc'
            } else {
                // reset sort direction
                this.sortOrder.direction = 'asc'
            }
            this.sortOrder.field = field.name
            this.sortOrder.sortField = field.sortField
            this.currentPage = 1    // reset page index
            this.loadData();
        },
        isSortable: function(field) {
            return !(typeof field.sortField == 'undefined')
        },
        isCurrentSortField: function(field) {
            if (!this.isSortable(field)) {
                return false
            }

            return this.sortOrder.field == field.name
        },
        gotoPreviousPage: function() {
            if (this.currentPage > 1) {
                this.currentPage--
                this.loadData()
            }
        },
        gotoNextPage: function() {
            if (this.currentPage < this.tablePagination.last_page) {
                this.currentPage++
                this.loadData()
            }
        },
        gotoPage: function(page) {
            if (page != this.currentPage && (page > 0 && page <= this.tablePagination.last_page)) {
                this.currentPage = page
                this.loadData()
            }
        },
        isSpecialField: function(fieldName) {
            return fieldName.startsWith('__')
        },
        hasCallback: function(item) {
            return item.callback ? true : false
        },
        callCallback: function(field, item) {
            if ( ! this.hasCallback(field))
                return

            var args = field.callback.split('|')
            var func = args.shift()

            if (typeof this.$parent[func] == 'function') {
                return (args.length > 0)
                    ? this.$parent[func].apply(this.$parent, [this.getObjectValue(item, field.name)].concat(args))
                    : this.$parent[func].call(this.$parent, this.getObjectValue(item, field.name))
            }

            return null
        },
        getObjectValue: function(object, path, defaultValue) {
            defaultValue = (typeof defaultValue == 'undefined') ? null : defaultValue

            var obj = object
            if (path.trim() != '') {
                var keys = path.split('.')
                keys.forEach(function(key) {
                    if (typeof obj[key] != 'undefined' && obj[key] !== null) {
                        obj = obj[key]
                    } else {
                        obj = defaultValue;
                        return
                    }
                })
            }
            return obj
        },
        callAction: function(action, data) {
            this.$dispatch(this.eventPrefix+'action', action, data)
        },
        addParam: function(param) {
            this.appendParams.push(param)
        },
    },
    events: {
        'vuetable-pagination:change-page': function(page) {
            if (page == 'prev') {
                this.gotoPreviousPage()
            } else if (page == 'next') {
                this.gotoNextPage()
            } else {
                this.gotoPage(page)
            }
        },
        'vuetable:reload': function() {
            this.loadData()
        },
        'vuetable:refresh': function() {
            this.currentPage = 1
            this.loadData()
        },
        'vuetable:goto-page': function(page) {
            this.$emit('vuetable-pagination:change-page', page)
        },
    },
    created: function() {
        this.normalizeFields()
        if (this.loadOnStart == 'true') {
            this.loadData()
        }
    }
})
