<template>
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

<script>
import PaginationMixin from './VuetablePaginationMixin.vue'

export default {
    mixins: [PaginationMixin],
    methods: {
        loadPage: function(page) {
            this.$dispatch('vuetable-pagination:change-page', page)
        },
    },
}
</script>