<template>
    <div class="{{wrapperClass}}">
        <table class="vuetable {{tableClass}}">
            <thead>
                <tr>
                    <template v-for="field in fields">
                        <template v-if="field.visible">
                            <template v-if="isSpecialField(field.name)">
                                <th v-if="extractName(field.name) == '__checkbox'" class="{{field.titleClass || ''}}">
                                    <input type="checkbox" @change="toggleAllCheckboxes($event.target.checked, field.name)">
                                </th>
                                <th v-if="extractName(field.name) == '__component'"
                                    @click="orderBy(field, $event)"
                                    class="{{field.titleClass || ''}} {{isSortable(field) ? 'sortable' : ''}}">
                                    {{field.title || ''}}
                                    <i v-if="isCurrentSortField(field) && field.title"
                                       class="{{ sortIcon(field) }}"
                                       v-bind:style="{opacity: sortIconOpacity(field)}"></i>
                                </th>
                                <th v-if="notIn(extractName(field.name), ['__checkbox', '__component'])"
                                    id="{{field.name}}" class="{{field.titleClass || ''}}">
                                    {{field.title || ''}}
                                </th>
                            </template>
                            <template v-else>
                                <th @click="orderBy(field, $event)"
                                    id="_{{field.name}}"
                                    class="{{field.titleClass || ''}} {{isSortable(field) ? 'sortable' : ''}}">
                                    {{getTitle(field) | capitalize}}&nbsp;
                                    <i v-if="isCurrentSortField(field)" class="{{ sortIcon(field) }}" v-bind:style="{opacity: sortIconOpacity(field)}"></i>
                                </th>
                            </template>
                        </template>
                    </template>
                </tr>
            </thead>
            <tbody v-cloak>
                <template v-for="(itemNumber, item) in tableData">
                    <tr @click="onRowClicked(item, $event)" :render="onRowChanged(item)" :class="onRowClass(item, itemNumber)">
                        <template v-for="field in fields">
                            <template v-if="field.visible">
                                <template v-if="isSpecialField(field.name)">
                                    <td v-if="extractName(field.name) == '__sequence'" class="vuetable-sequence {{field.dataClass}}"
                                        v-html="tablePagination.from + itemNumber">
                                    </td>
                                    <td v-if="extractName(field.name) == '__checkbox'" class="vuetable-checkboxes {{field.dataClass}}">
                                        <input type="checkbox"
                                            @change="toggleCheckbox($event.target.checked, item, field.name)"
                                            :checked="isSelectedRow(item, field.name)">
                                    </td>
                                    <td v-if="field.name == '__actions'" class="vuetable-actions {{field.dataClass}}">
                                        <template v-for="action in itemActions">
                                            <button class="{{ action.class }}" @click="callAction(action.name, item)" v-attr="action.extra">
                                                <i class="{{ action.icon }}"></i> {{ action.label }}
                                            </button>
                                        </template>
                                    </td>
                                    <td v-if="extractName(field.name) == '__component'" class="{{field.dataClass}}">
                                        <component :is="extractArgs(field.name)" :row-data="item"></component>
                                    </td>
                                </template>
                                <template v-else>
                                    <td v-if="hasCallback(field)" class="{{field.dataClass}}" @click="onCellClicked(item, field, $event)" @dblclick="onCellDoubleClicked(item, field, $event)">
                                        {{{ callCallback(field, item) }}}
                                    </td>
                                    <td v-else class="{{field.dataClass}}" @click="onCellClicked(item, field, $event)" @dblclick="onCellDoubleClicked(item, field, $event)">
                                        {{{ getObjectValue(item, field.name, "") }}}
                                    </td>
                                </template>
                            </template>
                        </template>
                    </tr>
                    <template v-if="useDetailRow">
                      <template v-if="useDetailRowComponent">
                        <tr v-if="isVisibleDetailRow(item[detailRowId])"
                          @click="onDetailRowClick(item, $event)"
                          :transition="detailRowTransition"
                          :class="[detailRowClass]"
                        >
                          <td :colspan="countVisibleFields">
                            <component :is="detailRowComponent" :row-data="item"></component>
                          </td>
                        </tr>
                      </template>
                      <template v-else>
                        <tr v-if="isVisibleDetailRow(item[detailRowId])"
                          v-html="callDetailRowCallback(item)"
                          @click="onDetailRowClick(item, $event)"
                          :transition="detailRowTransition"
                          :class="[detailRowClass]"
                        ></tr>
                      </template>
                    </template>
                </template>
            </tbody>
        </table>
        <div v-if="showPagination" class="vuetable-pagination {{paginationClass}}">
            <div class="vuetable-pagination-info {{paginationInfoClass}}"
                 v-html="paginationInfo">
            </div>
            <div v-show="tablePagination && tablePagination.last_page > 1"
                class="vuetable-pagination-component {{paginationComponentClass}}">
                <component v-ref:pagination :is="paginationComponent"></component>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        wrapperClass: {
            type: String,
            default: function() {
                return null
            }
        },
        tableWrapper: {
            type: String,
            default: function() {
                return null
            }
        },
        tableClass: {
            type: String,
            default: function() {
                return 'ui blue striped selectable celled stackable attached table'
            }
        },
        loadingClass: {
            type: String,
            default: function() {
                return 'loading'
            }
        },
        dataPath: {
            type: String,
            default: function() {
                return 'data'
            }
        },
        paginationPath: {
            type: String,
            default: function() {
                return 'links.pagination'
            }
        },
        fields: {
            type: Array,
            required: true
        },
        apiUrl: {
            type: String,
            required: true
        },
        sortOrder: {
            type: Array,
            default: function() {
                return [];
            }
        },
        multiSort: {
            type: Boolean,
            default: function() {
                return false
            }
        },
        /*
         * physical key that will trigger multi-sort option
         * possible values: 'alt', 'ctrl', 'meta', 'shift'
         * 'ctrl' might not work as expected on Mac
         */
        multiSortKey: {
            type: String,
            default: 'alt'
        },
        perPage: {
            type: Number,
            coerce: function(val) {
                return parseInt(val)
            },
            default: function() {
                return 10
            }
        },
        ascendingIcon: {
            type: String,
            default: function() {
                return 'blue chevron up icon'
            }
        },
        descendingIcon: {
            type: String,
            default: function() {
                return 'blue chevron down icon'
            }
        },
        appendParams: {
            type: Array,
            default: function() {
                return []
            }
        },
        showPagination: {
            type: Boolean,
            default: function() {
                return true
            }
        },
        paginationComponent: {
            type: String,
            default: function() {
                return 'vuetable-pagination'
            }
        },
        paginationInfoTemplate: {
            type: String,
            default: function() {
                return "Displaying {from} to {to} of {total} items"
            }
        },
        paginationInfoNoDataTemplate: {
            type: String,
            default: function() {
                return 'No relevant data'
            }
        },
        paginationClass: {
            type: String,
            default: function() {
                return 'ui bottom attached segment grid'
            }
        },
        paginationInfoClass: {
            type: String,
            default: function() {
                return 'left floated left aligned six wide column'
            }
        },
        paginationComponentClass: {
            type: String,
            default: function() {
                return 'right floated right aligned six wide column'
            }
        },
        paginationConfig: {
            type: String,
            default: function() {
                return 'paginationConfig'
            }
        },
        paginationConfigCallback: {
            type: String,
            default: function() {
                return 'paginationConfig'
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
            type: Boolean,
            default: function() {
                return true
            }
        },
        selectedTo: {
            type: Array,
            default: function() {
                return []
            }
        },
        httpData: {
            type: Object,
            default: function() {
                return {}
            }
        },
        httpOptions: {
            type: Object,
            default: function() {
                return {}
            }
        },
        detailRow: {
            type: String,
            default: ''
        },
        detailRowCallback: {
            type: String,
            default: ''
        },
        detailRowId: {
            type: String,
            default: 'id'
        },
        detailRowTransition: {
            type: String,
            default: ''
        },
        detailRowClass: {
            type: String,
            default: 'vuetable-detail-row'
        },
        detailRowComponent: {
            type: String,
            default: ''
        },
        rowClassCallback: {
            type: String,
            default: ''
        }
    },
    data: function() {
        return {
            eventPrefix: 'vuetable:',
            tableData: null,
            tablePagination: null,
            currentPage: 1,
            visibleDetailRows: []
        }
    },
    directives: {
        'attr': {
            update: function(value) {
                for (var i in value) {
                    this.el.setAttribute(i, value[i])
                }
            }
        },
    },
    computed: {
        paginationInfo: function() {
            if (this.tablePagination == null || this.tablePagination.total == 0) {
                return this.paginationInfoNoDataTemplate
            }

            return this.paginationInfoTemplate
                .replace('{from}', this.tablePagination.from || 0)
                .replace('{to}', this.tablePagination.to || 0)
                .replace('{total}', this.tablePagination.total || 0)
        },
        useDetailRow: function() {
            if (this.tableData && typeof this.tableData[0][this.detailRowId] === 'undefined') {
                console.warn('You need to define "detail-row-id" in order for detail-row feature to work!')
                return false
            }

            return this.detailRowCallback.trim() !== '' || this.detailRowComponent !== ''
        },
        useDetailRowComponent: function() {
            return this.detailRowComponent !== ''
        },
        countVisibleFields: function() {
            return this.fields.filter(function (field) {
                return field.visible
            }).length
        }
    },
    methods: {
        normalizeFields: function() {
            var self = this
            var obj
            this.fields.forEach(function(field, i) {
                if (typeof (field) === 'string') {
                    obj = {
                        name: field,
                        title: self.setTitle(field),
                        titleClass: '',
                        dataClass: '',
                        callback: null,
                        visible: true
                    }
                } else {
                    obj = {
                        name: field.name,
                        title: (field.title === undefined) ? self.setTitle(field.name) : field.title,
                        sortField: field.sortField,
                        titleClass: (field.titleClass === undefined) ? '' : field.titleClass,
                        dataClass: (field.dataClass === undefined) ? '' : field.dataClass,
                        callback: (field.callback === undefined) ? '' : field.callback,
                        visible: (field.visible === undefined) ? true : field.visible
                    }
                }
                self.fields.$set(i, obj)
            })
        },
        setTitle: function(str) {
            if (this.isSpecialField(str)) {
                return ''
            }

            return this.titleCase(str)
        },
        titleCase: function(str)
        {
            return str.replace(/\w+/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            })
        },
        notIn: function(str, arr) {
            return arr.indexOf(str) === -1
        },
        loadData: function() {
            var self = this

            var wrapper = document.querySelector(this.tableWrapper)
            this.showLoadingAnimation(wrapper)

            var url = this.apiUrl + '?' + this.getAllQueryParams()
            this.$http.get(url, this.httpData, this.httpOptions)
                .then(function(response) {
                    self.tableData = self.getObjectValue(response.data, self.dataPath, null)
                    self.tablePagination = self.getObjectValue(response.data, self.paginationPath, null)
                    if (self.tablePagination === null) {
                        console.warn('vuetable: pagination-path "' + self.paginationPath + '" not found. '
                            + 'It looks like the data returned from the sever does not have pagination information '
                            + 'or you may have set it incorrectly.'
                        )
                    }

                    self.$nextTick(function() {
                        self.dispatchEvent('load-success', response)
                        self.broadcastEvent('load-success', self.tablePagination)

                        self.hideLoadingAnimation(wrapper)
                    })
                }, function(response) {
                    self.dispatchEvent('load-error', response)
                    self.broadcastEvent('load-error', response)

                    self.hideLoadingAnimation(wrapper)
                })
        },
        getAllQueryParams: function() {
            var params = [
                this.queryParams.sort + '=' + this.getSortParam(),
                this.queryParams.page + '=' + this.currentPage,
                this.queryParams.perPage + '=' + this.perPage
            ].join('&')

            if (this.appendParams.length > 0) {
                params += '&'+this.appendParams.join('&')
            }

            return params
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

            if (typeof this.$parent['getSortParam'] == 'function') {
                return this.$parent['getSortParam'].call(this.$parent, this.sortOrder)
            }

            return this.getDefaultSortParam()
        },
        getDefaultSortParam: function() {
            var result = '';

            for(var i=0; i<this.sortOrder.length; i++){
                var fieldName = (typeof this.sortOrder[i].sortField === 'undefined')
                    ? this.sortOrder[i].field
                    : this.sortOrder[i].sortField;

                result += fieldName +'|' + this.sortOrder[i].direction + ((i+1)<this.sortOrder.length ? ',' : '');
            }

            return result;
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
        orderBy: function(field, event) {
            if ( ! this.isSortable(field)) {
                return
            }

            var key = this.multiSortKey.toLowerCase() + 'Key'

            if (this.multiSort && event[key]){ //adding column to multisort
                var i = this.currentSortOrder(field);

                if(i === false){ //this field is not in the sort array yet
                    this.sortOrder.push({
                        field: field.name,
                        direction: 'asc'
                    });
                } else { //this field is in the sort array, now we change its state
                    if(this.sortOrder[i].direction == 'asc'){
                        // switch direction
                        this.sortOrder[i].direction = 'desc'
                    } else {
                        //remove sort condition
                        this.sortOrder.splice(i, 1);
                    }
                }
            } else { //no multisort, or resetting sort
                if (this.sortOrder.length == 0){
                    this.sortOrder.push({
                        field: '',
                        direction: 'asc'
                    });
                }

                this.sortOrder.splice(1); //removes additional columns

                if (this.sortOrder[0].field == field.name) {
                    // change sort direction
                    this.sortOrder[0].direction = this.sortOrder[0].direction == 'asc' ? 'desc' : 'asc'
                } else {
                    // reset sort direction
                    this.sortOrder[0].direction = 'asc'
                }
                this.sortOrder[0].field = field.name
                this.sortOrder[0].sortField = field.sortField
            }


            this.currentPage = 1    // reset page index
            this.loadData()
        },
        isSortable: function(field) {
            return !(typeof field.sortField == 'undefined')
        },
        isCurrentSortField: function(field) {
            return this.currentSortOrder(field) !== false;
        },
        currentSortOrder: function(field){
            if (!this.isSortable(field)) {
                return false
            }

            for(var i = 0; i<this.sortOrder.length; i++){
                if(this.sortOrder[i].field == field.name){
                    return i;
                }
            }

            return false;
        },
        sortIcon: function(field) {
            var i = this.currentSortOrder(field);
            if (i !== false){
                return this.sortOrder[i].direction == 'asc' ?
                    this.ascendingIcon :
                    this.descendingIcon;
            } else {
                return '';
            }
        },
        sortIconOpacity: function(field) {
            //fields with stronger precedence have darker color

            //if there are few fields, we go down by 0.3
            //ex. 2 fields are selected: 1.0, 0.7

            //if there are more we go down evenly on the given spectrum
            //ex. 6 fields are selected: 1.0, 0.86, 0.72, 0.58, 0.44, 0.3

            var max = 1.0;
            var min = 0.3;
            var step = 0.3;

            var count = this.sortOrder.length;
            var current = this.currentSortOrder(field);


            if(max - count*step < min){
               step = (max - min) / (count-1);
            }

            var opacity = max - current*step;

            return opacity;
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
            // return fieldName.startsWith('__')
            return fieldName.slice(0, 2) === '__'
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
                    if (obj !== null && typeof obj[key] != 'undefined' && obj[key] !== null) {
                        obj = obj[key]
                    } else {
                        obj = defaultValue
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
        toggleCheckbox: function(isChecked, dataItem, fieldName) {
            var idColumn = this.extractArgs(fieldName)
            if (idColumn === undefined) {
                console.warn('You did not provide reference id column with "__checkbox:<column_name>" field!')
                return
            }
            if (isChecked) {
                this.selectedTo.push(dataItem[idColumn])
            } else {
                this.selectedTo.$remove(dataItem[idColumn])
            }
        },
        toggleAllCheckboxes: function(isChecked, fieldName) {
            var self = this
            var idColumn = this.extractArgs(fieldName)

            if (isChecked) {
                this.tableData.forEach(function(dataItem) {
                    if ( ! self.isSelectedRow(dataItem, fieldName)) {
                        self.selectedTo.push(dataItem[idColumn])
                    }
                })
            } else {
                this.tableData.forEach(function(dataItem) {
                    self.selectedTo.$remove(dataItem[idColumn])
                })
            }
        },
        isSelectedRow: function(dataItem, fieldName) {
            return this.selectedTo.indexOf(dataItem[this.extractArgs(fieldName)]) >= 0
        },
        extractName: function(string) {
            return string.split(':')[0].trim()
        },
        extractArgs: function(string) {
            return string.split(':')[1]
        },
        callDetailRowCallback: function(item) {
            var func = this.detailRowCallback.trim()
            if (func === '') {
                return ''
            }

            if (typeof this.$parent[func] == 'function') {
                return this.$parent[func].call(this.$parent, item)
            } else {
                console.error('Function "'+func+'()" does not exist!')
            }
        },
        isVisibleDetailRow: function(rowId) {
            return this.visibleDetailRows.indexOf( rowId ) >= 0
        },
        showDetailRow: function(rowId) {
            if (!this.isVisibleDetailRow(rowId)) {
                this.visibleDetailRows.push(rowId)
            }
        },
        hideDetailRow: function(rowId) {
            if (this.isVisibleDetailRow(rowId)) {
                this.visibleDetailRows.$remove(rowId)
            }
        },
        toggleDetailRow: function(rowId) {
            if (this.isVisibleDetailRow(rowId)) {
                this.hideDetailRow(rowId)
            } else {
                this.showDetailRow(rowId)
            }
        },
        onRowClass: function(dataItem, index) {
            var func = this.rowClassCallback.trim()

            if (func !== '' && typeof this.$parent[func] === 'function') {
                return this.$parent[func].call(this.$parent, dataItem, index)
            }
            return ''
        },
        onRowChanged: function(dataItem) {
            this.dispatchEvent('row-changed', dataItem)
            return true
        },
        onRowClicked: function(dataItem, event) {
            this.$dispatch(this.eventPrefix+'row-clicked', dataItem, event)
            return true
        },
        onCellClicked: function(dataItem, field, event) {
            this.$dispatch(this.eventPrefix+'cell-clicked', dataItem, field, event)
        },
        onCellDoubleClicked: function(dataItem, field, event) {
            this.$dispatch(this.eventPrefix+'cell-dblclicked', dataItem, field, event)
        },
        onDetailRowClick: function(dataItem, event) {
            this.$dispatch(this.eventPrefix+'detail-row-clicked', dataItem, event)
        },
        callPaginationConfig: function() {
            if (typeof this.$parent[this.paginationConfigCallback] === 'function') {
                this.$parent[this.paginationConfigCallback].call(this.$parent, this.$refs.pagination.$options.name)
            }
        },
        logDeprecatedMessage: function(name, replacer) {
            var msg = '"{name}" prop is being deprecated and will be removed in the future. Please use "{replacer}" instead.'
            console.warn(msg.replace('{name}', name).replace('{replacer}', replacer))
        },
        checkForDeprecatedProps: function() {
            if (this.paginationConfig !== 'paginationConfig') {
                this.logDeprecatedMessage('paginationConfig', 'paginationConfigCallback')
            }
            if (this.detailRow !== '') {
                this.logDeprecatedMessage('detail-row', 'detail-row-callback')
            }
            if (this.detailRowCallback !== '') {
                this.logDeprecatedMessage('detail-row-callback', 'detail-row-component')
            }
        }
    },
    watch: {
        'multiSort': function(newVal, oldVal){
            if (newVal === false && this.sortOrder.length > 1) {
                this.sortOrder.splice(1);
                this.loadData();
            }
        }
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
        'vuetable:set-options': function(options) {
            for (var n in options) {
                this.$set(n, options[n])
            }
        },
        'vuetable:toggle-detail': function(dataItem) {
            this.toggleDetailRow(dataItem)
        },
        'vuetable:show-detail': function(dataItem) {
            this.showDetailRow(dataItem)
        },
        'vuetable:hide-detail': function(dataItem) {
            this.hideDetailRow(dataItem)
        }
    },
    created: function() {
        this.checkForDeprecatedProps()
        this.normalizeFields()
        if (this.loadOnStart) {
            this.loadData()
        }
        this.$nextTick(function() {
            this.callPaginationConfig()
        })
    }
}
</script>

<style>
    .vuetable th.sortable:hover {
      color: #2185d0;
      cursor: pointer;
    }
    .vuetable-actions {
      width: 15%;
      padding: 12px 0px;
      text-align: center;
    }
    .vuetable-pagination {
      background: #f9fafb !important;
    }
    .vuetable-pagination-info {
      margin-top: auto;
      margin-bottom: auto;
    }
</style>
