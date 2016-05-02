<template>
    <div class="{{wrapperClass}}">
         <a @click="loadPage('prev')"
             class="{{linkClass}} {{isOnFirstPage ? disabledClass : ''}}">
                 <i :class="icons.prev"></i>
         </a>
         <template v-for="n in totalPage">
             <a @click="loadPage(n+1)"
                class="{{pageClass}} {{isCurrentPage(n+1) ? disabledClass : ''}}">
                     {{ n+1 }}
             </a>
         </template>
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
}
</script>