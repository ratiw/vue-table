<template>
	<div>
		<button @click="itemAction('view-item', rowData)"><i class="glyphicon glyphicon-zoom-in"></i></button>
		<button @click="itemAction('edit-item', rowData)"><i class="glyphicon glyphicon-pencil"></i></button>
		<button @click="itemAction('delete-item', rowData)"><i class="glyphicon glyphicon-remove"></i></button>
	</div>
</template>
<style>
	@import "//cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css";
</style>
<script>
	export default{
		data(){
			return {
				msg: 'hello vue'
			}
		},
		props: {
			rowData: {
				type: Object,
				required: true
			}
		},
		methods: {
			itemAction: function(action, data) {
				sweetAlert('custom-action: ' + action, data.name)
			},
			onClick: function(event) {
				console.log('custom-action: on-click', event.target)
			},
			onDoubleClick: function(event) {
				console.log('custom-action: on-dblclick', event.target)
			}
		}
	}
</script>
