<script>
export default {
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
        },
        'vuetable-pagination:set-options': function(options) {
            for (var n in options) {
                this.$set(n, options[n])
            }
        }
    },
}
</script>