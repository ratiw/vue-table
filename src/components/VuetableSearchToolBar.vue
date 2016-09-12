<template>
    <div class="row">
        <div class="col-md-7 form-inline">
            <div class="form-inline form-group">
                <label>Search:</label>
                <input v-model="searchFor" class="form-control" @keyup.enter="setFilter">
                <button class="btn btn-primary" @click="setFilter">Go</button>
                <button class="btn btn-default" @click="resetFilter">Reset</button>
            </div>
        </div>
        <div class="col-md-5">
            <div class="form-inline form-group pull-right">
                <button class="btn btn-default" data-toggle="modal" data-target="#settingsModal">
                    <span class="glyphicon glyphicon-cog"></span> Settings
                </button>
            </div>
        </div>
    </div>
</template>
<style>

</style>
<script>
    export default{
        data(){
            return{
                searchFor: ''
            }
        },
        methods: {
            /**
             * Other functions
             */
            setFilter: function() {
                debugger;
                this.moreParams = [
                    'filter=' + this.searchFor
                ]
                this.$nextTick(function() {
                    this.$broadcast('vuetable:refresh')
                })
            },
            resetFilter: function() {
                this.searchFor = ''
                this.setFilter()
            },
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
            }
        }
    }




</script>
