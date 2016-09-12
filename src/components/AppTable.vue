<template>
	<div id="app">
		<my-nav></my-nav>
		<div id="app" class="container">
			<!-- Example row of columns -->
			<h2 class="sub-header">List of Users</h2>
			<hr>
			<vuetable-search-tool-bar></vuetable-search-tool-bar>
			<vuetable-settings-modal></vuetable-settings-modal>

			<div class="table-responsive">
				<vuetable v-ref:vuetable
				          api-url="http://vuetable.ratiw.net/api/users"
				          pagination-path=""
				          :fields="fields"
				          :sort-order="sortOrder"
				          :multi-sort="multiSort"
				          table-class="table table-bordered table-striped table-hover"
				          ascending-icon="glyphicon glyphicon-chevron-up"
				          descending-icon="glyphicon glyphicon-chevron-down"
				          pagination-class=""
				          pagination-info-class=""
				          pagination-component-class=""
				          :pagination-component="paginationComponent"
				          :item-actions="itemActions"
				          :append-params="moreParams"
				          :per-page="perPage"
				          wrapper-class="vuetable-wrapper"
				          table-wrapper=".vuetable-wrapper"
				          loading-class="loading"
				          detail-row-callback="makeDetailRow"
				          detail-row-id="id"
				          detail-row-transition="expand"
				          row-class-callback="rowClassCB"
				></vuetable>
			</div>
		</div>

	</div>
</template>

<style>
	body {
		padding-top: 50px;
		padding-bottom: 20px;
		overflow-y: scroll;
	}
</style>
<script>
	import moment from 'moment'
	import SweetAlert from 'bootstrap-sweetalert'
	import MyNav from './MyNav.vue'
	import VuetableSearchToolBar from './VuetableSearchToolBar.vue'
	import VuetableSettingsModal from './VuetableSettingsModal.vue'
	import Vuetable from './Vuetable.vue'
//	import VuetablePagination from './VuetablePagination.vue'
//	import CustomAction from './CustomAction.vue'

	import Vue from 'vue'
	Vue.component('vuetable-pagination', require('./VuetablePagination.vue'))
	Vue.component('custom-action', require('./CustomAction.vue'))


	export default {
		components: {
			MyNav,
			VuetableSearchToolBar,
			VuetableSettingsModal,
//			'custom-action': CustomAction,
//			'vuetable-pagination': VuetablePagination,
			moment,
			SweetAlert,
			Vuetable
		},
		data(){
			return {
				fields: [
					{
						name: 'id',
						title: '',
						dataClass: 'text-center',
						callback: 'showDetailRow'
					},
					{
						name: 'name',
						sortField: 'name',
					},
					{
						name: 'email',
						sortField: 'email',
					},
					{
						name: 'nickname',
						sortField: 'nickname',
						callback: 'allCap'
					},
					{
						name: 'birthdate',
						sortField: 'birthdate',
						callback: 'formatDate|D/MM/Y'
					},
					{
						name: 'gender',
						sortField: 'gender',
						titleClass: 'text-center',
						dataClass: 'text-center',
						callback: 'gender'
					},
					{
						name: '__component:custom-action',
						title: "Component",
						titleClass: 'center aligned',
						dataClass: 'custom-action center aligned',
					},
					{
						name: '__actions',
						dataClass: 'text-center',
					}
				],
				multiSort: true,
				perPage: 10,
				paginationComponent: 'vuetable-pagination',
				paginationInfoTemplate: 'แสดง {from} ถึง {to} จากทั้งหมด {total} รายการ',
				itemActions: [
					{ name: 'view-item', label: '', icon: 'glyphicon glyphicon-zoom-in', class: 'btn btn-info', extra: {'title': 'View', 'data-toggle':"tooltip", 'data-placement': "left"} },
					{ name: 'edit-item', label: '', icon: 'glyphicon glyphicon-pencil', class: 'btn btn-warning', extra: {title: 'Edit', 'data-toggle':"tooltip", 'data-placement': "top"} },
					{ name: 'delete-item', label: '', icon: 'glyphicon glyphicon-remove', class: 'btn btn-danger', extra: {title: 'Delete', 'data-toggle':"tooltip", 'data-placement': "right" } }
				],
				moreParams: []
			}
		},methods: {
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
			showDetailRow: function(value) {
				var icon = this.$refs.vuetable.isVisibleDetailRow(value) ? 'glyphicon glyphicon-minus-sign' : 'glyphicon glyphicon-plus-sign'
				return [
					'<a class="show-detail-row">',
					'<i class="' + icon + '"></i>',
					'</a>'
				].join('')
			},
//			/**
//			 * Other functions
//			 */
//			setFilter: function() {
//				this.moreParams = [
//					'filter=' + this.searchFor
//				]
//				this.$nextTick(function() {
//					this.$broadcast('vuetable:refresh')
//				})
//			},
//			resetFilter: function() {
//				this.searchFor = ''
//				this.setFilter()
//			},
			preg_quote: function( str ) {
				// http://kevin.vanzonneveld.net
				// +   original by: booeyOH
				// +   improved by: Ates Goral (http://magnetiq.com)
				// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
				// +   bugfixed by: Onno Marsman
				// *     example 1: preg_quote("$40");
				// *     returns 1: '\$40'
				// *     example 2: preg_quote("*RRRING* Hello?");
				// *     returns 2: '\*RRRING\* Hello\?'
				// *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
				// *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'

				return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
			},
			highlight: function(needle, haystack) {
				return haystack.replace(
					new RegExp('(' + this.preg_quote(needle) + ')', 'ig'),
					'<span class="highlight">$1</span>'
				)
			},
			makeDetailRow: function(data) {
				return [
					'<td colspan="7">',
					'<div class="detail-row">',
					'<div class="form-group">',
					'<label>Name: </label>',
					'<span>' + data.name + '</span>',
					'</div>',
					'<div class="form-group">',
					'<label>Email: </label>',
					'<span>' + data.email + '</span>',
					'</div>',
					'<div class="form-group">',
					'<label>Nickname: </label>',
					'<span>' + data.nickname + '</span>',
					'</div>',
					'<div class="form-group">',
					'<label>Birthdate: </label>',
					'<span>' + data.birthdate + '</span>',
					'</div>',
					'<div class="form-group">',
					'<label>Gender: </label>',
					'<span>' + data.gender + '</span>',
					'</div>',
					'</div>',
					'</td>'
				].join('')
			},
			rowClassCB: function(data, index) {
				return (index % 2) === 0 ? 'positive' : ''
			},
			paginationConfig: function(componentName) {
				console.log('paginationConfig: ', componentName)
				if (componentName == 'vuetable-pagination') {
					this.$broadcast('vuetable-pagination:set-options', {
						wrapperClass: 'pagination',
						icons: { first: '', prev: '', next: '', last: ''},
						activeClass: 'active',
						linkClass: 'btn btn-default',
						pageClass: 'btn btn-default'
					})
				}
				if (componentName == 'vuetable-pagination-dropdown') {
					this.$broadcast('vuetable-pagination:set-options', {
						wrapperClass: 'form-inline',
						icons: { prev: 'glyphicon glyphicon-chevron-left', next: 'glyphicon glyphicon-chevron-right' },
						dropdownClass: 'form-control'
					})
				}
			},
			// -------------------------------------------------------------------------------------------
			// You can change how sort params string is constructed by overriding getSortParam() like this
			// -------------------------------------------------------------------------------------------
			// getSortParam: function(sortOrder) {
			//     console.log('parent getSortParam:', JSON.stringify(sortOrder))
			//     return sortOrder.map(function(sort) {
			//         return (sort.direction === 'desc' ? '+' : '') + sort.field
			//     }).join(',')
			// }
		},
		events: {
			'vuetable:row-changed': function(data) {
				console.log('row-changed:', data.name)
			},
			'vuetable:row-clicked': function(data, event) {
				console.log('row-clicked:', data.name)
			},
			'vuetable:cell-clicked': function(data, field, event) {
				console.log('cell-clicked:', field.name)
				if (field.name !== '__actions') {
					this.$broadcast('vuetable:toggle-detail', data.id)
				}
			},
			'vuetable:action': function(action, data) {
				console.log('vuetable:action', action, data)
				if (action == 'view-item') {
					sweetAlert(action, data.name)
				} else if (action == 'edit-item') {
					sweetAlert(action, data.name)
				} else if (action == 'delete-item') {
					sweetAlert(action, data.name)
				}
			},
			'vuetable:load-success': function(response) {
				var data = response.data.data
				console.log(data)
				if (this.searchFor !== '') {
					for (var n in data) {
						data[n].name = this.highlight(this.searchFor, data[n].name)
						data[n].email = this.highlight(this.searchFor, data[n].email)
					}
				}
			},
			'vuetable:load-error': function(response) {
				if (response.status == 400) {
					sweetAlert('Something\'s Wrong!', response.data.message, 'error')
				} else {
					sweetAlert('Oops', E_SERVER_ERROR, 'error')
				}
			}
		}
	}
</script>
