<template>
    <div class="vuetable-pagination-slider {{wrapperClass}}">
         <a @click="loadPage(1)"
             class="btn-nav {{linkClass}} {{isOnFirstPage ? disabledClass : ''}}">
                 <i v-if="icons.first != ''" class="{{icons.first}}"></i>
                 <span v-else>&laquo;</span>
         </a>
         <a @click="loadPage('prev')"
             class="btn-nav {{linkClass}} {{isOnFirstPage ? disabledClass : ''}}">
                 <i v-if="icons.next != ''" class="{{icons.prev}}"></i>
                 <span v-else>&nbsp;&lsaquo;</span>
         </a>
         <template v-if="notEnoughPages">
             <template v-for="n in totalPage">
                 <a @click="loadPage(n+1)"
                    class="{{pageClass}} {{isCurrentPage(n+1) ? activeClass : ''}}">
                         {{ n+1 }}
                 </a>
             </template>
         </template>
         <template v-else>
            <template v-for="n in windowSize">
                <a @click="loadPage(windowStart+n)" class="{{pageClass}} {{isCurrentPage(windowStart+n) ? activeClass : ''}}">{{ windowStart+n }}</a>

            </template>
         </template>
         <a @click="loadPage('next')"
             class="btn-nav {{linkClass}} {{isOnLastPage ? disabledClass : ''}}">
             <i v-if="icons.next != ''" class="{{icons.next}}"></i>
             <span v-else>&rsaquo;&nbsp;</span>
         </a>
         <a @click="loadPage(totalPage)"
             class="btn-nav {{linkClass}} {{isOnLastPage ? disabledClass : ''}}">
             <i v-if="icons.last != ''" class="{{icons.last}}"></i>
             <span v-else>&raquo;</span>
         </a>
    </div>
</template>

<script>
import PaginationMixin from './VuetablePaginationMixin.vue'

export default {
    mixins: [PaginationMixin],
    props: {
        'icons': {
            type: Object,
            default: function() {
                return {
                    first: 'angle double left icon',
                    prev: 'left chevron icon',
                    next: 'right chevron icon',
                    last: 'angle double right icon',
                }
            }
        },
    },
    data: function() {
        return {
            onEachSide: 2,
        }
    },
    computed: {
        notEnoughPages: function() {
            return this.totalPage < (this.onEachSide * 2) + 4
        },
        windowSize: function() {
            return this.onEachSide * 2 +1;
        },
        windowStart: function() {
            if (this.tablePagination.current_page <= this.onEachSide) {
                return 1
            } else if (this.tablePagination.current_page >= (this.totalPage - this.onEachSide)) {
                return this.totalPage - this.onEachSide*2
            }

            return this.tablePagination.current_page - this.onEachSide
        },
    },
    ready: function() {
        this.pageClass = 'btn btn-default'
        this.linkClass = 'btn btn-default'
        this.icons = {
            first: '',
            prev: '',
            next: '',
            last: '',
        }
    }
}
</script>

<style>
    .vuetable-pagination-slider {
        margin: 0;
    }
    .vuetable-pagination-slider .btn {
        margin: 2px;
        border: none;
        border-radius: 50%;
    }
    .vuetable-pagination-slider .btn.active {
        border: 1px solid transparent;
        border-radius: 50%;
        padding: 8px 14px;
        font-weight: 700;
        font-size: larger;
        color: white;
        background-color: #c83430;
    }
    .vuetable-pagination-slider .btn-nav {
        font-weight: 700;
    }
</style>