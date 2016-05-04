<template>
    <div class="{{wrapperClass}}">
        <a @click="loadPage('prev')"
             class="{{linkClass}} {{isOnFirstPage ? disabledClass : ''}}">
            <i :class="icons.prev"></i>
        </a>
        <select id="vuetable-pagination-dropdown" class="{{dropdownClass}}" @change="selectPage($event)">
            <template v-for="n in totalPage">
                <option class="{{pageClass}}" value="{{n+1}}">
                    {{pageText}} {{n+1}}
                </option>
            </template>
        </select>
        <a @click="loadPage('next')"
             class="{{linkClass}} {{isOnLastPage ? disabledClass : ''}}">
            <i :class="icons.next"></i>
        </a>
    </div>
</template>

<script>
import PaginationMixin from './VuetablePaginationMixin.vue'

export default {
    mixins: [PaginationMixin],
    props: {
        'dropdownClass': {
            type: String,
            default: function() {
                return 'ui search dropdown'
            }
        },
        'pageText': {
            type: String,
            default: function() {
                return 'Page'
            }
        }
    },
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
            this.$nextTick(function() {
                document.getElementById('vuetable-pagination-dropdown').value = page
            })
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
    }
}
</script>